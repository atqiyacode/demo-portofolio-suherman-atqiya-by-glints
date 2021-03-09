import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { InventoryService } from "../../../library/service/inventory.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { FormControl } from '@angular/forms';
import { fromEvent, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter} from "rxjs/operators";
import { Router } from '@angular/router';
import { NotificationService } from "../../../library/service/notification.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-plan-opname',
  templateUrl: './plan-opname.component.html',
  styleUrls: ['./plan-opname.component.css']
})
export class PlanOpnameComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
    private router: Router,
    private notify: NotificationService,
  	public menuService: MenuDashboardService,
  	public inventoryService: InventoryService,
  ) { }

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef

  /** CONFIG ATTRIBUTE IN SERVICE */
  configAttribute: any = this.inventoryService.configInventoryOpname()
  configMenuDashboard: any = this.menuService.menu()
  menuBreadcrumb: any = this.configMenuDashboard['brd-plan-opname']
  titleCard: string = this.configAttribute['titleInformation']
  dataColumnTable: any = this.configAttribute['columnTable']
  urlCreate: string = this.router.url+'/create-opname-plan'
  urlDetail: string = this.router.url+'/detail-opname-plan'
  urlEdit: string = this.router.url+'/edit-opname-plan'

  alertError: boolean = false
  responseBackend: any = {}
  errorMessage: string = ''
  warehouse = new FormControl()
  queryStringObj: any = { page: 1, limit: 10, warehouseId: 1, keyword: '' }

  ngOnInit(): void {
  	this.menuBreadcrumb[1]['color'] = "#1c100b"

    /** event keyup search */
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }), filter(res => {
        if(res.length > 2 || res.length == 0){
          return true;
        }
      }),
      debounceTime(1000), distinctUntilChanged()
    ).subscribe((text: string) => {
      if (text === null || text == '') {
        this.ngOnInit()
        this.queryStringObj.keyword = ''
        this.getAll()
      } else {
        this.queryStringObj.keyword = text
        this.getAll()
      }
    })

    this.warehouseList()
  }

  defaultWarehouseId: number = 0
  changeWarehouse(e) {
    if (e != null) {
      this.defaultWarehouseId = e
      this.queryStringObj.warehouseId = this.defaultWarehouseId
      this.getAll()
    } else {
      this.warehouseList()
    }
  }

  dataWarehouse: any = {}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
      for (let index = 0; index < this.dataWarehouse.data.length; index++) {
        if(this.dataWarehouse.data[index].is_default == 1) {
          this.defaultWarehouseId = this.dataWarehouse.data[index].id

          /** reset query string */
          this.queryStringObj.page = 1
          this.queryStringObj.limit = 10
          this.queryStringObj.warehouseId = 1
          this.queryStringObj.keyword = ''

          this.getAll()
          return false
        }
      }
    }, (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    })
  }

  dataApi: any = {}
  table: boolean = false
  getAll() {
    let url = `opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/list?${this.objToQueryString(this.queryStringObj)}`
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataApi = data
      this.statusName(this.dataApi.data.plan)
      if (this.dataApi.data.plan.length > 0) {
        this.table = true
      }
    }, (err) => {
      this.table = false
      this.alertError = true
      this.errorMessage = err
    })

    // console.log(this.dataApi)
  }

  deleteOpnamePlan(id) {
    let url = `/opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/delete/${id}`
    this.apiBackend.Delete(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          title: 'STOCK OPNAME PLAN',
          text: 'Perintah Stock Opname Berhasil Dihapus !!',
          showConfirmButton: true
        });
        this.getAll()
      } else {
        this.notify.showError("Perintah Stock Opname Gagal Dihapus !!", "STOCK OPNAME PLAN")
      }
    }, (err) => {
      console.log(err)
    })
  }

  private statusName(data) {
    let dataStatus = [
      {'1': 'open', 'color': '#000000'},
      {'2': 'sedang dikerjakan', 'color': '#0A9A0A'},
      {'3': 'selesai', 'color': '#FF0000'},
      {'-1': 'dibatalkan', 'color': '#FF785B'},
    ]
    data.forEach(item => {
      dataStatus.forEach(statusName => {
        let dataStatusArray = Object.entries(statusName)
        if (item.status == dataStatusArray[0][0]) {
          item.status = dataStatusArray[0][1]
          item.status_color = dataStatusArray[1][1]
        }
      })
    })
  }

  private objToQueryString(param) {
    return Object.keys(param).map(key => key + '=' + param[key]).join('&')
  }

}
