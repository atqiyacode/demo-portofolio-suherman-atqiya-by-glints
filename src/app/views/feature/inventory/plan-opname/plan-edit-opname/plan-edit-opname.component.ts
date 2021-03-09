import { Component, OnInit } from '@angular/core';
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NotificationService } from "../../../../library/service/notification.service";

@Component({
  selector: 'app-plan-edit-opname',
  templateUrl: './plan-edit-opname.component.html',
  styleUrls: ['./plan-edit-opname.component.css']
})
export class PlanEditOpnameComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private router: Router,
  	public menuService: MenuDashboardService,
    public formBuilder: FormBuilder,
    public notify: NotificationService,
  ) { }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard: any [] = this.menuService.menu()
  menuBreadcrumb: any [] = this.configMenuDashboard['brd-edit-plan-opname']

  planId: number = null
  alertError: boolean = false
  submitForm: boolean = false
  errorMessage: string = ''
  responseBackend: any = {}
  formOpname: any = this.formBuilder.group({
    master_warehouse_id: [null, Validators.required],
    product_category_id: [null, Validators.required],
    person_in_charge: [null, Validators.required],
    master_supplier_id: [null, Validators.required],
    created_by: [null, Validators.required],
    description: [null, Validators.required],
    started_at: [null, Validators.required],
  })

  submitEdit() {
    let url = `/opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/update/${this.planId}`

    this.submitForm = true
    this.formOpname.markAllAsTouched()
    if (this.formOpname.invalid) {
      return
    }

    this.apiBackend.Update(this.formOpname.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.notify.showSuccess("Sukses Mengubah Plan Stock Opname", "STOCK OPNAME PLAN")
        this.router.navigate(['/dashboard-inventory/plan-stock-opname'])
      } else {
        this.notify.showError("Gagal Menambah Plan Stock Opname", "STOCK OPNAME PLAN")
      }
    }, (err) => {
      setTimeout(() => {
        this.alertError = true
        this.errorMessage = err
      }, 4000)
    });
  }

  ngOnInit(): void {
    this.supplierList()
    this.warehouseList()
    this.categoryList()
    this.getPlanOpnameDetail()
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = 'true'
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }

  defaultWarehouseId: number = 0
  changeWarehouse(e) {
    if (e != null) {
      this.defaultWarehouseId = e
    } else {
      this.warehouseList()
    }
  }

  dataApi: any = {}
  getPlanOpnameDetail() {
    let url = `/opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/detail/${this.lastUrlSegment(this.router.url)}`
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataApi = data
      this.formOpname.get('master_warehouse_id').setValue(this.dataApi.data.master_warehouse_id) 
      this.formOpname.get('product_category_id').setValue(this.dataApi.data.product_category_id)
      this.formOpname.get('person_in_charge').setValue(this.dataApi.data.person_in_charge)
      this.formOpname.get('master_supplier_id').setValue(this.dataApi.data.master_supplier_id)
      this.formOpname.get('created_by').setValue(this.dataApi.data.created_by)
      this.formOpname.get('description').setValue(this.dataApi.data.description)
      this.formOpname.get('started_at').setValue(this.getDate(this.dataApi.data.started_at))
    }, (err) => {
      console.log(err)
    })
  }

  private getDate(date) {
    return date.split(" ")[0]
  }

  private lastUrlSegment(url) {
    this.planId = url.substr(url.lastIndexOf('/') + 1)
    return this.planId
  }

  dataWarehouse:any = {}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
    }, (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    });
  }

  dataCategory: any = {}
  categoryList() {
    this.apiBackend.Get('master-product-category/main').subscribe((data: {}) => {
      this.dataCategory = data
    }, (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    })
  }

  dataSupplier: any = {}
  supplierList() {
    this.apiBackend.Get('supplier-list').subscribe((data: {}) => {
      this.dataSupplier = data
    }, (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    })
  }

}
