import { Component, OnInit, AfterContentChecked } from '@angular/core';

import { MenuDashboardService } from "../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  constructor(
    public menuDashboard:MenuDashboardService
  ) { }
  data:any = this.menuDashboard.menu()
  ngOnInit(){
  }
  ngAfterContentChecked() {
    this.data = this.menuDashboard.menu()
  }

}
