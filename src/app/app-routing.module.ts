import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employees/employee.component';
import { AdminComponent } from './admin/admin.component';
import { DepartmentComponent } from './departments/department.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
    { path: 'employees', component: EmployeeComponent },
    { path: 'departments', component: DepartmentComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', component: EmployeeComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
