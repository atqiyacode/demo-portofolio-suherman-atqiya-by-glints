import { Component, OnInit,Input, AfterViewChecked } from '@angular/core';

import { MenuDashboardService } from "../../../views/library/service/menu-dashboard.service";
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, AfterViewChecked {

  constructor(
    public menuService:MenuDashboardService,
  ) { }
  @Input() data:any = {}
  menu = this.menuService.menu()
  ngOnInit(){
    // console.log(this.data)
  }
  ngAfterViewChecked() {
    
  }
  setMenu(id) {
    if (id == "1") {
      this.menu.header[0]['active'] == "active"
      localStorage.setItem('act_m', "1")
    }
    for (let index = 0; index < this.menu.header.length; index++) {
      if (this.menu.header[index]['active'] == "active") {
        this.menu.header[index]['active'] = ""
      }
    }
  }
  search(e) {
    console.log(e.target.value)
  }

}
