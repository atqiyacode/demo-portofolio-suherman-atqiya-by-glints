import { Component, OnInit } from '@angular/core';
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-plan-detail-opname',
  templateUrl: './plan-detail-opname.component.html',
  styleUrls: ['./plan-detail-opname.component.css']
})
export class PlanDetailOpnameComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private router: Router,
  	public menuService: MenuDashboardService,
  ) { }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard: any [] = this.menuService.menu()
  menuBreadcrumb: any [] = this.configMenuDashboard['brd-detil-plan-opname']

  ngOnInit(): void {
  	this.getPlanOpnameDetail()
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = 'true'
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }

  private lastUrlSegment(url) {
    return url.substr(url.lastIndexOf('/') + 1)
  }

  dataApi: any = []
  getPlanOpnameDetail() {
  	let url = `/opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/detail/${this.lastUrlSegment(this.router.url)}`
  	this.apiBackend.Show(url).subscribe((data: {}) => {
  		this.dataApi.push(Object.assign({}, data))
  	}, (err) => {
  		console.log(err)
  	})
  }

}
