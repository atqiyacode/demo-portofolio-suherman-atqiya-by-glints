import { Component, OnInit,AfterViewInit,AfterContentChecked } from '@angular/core';

import { MenuDashboardService } from "../../library/service/menu-dashboard.service";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit,AfterViewInit, AfterContentChecked {

  constructor(
    public menu:MenuDashboardService
  ) { }

  ngOnInit(): void {
  }
  data:any = this.menu.menu()

  ngAfterViewInit() {
  }
  ngAfterContentChecked() {
    this.data = this.menu.menu()
  }

}
