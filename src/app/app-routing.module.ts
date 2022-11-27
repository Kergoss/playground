import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employees/employee.component';
import { AdminComponent } from './admin/admin.component';
import { DepartmentComponent } from './departments/department.component';

const routes: Routes = [
    { path: 'employees', component: EmployeeComponent },
    { path: 'departments', component: DepartmentComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', component: EmployeeComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
