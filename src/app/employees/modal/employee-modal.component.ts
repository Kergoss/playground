import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEmployee } from '../../models/employee.interface';
import { IDepartment } from '../../models/department.interface';

@Component({
    selector: 'scp-employee-modal',
    templateUrl: './employee-modal.component.html',
    styleUrls: ['./employee-modal.component.scss'],
})
export class EmployeeModalComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<EmployeeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { employee: IEmployee; title: string; edit: boolean; departments: IDepartment[] }
    ) {}

    ngOnInit() {}

    close() {
        this.dialogRef.close();
    }
}
