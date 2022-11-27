import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEmployee } from '../../models/employee.interface';
import { DataService } from '../../data.service';

@Component({
    selector: 'scp-link-modal',
    templateUrl: './link-modal.component.html',
    styleUrls: ['./link-modal.component.scss'],
})
export class LinkModalComponent implements OnInit {
    public assignedEmployees: IEmployee[];
    public allAvailableEmployees: IEmployee[];
    public selectedEmployee: IEmployee;

    constructor(
        public dialogRef: MatDialogRef<LinkModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { assignedEmployees: { MitarbeiterID: string }[]; title: string; allEmployees: IEmployee[]; projectId: string },
        private _dataService: DataService
    ) {
        this.assignedEmployees = [];
    }

    ngOnInit() {
        this.assignedEmployees = this.data.assignedEmployees.map((employee) => {
            return this.data.allEmployees.find((nestedEmployee) => employee.MitarbeiterID === nestedEmployee.id);
        });

        this.allAvailableEmployees = this.data.allEmployees
            .filter((employee) => !this.data.assignedEmployees.some((assignedEmployee) => assignedEmployee.MitarbeiterID === employee.id))
            .sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));

        this.selectedEmployee = this.allAvailableEmployees[0];
    }

    close() {
        this.dialogRef.close();
    }

    addEmployeeToProject() {
        if (!this.selectedEmployee) {
            return;
        }

        this._dataService.addEmployeeToProject(this.selectedEmployee.id, this.data.projectId);

        const index = this.allAvailableEmployees.findIndex((employee) => this.selectedEmployee === employee);
        const employee = this.allAvailableEmployees.splice(index, 1)[0];
        this.assignedEmployees.push(employee);
        this.selectedEmployee = this.allAvailableEmployees[0];
    }

    deleteProjectLink(employee: IEmployee) {
        this._dataService.deleteEmployeeProjectLink(employee.id, this.data.projectId);

        const index = this.assignedEmployees.findIndex((employee) => this.selectedEmployee === employee);
        const removedEmployee = this.assignedEmployees.splice(index, 1)[0];

        this.allAvailableEmployees.push(removedEmployee);
        this.allAvailableEmployees.sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1));
    }
}
