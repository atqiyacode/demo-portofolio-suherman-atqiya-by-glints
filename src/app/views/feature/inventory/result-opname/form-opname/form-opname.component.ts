import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../../../../library/service/inventory.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from '@angular/router';
import { FormBuilder, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { NotificationService } from "../../../../library/service/notification.service";

@Component({
  selector: 'app-form-opname',
  templateUrl: './form-opname.component.html',
  styleUrls: ['./form-opname.component.css']
})
export class FormOpnameComponent implements OnInit {

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
  configAttribute: any = this.inventoryService.configInventoryResultOpname()
  menuBreadcrumb: any = this.configMenuDashboard['brd-res-opname']
  responseBackend: any = {}

  today: any = new Date()
  formatDate: string = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
  msgValidation: string = ''
  formOpname = this.formBuilder.group({
    opname_plan_id: [null, Validators.required],
    opname_code: [null, Validators.required],
    dateopname: [null, Validators.required],
    desc: [null, Validators.required],
    products: [],
  })

  submitForm: boolean = false
  opnameTable: boolean = false

  submitSave() {
    let url = `/opname/${this.apiBackend.serviceAuth()['tenant_id']}/add`
    for(let i = 0; i < this.arrayOfPostOpname.length; i++) {
      delete this.arrayOfPostOpname[i]['diff']
    }

    this.formOpname.get('products').setValue(this.arrayOfPostOpname)
    this.formOpname.value.dateopname = this.reverseFormat(this.formOpname.value.dateopname)

    this.submitForm = true
    this.formOpname.markAllAsTouched()
    if (this.formOpname.invalid) {
      return
    }

    this.apiBackend.Update(this.formOpname.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.notify.showSuccess("Sukses Menambah Stock Opname", "STOCK OPNAME RESULT")
        this.router.navigate(['/dashboard-inventory/result-stock-opname'])
      } else {
        this.notify.showError("Gagal Menambah Stock Opname", "STOCK OPNAME RESULT")
      }
    })
  }

  private reverseFormat(date) {
    return date.split("-").reverse().join("-")
  }

  ngOnInit(): void {
    this.formOpname.get('dateopname').setValue(this.formatDate)

    this.opnamePlanCode()
    this.generateOpCode()
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = 'true'
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }

  listOpnamePlan: any = {}
  opnamePlanCode() {
    let url = `opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/list-all?keyword=`
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.listOpnamePlan = data
    }, (err) => {
      console.log(err)
    })
  }

  opnameProducts: any = {}
  arrayOfOpname: any = []
  postOpname: any = { 
    productId: null, 
    value1: null, 
    value2: null, 
    stock: null, 
    diff: null,
    stock_total: null,
    sku: '',
    product_name: '',
  }
  arrayOfPostOpname: any = []
  getListProductByPlanId(id) {
    if (id != undefined) {
      let url = `opname-plan/${this.apiBackend.serviceAuth()['tenant_id']}/list-product/${id}`
      this.apiBackend.Show(url).subscribe((data: {}) => {
        this.opnameProducts = data
        this.arrayOfOpname = this.opnameProducts.data.products
        if (this.opnameProducts.status == 200) {
          this.opnameTable = true
          this.arrayOfOpname.forEach(item => {
            this.postOpname.sku = item.sku
            this.postOpname.product_name = item.product_name
            this.postOpname.stock_total = item.stock_total
            this.postOpname.productId = item.id
            this.postOpname.value1 = item.value1
            this.postOpname.value2 = item.value2

            this.arrayOfPostOpname.push(Object.assign({}, this.postOpname))
          });
        }
      }, (err) => {
        console.log(err)
      })
    } else {
      this.opnameProducts = {}
      this.opnameTable = false
    }
  }

  getDiff(stockOnHand, index) {
    let diff = this.arrayOfPostOpname[index].stock - stockOnHand
    this.arrayOfPostOpname[index].diff = diff
  }

  removeItem(index) {
    if (index > -1) {
      this.arrayOfPostOpname.splice(index, 1)
    }
  }

  opCode: any = {}
  generateOpCode() {
    let url = `opname/${this.apiBackend.serviceAuth()['tenant_id']}/code`
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.opCode = data
      this.formOpname.get('opname_code').setValue(this.opCode.data.code)
    }, (err) => {
      console.log(err)
    })
  }

}
