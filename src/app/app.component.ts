import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'scp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private _router: Router) {}

    public navigateTo(target: string): void {
        this._router.navigateByUrl(`${target}`);
    }
}
