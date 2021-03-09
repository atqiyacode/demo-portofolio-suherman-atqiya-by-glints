import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { FormControl } from "@angular/forms";
import { InventoryService } from "../../../library/service/inventory.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import * as _ from 'lodash';

@Component({
  selector: 'app-inventory-summary',
  templateUrl: './inventory-summary.component.html',
  styleUrls: ['./inventory-summary.component.css']
})
export class InventorySummaryComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
  	public menuService: MenuDashboardService,
  	public InventoryService: InventoryService
  ) { }

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent

  /** CONFIG ATTRIBUTE IN SERVICE */
  configAttribute = this.InventoryService.configInventorySummary()
  configMenuDashboard = this.menuService.menu()
  menuBreadCrumb = this.configMenuDashboard['brd-summary']
  titleCardAccount = this.configAttribute['titleInformation']
  dataColumnTable = this.configAttribute['columnTable']

  alertError = false
  table = false
  errorMessage = ""
  defaultWarehouseId = 0
  afterInit = 0

  warehouse = new FormControl()
  dataApi:any = {}
  dataWarehouse:any = {}

  /** init component */
  ngOnInit() {
  	this.apiBackend.serviceAuth()
  	this.menuBreadCrumb[1]['color'] = "#1c100b"

  	this.warehouseList()
  }

  ngAfterViewInit() {
    this.afterInit = 1
  }

  ngAfterViewChecked() {
    if (this.paginationComp.type != 0) {
      this.onPagination(this.paginationComp.type)
    }
  }

  /** event change warehouse */
  changeWarehouse(e) {
  	if (e != null) {
  		this.defaultWarehouseId = e
  		this.getAll()
  	} else {
  		this.warehouseList()
  	}
  }

  getAll() {
  	let url = "inventory-product/"+this.apiBackend.serviceAuth()['tenant_id']+'/warehouse/'+this.defaultWarehouseId
  	this.apiBackend.Show(url).subscribe((data: {}) => {
  		this.dataApi = data
      for (let index = 0; index < this.dataApi.data.data.length; index++) {
        let var1 = []
        let var2 = []
        if (this.dataApi.data.data[index]['inventories'] != 0) {
          this.dataApi.data.data[index]['inventories'].forEach(element => {
            if (element.variants.length != 0) {
              
              element['variants'].forEach(variant => {
                if (_.isEmpty(variant['var1']) == false) {
                  var1.push(variant['var1'])
                }
                if (_.isEmpty(variant['var2']) == false) {
                  var2.push(variant['var2'])
                }
                this.dataApi.data.data[index]['variant1'] = _.uniq(var1)
                this.dataApi.data.data[index]['variant2'] = _.uniq(var2)
              });
            } else {
              this.dataApi.data.data[index]['variant1'] = []
              this.dataApi.data.data[index]['variant2'] = []
            }
           
          });
        } else {
          this.dataApi.data.data[index]['variant1'] = []
          this.dataApi.data.data[index]['variant2'] = []
        }
      }
      
  		if(this.dataApi.data.data.length > 0) {
  			this.table = true
  		}
  	}, (err) => {
  		this.alertError = true
  		this.errorMessage = err
  	});
  }

  warehouseList() {
  	this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
  		this.dataWarehouse = data
  		for(let index = 0; index < this.dataWarehouse.data.length; index++) {
  			if(this.dataWarehouse.data[index].is_default == 1) {
  				this.defaultWarehouseId = this.dataWarehouse.data[index].id
  				this.getAll()
  				return false
  			}
  		}
  	}, (err) => {
  		console.log(err)
  		this.alertError = true
  		this.errorMessage = err
  	});
  }

  onPagination(type) {
    this.paginationComp.type = 0
    let urlPagination = 1
    if (type == 1) {
      urlPagination = this.dataApi.data.first_page_url
    } else if(type==2) {
      urlPagination = this.dataApi.data.prev_page_url
    } else if(type==3) {
      urlPagination = this.dataApi.data.next_page_url
    } else {
      urlPagination = this.dataApi.data.last_page_url
    }
    this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => { 
      this.dataApi = data
    },
    (err) => {
      // this.alertError = true
      // this.errorMessage = err
    });  
  }

}
