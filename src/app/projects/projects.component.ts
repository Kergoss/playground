import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { firstValueFrom, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsModalComponent } from './modal/projects-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProject } from '../models/project.interface';
import { LinkModalComponent } from './link-modal/link-modal.component';

@Component({
    selector: 'scp-project',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
    public projects: IProject[];

    constructor(private _dataService: DataService, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
        this.projects = [];
    }

    ngOnInit() {
        this._initProjects();
    }

    private async _initProjects() {
        try {
            const result = await firstValueFrom(this._dataService.getProjects());
            this.projects = result.projects;
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public async deleteProject(id: string) {
        try {
            await firstValueFrom(this._dataService.deleteProject(id));
            const index = this.projects.findIndex((project) => project.projectNumber === id);
            this.projects.splice(index, 1);
            this.projects = [...this.projects];
        } catch (error) {
            this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
        }
    }

    public editProject(projectToEdit: IProject): void {
        const dialogRef = this._dialog.open(ProjectsModalComponent, {
            width: '500px',
            data: { project: JSON.parse(JSON.stringify(projectToEdit)), title: 'Projekt bearbeiten', edit: true },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (updatedProject) => {
                if (!updatedProject) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.updateProject(updatedProject));

                    const index = this.projects.findIndex((project) => project.projectNumber === projectToEdit.projectNumber);
                    this.projects[index] = updatedProject;
                    this.projects = [...this.projects].sort((a, b) => (a.projectNumber > b.projectNumber ? 1 : a.projectNumber === b.projectNumber ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }

    public createProject(): void {
        const dialogRef = this._dialog.open(ProjectsModalComponent, {
            width: '500px',
            data: { project: {}, title: 'Projekt erstellen', edit: false },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async (newProject) => {
                if (!newProject) {
                    return;
                }

                try {
                    await firstValueFrom(this._dataService.createProject(newProject));

                    this.projects.push(newProject);
                    this.projects = [...this.projects].sort((a, b) => (a.projectNumber > b.projectNumber ? 1 : a.projectNumber === b.projectNumber ? 0 : -1));
                } catch (error) {
                    this._snackBar.open(error?.error?.message, undefined, { duration: 5000 });
                }
            });
    }

    public async editUsersOnProject(project: IProject): Promise<void> {
        const employees = await firstValueFrom(this._dataService.getEmployeesOfProject(project));
        const result = await firstValueFrom(this._dataService.getEmployees());

        const dialogRef = this._dialog.open(LinkModalComponent, {
            width: '500px',
            data: { assignedEmployees: employees, title: 'Mitarbeiter auf dem Projekt verwalten', allEmployees: result.employees, projectId: project.projectNumber },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(async () => {
                this._initProjects();
            });
    }
}
