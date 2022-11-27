export interface IProject {
    projectNumber: string;
    status: ProjectStatus;
}

export enum ProjectStatus {
    Created = 'Angelegt',
    InProgress = 'In Bearbeitung',
    Finalized = 'Abgeschlossen',
}
