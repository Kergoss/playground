import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { firstValueFrom, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentModalComponent } from './modal/department-modal.component';
import { IDepartment } from '../models/department.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'scp-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
    public departments: IDepartment[];

    constructor(private _dataService: DataService, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
        this.departments = [];
    }

    ngOnInit() {
        this._initDepartments();
    }

    private async _initDepartments() {
        try {
            const result = await firstValueFrom(this._dataService.getDepartments());
            this.departments = result.departments;
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public async deleteDepartment(id: string) {
        try {
            await firstValueFrom(this._dataService.deleteDepartment(id));
            const index = this.departments.findIndex((department) => department.id === id);
            this.departments.splice(index, 1);
            this.departments = [...this.departments];
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public editDepartment(departmentToEdit: IDepartment): void {
        const dialogRef = this._dialog.open(DepartmentModalComponent, {
            width: '500px',
            data: { department: JSON.parse(JSON.stringify(departmentToEdit)), title: 'Abteilung bearbeiten', edit: true },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (updatedDepartment) => {
                if (!updatedDepartment) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.updateDepartment(updatedDepartment));

                    const index = this.departments.findIndex((department) => department.id === departmentToEdit.id);
                    this.departments[index] = updatedDepartment;
                    this.departments = [...this.departments].sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }

    public createDepartment(): void {
        const dialogRef = this._dialog.open(DepartmentModalComponent, {
            width: '500px',
            data: { department: {}, title: 'Abteilung erstellen', edit: false },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (newDepartment) => {
                if (!newDepartment) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.createDepartment(newDepartment));

                    this.departments.push(newDepartment);
                    this.departments = [...this.departments].sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }
}
