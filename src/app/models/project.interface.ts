export interface IProject {
    projectNumber: string;
    status: ProjectStatus;
    employees?: string;
}

export enum ProjectStatus {
    Created = 'Angelegt',
    InProgress = 'In Bearbeitung',
    Finalized = 'Abgeschlossen',
}
