import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { Router } from '@angular/router';
import { InventoryService } from "../../../library/service/inventory.service";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter} from "rxjs/operators";
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NotificationService } from "../../../library/service/notification.service";

@Component({
  selector: 'app-result-opname',
  templateUrl: './result-opname.component.html',
  styleUrls: ['./result-opname.component.css']
})
export class ResultOpnameComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
  	private router: Router,
    private notify: NotificationService,
  	public menuService: MenuDashboardService,
  	public inventoryService: InventoryService,
  ) { }

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef

  /** CONFIG ATTRIBUTE IN SERVICE */
  configAttribute: any = this.inventoryService.configInventoryResultOpname()
  configMenuDashboard: any = this.menuService.menu()
  menuBreadcrumb: any = this.configMenuDashboard['brd-res-opname']
  titleCard: string = this.configAttribute['titleInformation']
  dataColumnTable: any = this.configAttribute['columnTable']
  urlCreate: string = this.router.url+'/create-opname'
  urlDetail: string = this.router.url+'/detail-opname-result'

  alertError: boolean = false
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
    let url = `opname/${this.apiBackend.serviceAuth()['tenant_id']}/list?${this.objToQueryString(this.queryStringObj)}`
    this.apiBackend.GetWithQuery(url).subscribe((data: {}) => {
      this.dataApi = data
      this.statusName(this.dataApi.data.opname)
      if (this.dataApi.data.opname.length > 0) {
        this.table = true
      }
    }, (err) => {
      this.table = false
      this.alertError = true
      this.errorMessage = err
    })
  }

  responseBackend: any = {}
  openDeleteModal(id, name) {
    let url = `opname/${this.apiBackend.serviceAuth()['tenant_id']}/delete/${id}`
    this.apiBackend.Delete(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          title: 'RESULT OPNAME PLAN',
          text: 'Hasil Stock Opname Berhasil Dihapus !!',
          showConfirmButton: true
        });
        this.getAll()
      } else {
        this.notify.showError("Hasil Stock Opname Gagal Dihapus !!", "RESULT OPNAME PLAN")
      }
    }, (err) => {
      console.log(err)
    })
  }

  private objToQueryString(param) {
    return Object.keys(param).map(key => key + '=' + param[key]).join('&')
  }

  private statusName(data) {
    let dataStatus = {'1': 'Sesuai', '2': 'Tidak Sesuai', '3': 'selesai', '-1': 'dibatalkan'}
    data.forEach(item => {
      Object.keys(dataStatus).forEach(key => {
        if (item.status == key) {
          item.status = dataStatus[key]
        }
      })
    })
  }

}
