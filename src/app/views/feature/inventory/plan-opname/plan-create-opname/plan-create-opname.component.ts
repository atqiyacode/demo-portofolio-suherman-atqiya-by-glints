import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../../../../library/service/inventory.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NotificationService } from "../../../../library/service/notification.service";

@Component({
  selector: 'app-plan-create-opname',
  templateUrl: './plan-create-opname.component.html',
  styleUrls: ['./plan-create-opname.component.css']
})
export class PlanCreateOpnameComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
  	private router: Router,
  	public inventoryService: InventoryService,
  	public menuService: MenuDashboardService,
  	public formBuilder: FormBuilder,
  	public notify: NotificationService,
  ) { }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard: any = this.menuService.menu()
  configAttribute: any = this.inventoryService.configInventoryOpname()
  menuBreadcrumb: any = this.configMenuDashboard['brd-plan-opname']
  responseBackend: any = {}

  alertError: boolean = false
  errorMessage: string = ''
  validForm: boolean = true
  msgValidation: string = ''
  submitForm: boolean = false

  formOpname: any = this.formBuilder.group({
  	master_warehouse_id: [null, Validators.required],
  	product_category_id: [null, Validators.required],
  	person_in_charge: [null, Validators.required],
  	master_supplier_id: [null, Validators.required],
  	created_by: [null, Validators.required],
  	description: [null, Validators.required],
  	started_at: [null, Validators.required],
  })

  submitSave() {
  	let url = `/opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/add`

  	this.submitForm = true
  	this.formOpname.markAllAsTouched()
  	if (this.formOpname.invalid) {
  		return
  	}

  	this.formOpname.value.started_at = this.reverseFormat(this.formOpname.value.started_at)
  	this.apiBackend.Update(this.formOpname.value, url).subscribe((data: {}) => {
  		this.responseBackend = data
  		if (this.responseBackend.status == 200) {
  			this.notify.showSuccess("Sukses Menambah Plan Stock Opname", "STOCK OPNAME PLAN")
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

  private reverseFormat(date) {
  	return date.split("-").reverse().join("-")
  }

  ngOnInit(): void {
  	this.apiBackend.serviceAuth()

  	this.warehouseList()
  	this.categoryList()
  	this.supplierList()
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = 'true'
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }

  dataWarehouse: any = {}
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
