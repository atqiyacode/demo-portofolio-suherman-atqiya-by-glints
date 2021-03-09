import { Component, OnInit, AfterViewInit, AfterContentChecked} from '@angular/core';

import { MenuDashboardService } from "../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements AfterViewInit, AfterContentChecked {
  
  constructor(
    public language:MenuDashboardService
  ) { }
  
  data:any = this.language.menu()

  ngAfterViewInit() {
  }
  ngAfterContentChecked() {
    this.data = this.language.menu()
  }

}
