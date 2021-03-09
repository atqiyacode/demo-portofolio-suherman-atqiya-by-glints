import { Component, OnInit } from '@angular/core';
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-detail-result-opname',
  templateUrl: './detail-result-opname.component.html',
  styleUrls: ['./detail-result-opname.component.css']
})
export class DetailResultOpnameComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private router: Router,
  	public menuService: MenuDashboardService,
  ) { }

  public diffPrice(inSystem: number, inStock: number) {
    return inStock - inSystem
  }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard: any [] = this.menuService.menu()
  menuBreadcrumb: any [] = this.configMenuDashboard['brd-detil-result-opname']

  ngOnInit(): void {
  	this.getResultOpnameDetail()
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = 'true'
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }

  dataApi: any = []
  getResultOpnameDetail() {
  	let url = `/opname/${this.apiBackend.serviceAuth()['tenant_id']}/detail/${this.lastUrlSegment(this.router.url)}`
  	this.apiBackend.Show(url).subscribe((data: {}) => {
  		this.dataApi.push(Object.assign({}, data))
  		console.log(this.dataApi[0])
  	}, (err) => {
  		console.log(err)
  	})
  }

  private lastUrlSegment(url) {
    return url.substr(url.lastIndexOf('/') + 1)
  }

}
