import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEmployee } from './models/employee.interface';
import { firstValueFrom, Observable } from 'rxjs';
import { IDepartment } from './models/department.interface';
import { IProject } from './models/project.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
    constructor(private _httpClient: HttpClient) {}

    getEmployees(): Observable<{ employees: IEmployee[] }> {
        return this._httpClient.get<{ employees: IEmployee[] }>(`http://localhost:8080/api/employees`, { headers: this._getCorsHeaders() });
    }

    deleteEmployee(id: string): Observable<void> {
        return this._httpClient.delete<void>(`http://localhost:8080/api/employees/${id}`, { headers: this._getCorsHeaders() });
    }

    createEmployee(employee: IEmployee): Observable<void> {
        return this._httpClient.post<void>(`http://localhost:8080/api/employees`, employee, { headers: this._getCorsHeaders() });
    }

    updateEmployee(employee: IEmployee): Observable<void> {
        return this._httpClient.put<void>(`http://localhost:8080/api/employees/${employee.id}`, employee, { headers: this._getCorsHeaders() });
    }

    getDepartments(): Observable<{ departments: IDepartment[] }> {
        return this._httpClient.get<{ departments: IDepartment[] }>(`http://localhost:8080/api/departments`, { headers: this._getCorsHeaders() });
    }

    deleteDepartment(id: string): Observable<void> {
        return this._httpClient.delete<void>(`http://localhost:8080/api/departments/${id}`, { headers: this._getCorsHeaders() });
    }

    updateDepartment(department: IDepartment): Observable<void> {
        return this._httpClient.put<void>(`http://localhost:8080/api/departments/${department.id}`, department, { headers: this._getCorsHeaders() });
    }

    createDepartment(department: IDepartment): Observable<void> {
        return this._httpClient.post<void>(`http://localhost:8080/api/departments`, department, { headers: this._getCorsHeaders() });
    }

    getProjects(): Observable<{ projects: IProject[] }> {
        return this._httpClient.get<{ projects: IProject[] }>(`http://localhost:8080/api/projects`, { headers: this._getCorsHeaders() });
    }

    deleteProject(id: string): Observable<void> {
        return this._httpClient.delete<void>(`http://localhost:8080/api/projects/${id}`, { headers: this._getCorsHeaders() });
    }

    updateProject(project: IProject): Observable<void> {
        return this._httpClient.put<void>(`http://localhost:8080/api/projects/${project.projectNumber}`, project, { headers: this._getCorsHeaders() });
    }

    createProject(project: IProject): Observable<void> {
        return this._httpClient.post<void>(`http://localhost:8080/api/projects`, project, { headers: this._getCorsHeaders() });
    }

    seedData(): Promise<void> {
        return firstValueFrom(this._httpClient.post<any>(`http://localhost:8080/api/seed`, { headers: this._getCorsHeaders() }));
    }

    clearData(): Promise<void> {
        return firstValueFrom(this._httpClient.post<any>(`http://localhost:8080/api/clear`, { headers: this._getCorsHeaders() }));
    }

    private _getCorsHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.append('Access-Control-Allow-Origin', '*');
    }
}
