import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { EmployeeComponent } from './employees/employee.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeModalComponent } from './employees/modal/employee-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { AdminComponent } from './admin/admin.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [AppComponent, EmployeeComponent, EmployeeModalComponent, AdminComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatDividerModule,
        MatSnackBarModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
