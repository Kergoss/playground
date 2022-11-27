import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProject, ProjectStatus } from '../../models/project.interface';

@Component({
    selector: 'scp-project-modal',
    templateUrl: './projects-modal.component.html',
    styleUrls: ['./projects-modal.component.scss'],
})
export class ProjectsModalComponent implements OnInit {
    public statuses = [ProjectStatus.Created, ProjectStatus.InProgress, ProjectStatus.Finalized];

    constructor(public dialogRef: MatDialogRef<ProjectsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { project: IProject; title: string; edit: boolean }) {}

    ngOnInit() {}

    close() {
        this.dialogRef.close();
    }
}
