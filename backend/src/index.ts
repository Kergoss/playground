import { DatabaseController } from './database/database-controller';
import { TableName } from './database/table-names.enum';
import { IEmployee } from '../../src/app/models/employee.interface';
import { IDepartment } from '../../src/app/models/department.interface';
import { IProject, ProjectStatus } from '../../src/app/models/project.interface';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Init the server
const server = app.listen(8080, function () {
    const port = server.address().port;
    console.log('App now running on port', port);
});

// ###### Employee ######

app.get('/api/employees', async (req, res) => {
    try {
        const result = await dbController.getAllEmployees();
        const mappedResult: IEmployee[] = (result as any[]).map((value) => {
            return {
                id: value.ID,
                firstName: value.Vorname,
                lastName: value.Nachname,
                department: value.Abteilung,
                fax: value.Fax,
                projects: value.AuftragsNummern?.replace(/,/g, ', '),
            };
        });
        res.status(200).json({ employees: mappedResult });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

app.post('/api/employees', async (req, res) => {
    const employee: IEmployee = req.body;

    try {
        const result = await dbController.insert(
            TableName.Employee,
            'ID, Vorname, Nachname, Abteilung',
            `"${employee.id}", "${employee.firstName}", "${employee.lastName}", "${employee.department}"`
        );
        res.status(200).json(result);
    } catch (error) {
        if (error === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: `Fehler: Benutzer kann nicht erstellt werden. Ein Benutzer mit der ID '${employee.id}' existiert bereits.` });
        }

        res.status(500).json({ message: 'Fehler: Der Benutzer konnte nicht erstellt werden.' });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    const employee: IEmployee = req.body;

    try {
        const result = await dbController.update(
            TableName.Employee,
            `Vorname = "${employee.firstName}", Nachname = "${employee.lastName}", Abteilung = "${employee.department}"`,
            'ID',
            req.params.id
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Fehler: Der Benutzer konnte nicht geupdated werden.' });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const result = await dbController.delete(TableName.Employee, 'ID', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Der Benutzer konnte nicht gelöscht werden.' });
    }
});

// ########################

// ########## Department ###########

app.get('/api/departments', async (req, res) => {
    try {
        const result = await dbController.getAll(TableName.Department);
        const mappedResult: IDepartment[] = (result as any[]).map((value) => {
            return {
                id: value.ID,
                fax: value.Fax,
            };
        });
        res.status(200).json({ departments: mappedResult });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

app.post('/api/departments', async (req, res) => {
    const department: IDepartment = req.body;

    try {
        const result = await dbController.insert(TableName.Department, 'ID, Fax', `"${department.id}", "${department.fax}"`);
        res.status(200).json(result);
    } catch (error) {
        if (error === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: `Fehler: Abteilung kann nicht erstellt werden. Eine Abteilung mit der ID '${department.id}' existiert bereits.` });
        }

        res.status(500).json({ message: 'Fehler: Die Abteilung konnte nicht erstellt werden.' });
    }
});

app.put('/api/departments/:id', async (req, res) => {
    const department: IDepartment = req.body;

    try {
        const result = await dbController.update(TableName.Department, `Fax = "${department.fax}"`, 'ID', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Fehler: Die Abteilung konnte nicht geupdated werden.' });
    }
});

app.delete('/api/departments/:id', async (req, res) => {
    try {
        const employees: any = await dbController.getAll(TableName.Employee);
        const hasEmployeesInDepartment = employees.some((employee) => employee.Abteilung === req.params.id);
        if (hasEmployeesInDepartment) {
            return res.status(409).json({ message: 'Die Abteilung kann nicht gelöscht werden: Mindestens ein Mitarbeiter gehört zu dieser Abteilung.' });
        }

        const result = await dbController.delete(TableName.Department, 'ID', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Die Abteilung konnte nicht gelöscht werden.' });
    }
});

// #####################

// ########### Project ###########

app.get('/api/projects', async (req, res) => {
    try {
        const result = await dbController.getAllProjects();
        const mappedResult: IProject[] = (result as any[]).map((value) => {
            return {
                projectNumber: value.AuftragsNummer,
                status: value.Status,
                employees: value.Mitarbeiter?.replace(/,/g, ', '),
            };
        });
        res.status(200).json({ projects: mappedResult });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

app.post('/api/projects', async (req, res) => {
    const project: IProject = req.body;

    try {
        const result = await dbController.insert(TableName.Project, 'AuftragsNummer, Status', `"${project.projectNumber}", "${project.status}"`);
        res.status(200).json(result);
    } catch (error) {
        if (error === 'SQLITE_CONSTRAINT') {
            return res
                .status(409)
                .json({ message: `Fehler: Projekt kann nicht erstellt werden. Ein Projekt mit der Auftragsnummer '${project.projectNumber}' existiert bereits.` });
        }

        res.status(500).json({ message: 'Fehler: Das Projekt konnte nicht erstellt werden.' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const project: IProject = req.body;

    try {
        const result = await dbController.update(TableName.Project, `Status = "${project.status}"`, 'AuftragsNummer', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Fehler: Das Projekt konnte nicht geupdated werden.' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const result = await dbController.delete(TableName.Project, 'AuftragsNummer', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Das Projekt konnte nicht gelöscht werden.' });
    }
});

app.delete('/api/employees-of-project/:projectId/:employeeId', async (req, res) => {
    try {
        const result = await dbController.deleteLink(req.params.projectId, req.params.employeeId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Die Projektverknüpfungen konnte nicht gelöscht werden.' });
    }
});

app.post('/api/employees-of-project/:projectId/:employeeId', async (req, res) => {
    try {
        const result = await dbController.insert(TableName.EmployeeToProject, 'AuftragsNummer, MitarbeiterID', `"${req.params.projectId}", "${req.params.employeeId}"`);
        res.status(200).json(result);
    } catch (error) {
        if (error === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: `Fehler: Der Mitarbeiter kann nicht zu diesem Projekt hinzugefügt werden, da er bereits an diesem Projekt arbeitet.` });
        }

        res.status(500).json({ message: 'Fehler: Der Mitarbeiter konnte nicht zu diesem Projekt hinzugefügt werden.' });
    }
});

app.get('/api/employees-of-project/:id', async (req, res) => {
    try {
        const result = await dbController.get(TableName.EmployeeToProject, 'AuftragsNummer', req.params.id, true);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Die Projektverknüpfungen konnten nicht geladen werden.' });
    }
});

// ######################

// ########### Admin ###########

app.post('/api/clear', async (req, res) => {
    await dbController.deleteAll(TableName.EmployeeToProject);
    await dbController.deleteAll(TableName.Employee);
    await dbController.deleteAll(TableName.Project);
    await dbController.deleteAll(TableName.Department);

    res.status(200).json({ message: 'Daten gelöscht.' });
});

app.post('/api/seed', async (req, res) => {
    try {
        for (let i = 0; i < mockDepartments.length; i++) {
            try {
                const department = mockDepartments[i];
                await dbController.insert(TableName.Department, 'ID, Fax', `"${department.id}", "${department.fax}"`);
            } catch (err) {}
        }

        for (let i = 0; i < mockEmployees.length; i++) {
            try {
                const employee = mockEmployees[i];
                await dbController.insert(
                    TableName.Employee,
                    'ID, Vorname, Nachname, Abteilung',
                    `"${employee.id}", "${employee.firstName}", "${employee.lastName}", "${employee.department}"`
                );
            } catch (err) {}
        }

        for (let i = 0; i < mockProjects.length; i++) {
            try {
                const project = mockProjects[i];
                await dbController.insert(TableName.Project, 'AuftragsNummer, Status', `"${project.projectNumber}", "${project.status}"`);
            } catch (err) {}
        }

        for (let i = 0; i < mockProjectRelations.length; i++) {
            try {
                const relation = mockProjectRelations[i];
                await dbController.insert(TableName.EmployeeToProject, 'MitarbeiterID, AuftragsNummer', `"${relation.id}", "${relation.projectNumber}"`);
            } catch (err) {}
        }

        res.status(200).json({ message: 'Beispieldaten wurden erfolgreich eingefügt.' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// ###########################

const dbController = new DatabaseController();
dbController.ensureDb();

const mockEmployees: IEmployee[] = [
    { id: '1', firstName: 'Fabienne', lastName: 'Flantz', department: 'Einkauf' },
    { id: '2', firstName: 'Amir', lastName: 'Mans', department: 'Einkauf' },
    { id: '3', firstName: 'Dennis', lastName: 'Budig', department: 'Verkauf' },
    { id: '4', firstName: 'Annekatrin', lastName: 'Speer', department: 'Verkauf' },
    { id: '5', firstName: 'Ralf-Dieter', lastName: 'Scheuermann', department: 'Verkauf' },
    { id: '6', firstName: 'Katherina', lastName: 'Fliegner', department: 'IT' },
    { id: '7', firstName: 'Bertold', lastName: 'Austermühle', department: 'IT' },
];

const mockDepartments: IDepartment[] = [
    { id: 'Einkauf', fax: '00 49 123 4566' },
    { id: 'Verkauf', fax: '00 49 123 4567' },
    { id: 'IT', fax: '00 49 123 4568' },
];

const mockProjects: IProject[] = [
    { projectNumber: '9800001', status: ProjectStatus.Created },
    { projectNumber: '9800002', status: ProjectStatus.InProgress },
    { projectNumber: '9800003', status: ProjectStatus.Finalized },
];

const mockProjectRelations = [
    { projectNumber: '9800001', id: '1' },
    { projectNumber: '9800001', id: '2' },
    { projectNumber: '9800001', id: '3' },
    { projectNumber: '9800001', id: '4' },
    { projectNumber: '9800002', id: '1' },
    { projectNumber: '9800002', id: '4' },
    { projectNumber: '9800003', id: '1' },
    { projectNumber: '9800003', id: '6' },
    { projectNumber: '9800003', id: '7' },
];
