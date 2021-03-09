import { Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { MenuDashboardService } from "../../views/library/service/menu-dashboard.service";

import { ApiBackendService } from "../../auth/api-backend.service";

import * as _ from 'lodash';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterContentChecked {

  constructor(
    public fb: FormBuilder,
    public menuService: MenuDashboardService,
    private auth: ApiBackendService,
    private router: Router,
    private activated: ActivatedRoute,
  ) { }

  dataLanguage = [
    { 'id': 0, "name": "Indonesia", "icon": "assets/img/indonesia.png" },
    { 'id': 1, "name": "English", "icon": "assets/img/uk.png" },
    // {'id':3,"name":"Indonesia","icon":"assets/img/indonesia.png"}
  ]
  activeLanguage = this.dataLanguage[0]
  formLanguage = this.fb.group({
    name: ['Indonesia'],
    id: ['1'],
    icon: ['assets/img/indonesia.png']
  })
  key = "language"
  menu = this.menuService.menu()
  activeDashboard = "active"
  activeMenu = "active"
  headerActive = 1

  ngOnInit() {
  }
  ngAfterContentChecked() {
    // this.setActiveMenu(localStorage.getItem("act_m"))
    let contentSettingUrl = this.activated.snapshot.children[0].routeConfig.path;
    if (contentSettingUrl === 'dashboard-content-setting' || contentSettingUrl === 'manage-discount') {
      this.headerActive = 0
    } else {
      this.headerActive = 1
    }
  }

  setLanguage(id) {

    localStorage.setItem(this.key, id);
    this.activeLanguage = this.dataLanguage[id]
    this.menu = this.menuService.menu()
    // console.log(localStorage.getItem(key))

  }
  setting() {
    for (let index = 0; index < this.menu.header.length; index++) {
      if (this.menu.header[index]['active'] == "active") {
        this.menu.header[index]['active'] = ""
        localStorage.setItem('act_m', "0")
      }
    }
  }
  logout() {
    this.auth.logout()
  }
}
