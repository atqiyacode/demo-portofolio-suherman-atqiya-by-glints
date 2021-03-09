import { Component, OnInit } from '@angular/core';
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-detail-inventory-adjustment',
  templateUrl: './detail-inventory-adjustment.component.html',
  styleUrls: ['./detail-inventory-adjustment.component.css']
})
export class DetailInventoryAdjustmentComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private router: Router,
  	public menuService: MenuDashboardService,
  ) { }

  public totalPrice(qty: number, basePrice: number) {
    return qty * basePrice
  }

  public checkEmptyVariant(variant: any, product: any) {
    if (_.isEmpty(variant)) {
      let emptyValue = {
        sku: product.sku,
        value1: '',
        value2: '',
      }
      variant.push(Object.assign({}, emptyValue))
    }

    return variant
  }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard: any [] = this.menuService.menu()
  menuBreadcrumb: any [] = this.configMenuDashboard['brd-detail-adjustment']

  dataApi: any = []

  ngOnInit(): void {
    this.getDetailData()
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

  getDetailData() {
    let url = `/adjustment/${this.apiBackend.serviceAuth()['tenant_id']}/show/${this.lastUrlSegment(this.router.url)}`
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataApi.push(Object.assign({}, data))
      // console.log(data)
    }, (err) => {
      console.log(err)
    })
  }

}
