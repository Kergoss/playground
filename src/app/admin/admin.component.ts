import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'scp-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    public clickedClearData: boolean;

    constructor(private _dataService: DataService) {}

    ngOnInit() {}

    public async seedData(): Promise<void> {
        await this._dataService.seedData();
    }

    public clearData() {
        this._dataService.clearData();
        this.clickedClearData = false;
    }
}
