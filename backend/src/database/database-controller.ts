import * as fs from 'fs-extra';
import * as path from 'node:path';
import { Database } from 'sqlite3';
import { TableName } from './table-names.enum';

const sqlite3 = require('sqlite3').verbose();

export class DatabaseController {
    private readonly _databasePath = path.resolve(__dirname, 'db', 'database.db');
    private _db: Database;

    public ensureDb() {
        if (!fs.existsSync(this._databasePath)) {
            fs.createFileSync(this._databasePath);
        }

        this._db = new sqlite3.Database(this._databasePath, (error) => {
            if (error) {
                return console.error('Database creation failed', error.message);
            }

            this._ensureTables();
        });
    }

    public getAll(table: TableName) {
        return new Promise((resolve, reject) => {
            this._db.all(`SELECT * FROM ${table};`, (error, rows) => {
                if (error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    public getAllEmployees() {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${TableName.Employee}.ID, ${TableName.Employee}.Abteilung, ${TableName.Employee}.Vorname,
                                  ${TableName.Employee}.Nachname, ${TableName.Department}.Fax, 
                                  GROUP_CONCAT(${TableName.EmployeeToProject}.AuftragsNummer) AS AuftragsNummern
                           FROM ${TableName.Employee}
                           LEFT JOIN ${TableName.Department}                           
                           ON ${TableName.Employee}.Abteilung = ${TableName.Department}.ID
                           LEFT JOIN ${TableName.EmployeeToProject}
                           ON ${TableName.Employee}.ID = ${TableName.EmployeeToProject}.MitarbeiterID
                           GROUP BY ${TableName.Employee}.ID
                            `;
            this._db.all(query, (error, rows) => {
                if (error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    public getAllProjects() {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${TableName.Project}.AuftragsNummer,
                           ${TableName.Project}.Status, ${TableName.Employee}.ID, 
                           GROUP_CONCAT((${TableName.Employee}.Vorname || " " || ${TableName.Employee}.Nachname)) AS Mitarbeiter
                           FROM ${TableName.Project}
                           LEFT JOIN ${TableName.EmployeeToProject}
                           ON ${TableName.Project}.AuftragsNummer = ${TableName.EmployeeToProject}.AuftragsNummer
                           LEFT JOIN ${TableName.Employee}
                           ON ${TableName.Employee}.ID = ${TableName.EmployeeToProject}.MitarbeiterID 
                           GROUP BY ${TableName.Project}.AuftragsNummer
                            `;
            this._db.all(query, (error, rows) => {
                if (error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    public get(table: TableName, columnName: string, id: string, multiple = false) {
        return new Promise((resolve, reject) => {
            this._db.all(`SELECT * FROM ${table} WHERE ${columnName} = "${id}";`, (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (multiple) {
                    resolve(result);
                } else {
                    resolve(result ? result[0] : {});
                }
            });
        });
    }

    public insert(table: TableName, columns: string, values: string) {
        return new Promise<void>((resolve, reject) => {
            this._db.run(`INSERT INTO ${table} (${columns}) VALUES (${values});`, (error, result) => {
                if (error?.code) {
                    // 'SQLITE_ERROR'
                    // 'SQLITE_CONSTRAINT'
                    console.error(error.message);
                    return reject(error.code);
                }

                resolve();
            });
        });
    }

    public update(table: TableName, command: string, idColumn: string, id: string) {
        return new Promise<void>((resolve, reject) => {
            const query = `UPDATE ${table} SET ${command} WHERE ${idColumn} = "${id}";`;
            this._db.run(query, (error, result) => {
                if (error?.code) {
                    console.error(`Update failed: `, error.message);
                    console.error(`Query: `, query);
                    return reject(error.code);
                }

                resolve();
            });
        });
    }

    public delete(table: TableName, idColumn: string, id: string) {
        return new Promise<void>((resolve, reject) => {
            const query = `DELETE FROM ${table} WHERE ${idColumn} = "${id}";`;
            this._db.run(query, (error, result) => {
                if (error?.code) {
                    console.error(`Deletion failed: `, error.message);
                    console.error(`Query: `, query);
                    return reject(error.code);
                }

                resolve();
            });
        });
    }

    public deleteLink(projectId: string, employeeId: string) {
        return new Promise<void>((resolve, reject) => {
            const query = `DELETE FROM ${TableName.EmployeeToProject} WHERE "MitarbeiterID" = "${employeeId}" AND "AuftragsNummer" = "${projectId}";`;
            this._db.run(query, (error, result) => {
                if (error?.code) {
                    console.error(`Deletion failed: `, error.message);
                    console.error(`Query: `, query);
                    return reject(error.code);
                }

                resolve();
            });
        });
    }

    public deleteAll(table: TableName) {
        return new Promise<void>((resolve, reject) => {
            const query = `DELETE FROM ${table}`;
            this._db.run(query, (error, result) => {
                if (error?.code) {
                    console.error(`Deletion failed: `, error.message);
                    console.error(`Query: `, query);
                    return reject(error.code);
                }

                resolve();
            });
        });
    }

    private _ensureTables() {
        this._db.serialize(() => {
            this._db.prepare(this._getDepartmentTableQuery()).run().finalize();
            this._db.prepare(this._getProjectTableQuery()).run().finalize();
            this._db.prepare(this._getEmployeeTableQuery()).run().finalize();
            this._db.prepare(this._getEmployeeWithProjectTableQuery()).run().finalize();
        });
    }

    private _getEmployeeTableQuery(): string {
        return `CREATE TABLE IF NOT EXISTS ${TableName.Employee} (
                    ID INTEGER PRIMARY KEY,
                    Vorname TEXT,
                    Nachname TEXT,
                    Abteilung TEXT,
                    FOREIGN KEY (Abteilung) REFERENCES ${TableName.Department} (ID)
               ) WITHOUT ROWID;`;
    }

    private _getDepartmentTableQuery(): string {
        return `CREATE TABLE IF NOT EXISTS ${TableName.Department} (
                    ID TEXT PRIMARY KEY,
                    Fax TEXT
               ) WITHOUT ROWID;`;
    }

    private _getProjectTableQuery(): string {
        return `CREATE TABLE IF NOT EXISTS ${TableName.Project} (
                    AuftragsNummer INTEGER PRIMARY KEY,
                    Status TEXT
               ) WITHOUT ROWID;`;
    }

    private _getEmployeeWithProjectTableQuery(): string {
        return `CREATE TABLE IF NOT EXISTS ${TableName.EmployeeToProject} (
                    MitarbeiterID INTEGER,
                    AuftragsNummer INTEGER,
                    FOREIGN KEY (MitarbeiterID) REFERENCES ${TableName.Employee} (ID),
                    FOREIGN KEY (AuftragsNummer) REFERENCES ${TableName.Project} (AuftragsNummer),
                    PRIMARY KEY (MitarbeiterID, AuftragsNummer)
               ) WITHOUT ROWID;`;
    }
}
