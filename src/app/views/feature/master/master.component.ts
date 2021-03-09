import { Component, OnInit, AfterViewInit,AfterContentChecked } from '@angular/core';

import { MenuDashboardService } from "../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, AfterViewInit, AfterContentChecked {

  constructor(
    public language:MenuDashboardService
  ) { }

  ngOnInit(): void {
  }
  data:any = this.language.menu()

  ngAfterViewInit() {
  }
  ngAfterContentChecked() {
    this.data = this.language.menu()
  }

}
