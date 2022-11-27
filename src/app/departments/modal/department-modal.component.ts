import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDepartment } from '../../models/department.interface';

@Component({
    selector: 'scp-department-modal',
    templateUrl: './department-modal.component.html',
    styleUrls: ['./department-modal.component.scss'],
})
export class DepartmentModalComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<DepartmentModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { department: IDepartment; title: string; edit: boolean }) {}

    ngOnInit() {}

    close() {
        this.dialogRef.close();
    }
}
