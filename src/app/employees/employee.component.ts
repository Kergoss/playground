import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { firstValueFrom, take } from 'rxjs';
import { IEmployee } from '../models/employee.interface';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeModalComponent } from './modal/employee-modal.component';
import { IDepartment } from '../models/department.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'scp-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
    public employees: IEmployee[];
    public departments: IDepartment[];

    constructor(private _dataService: DataService, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
        this.employees = [];
    }

    ngOnInit() {
        this._initEmployees();
        this._initDepartments();
    }

    private async _initEmployees() {
        try {
            const result = await firstValueFrom(this._dataService.getEmployees());
            this.employees = result.employees;
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    private async _initDepartments() {
        try {
            const result = await firstValueFrom(this._dataService.getDepartments());
            this.departments = result.departments;
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public async deleteEmployee(id: string) {
        try {
            await firstValueFrom(this._dataService.deleteEmployee(id));
            const index = this.employees.findIndex((employee) => employee.id === id);
            this.employees.splice(index, 1);
            this.employees = [...this.employees];
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public editEmployee(employeeToEdit: IEmployee): void {
        const dialogRef = this._dialog.open(EmployeeModalComponent, {
            width: '500px',
            data: { employee: JSON.parse(JSON.stringify(employeeToEdit)), title: 'Mitarbeiter bearbeiten', edit: true, departments: this.departments },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (updatedEmployee) => {
                if (!updatedEmployee) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.updateEmployee(updatedEmployee));

                    const index = this.employees.findIndex((employee) => employee.id === employeeToEdit.id);
                    this.employees[index] = updatedEmployee;
                    this.employees = [...this.employees].sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }

    public createEmployee(): void {
        const dialogRef = this._dialog.open(EmployeeModalComponent, {
            width: '500px',
            data: { employee: {}, title: 'Mitarbeiter erstellen', edit: false, departments: this.departments },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (newEmployee) => {
                if (!newEmployee) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.createEmployee(newEmployee));

                    this.employees.push(newEmployee);
                    this.employees = [...this.employees].sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }
}
