import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../../../../library/service/inventory.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { Router } from '@angular/router'
import { NotificationService } from "../../../../library/service/notification.service";
import { formatDate } from "@angular/common";
import * as _ from 'lodash';

@Component({
  selector: 'app-form-inventory-adjustment',
  templateUrl: './form-inventory-adjustment.component.html',
  styleUrls: ['./form-inventory-adjustment.component.css']
})
export class FormInventoryAdjustmentComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
    private router: Router,
  	public inventoryService: InventoryService,
  	public menuService: MenuDashboardService,
  	public formBuilder: FormBuilder,
    public notify : NotificationService,
  ) { }

  /** CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard = this.menuService.menu()
  configAttribute = this.inventoryService.configInventoryAdjustment()
  menuBreadcrumb = this.configMenuDashboard['brd-adjustment']

  orderTable = false
  alertError = false
  errorMessage = ""
  validForm = true
  msgValidation = ''
  today = new Date()
  formatDate = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')

  responseBackend:any={}
  dataWarehouse:any = {}
  dataProduct:any = {}
  duplicateData: boolean = false

  /*
  * Form add inventory adjustment
  */
  formAdjustment = this.formBuilder.group({
    user_id: [null],
    tenant_id: [null],
  	master_warehouse_id: [null],
    adjustment_no: [null],
    notes: [null],
    is_active: [1],
    created_at: [null],
    details: [],
  })

  submitSave() {
    if (this.validForm == true) {
      this.formAdjustment.get('user_id').setValue(this.apiBackend.serviceAuth()['user_id'])
      this.formAdjustment.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
      for(let i = 0; i < this.inventories.length; i++) {
        delete this.inventories[i]['status']
        delete this.inventories[i]['id']
        delete this.inventories[i]['select']
        delete this.inventories[i]['select_value1']
        delete this.inventories[i]['select_value2']
        delete this.inventories[i]['disabledVar2']
        delete this.inventories[i]['disabledQty']
        delete this.inventories[i]['new_value2']
      }

      this.formAdjustment.get('details').setValue(this.inventories)

      let url = "/adjustment/"+this.apiBackend.serviceAuth()['tenant_id']+"/add"
      this.apiBackend.Create(this.formAdjustment.value, url).subscribe((data: {}) => {
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          this.notify.showSuccess("Sukses Edit Penyesuaian Inventori", "INVENTORY SYSTEM")
          this.router.navigate(['/dashboard-inventory/inventory-adjustment'])
        } else {
          this.notify.showError("Gagal Edit Penyesuaian Inventori", "INVENTORY SYSTEM")
        }
      }, (err) => {
        this.duplicateData = true
        setTimeout(() => {
          this.alertError = true
          this.errorMessage = err
        }, 4000)
      });
    } else {
      alert(this.msgValidation)
    }
  }

  ngOnInit(): void {
  	this.apiBackend.serviceAuth()
    this.generateCode()

  	this.warehouseList()
    this.formAdjustment.get('created_at').setValue(this.formatDate)
  }

  ngAfterContentChecked() {
  	this.menuBreadcrumb[1]['img'] = "true"
  	this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"

    if (this.inventories.length === 0) {
      this.validForm = false
      this.msgValidation = 'Minimal 1 produk ditambahkan'
    } else {
      for(let i = 0; i < this.inventories.length; i++) {
        // console.log(this.inventories)
        if (
          this.inventories[i].master_product_id != null && 
          this.inventories[i].qty != null
          ) {
          this.validForm = true
          this.inventories[i]['status'] = true
        } else {
          this.validForm = false
          this.inventories[i]['status'] = false
          this.msgValidation = "Lengkapi produk anda"
        }
      }
    }
  }

  warehouseList() {
  	this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
  		this.dataWarehouse = data
  	}, (err) => {
  		console.log(err)
  		this.alertError = true
  		this.errorMessage = err
  	});
  }

  productSelect(e) {
    if (e != undefined) {
      let url = "stock-product/"+this.apiBackend.serviceAuth()['tenant_id']+'/'+e
      this.apiBackend.GetSearch(url).subscribe((data: {}) => {
        this.dataProduct = data
        // console.log(this.dataProduct)
      }, (err) => {
        console.log(err)
      });
    } else {
      this.inventories = []
    }
  }

  /**
  * new order event add
  */
  inventories = []
  addOrder() {
    this.orderTable = true
    if (this.inventories.length == 0) {
      this.inventories.push({
        id: 0, 
        master_product_id: null, 
        qty: null,
        value1: null, 
        value2: null, 
        price_product: null, 
        total_price: null,
        status: false,
        select: [],
        disabledVar2: true,
        disabledQty: true,
      });
    }

    let lengthOrder = this.inventories.length - 1
    // console.log(this.inventories)
    if (this.inventories[lengthOrder]['status'] == true && this.inventories[lengthOrder]['total_price'] != null) {
      this.inventories.push({
        id: 0, 
        master_product_id: null, 
        qty: null,
        value1: null, 
        value2: null, 
        price_product: null, 
        total_price: null,
        status: false,
        select: [],
        disabledVar2: true,
        disabledQty: true,
      });
    }
  }

  selectProduct(loop, id, type) {
    if (type == 1) {
      this.inventories[loop]['select'] = null
      this.inventories[loop]['value1'] = null
      this.inventories[loop]['price_product'] = null
      this.inventories[loop]['qty'] = null
      this.inventories[loop]['total_price'] = null
      this.inventories[loop]['disabledQty'] = true
    }

    if (id != undefined) {
      for(let i = 0; i < this.dataProduct.data.length; i++) {
        if(id == this.dataProduct.data[i]['id']) {
          if (this.dataProduct.data[i]['variant'].length == 0) {
            this.inventories[loop]['disabledQty'] = false 
          }

          this.inventories[loop]['select'] = this.dataProduct.data[i]['variant']

          let dummy_value1:any=[]
          let dummy_value2:any=[]

          this.dataProduct.data[i]['variant'].forEach(e => {
            dummy_value1.push({value1:e['value1'], value2:e['value2']})
            dummy_value2.push({value1:e['value1'], value2:e['value2']})
          });

          this.inventories[loop]['select_value1'] = _.uniqBy(dummy_value1,'value1')
          this.inventories[loop]['select_value2'] = dummy_value2
          if(type == 1) {
            this.inventories[loop]['price_product'] = this.dataProduct.data[i]['sell_price']
          }
        }
      }

      // console.log(this.inventories)
    } else {
      this.inventories[loop]['value1'] = null
      this.inventories[loop]['disabledQty'] = true
      this.inventories[loop]['qty'] = null
      this.inventories[loop]['price_product'] = null
      this.inventories[loop]['total_price'] = null
      this.orderTotal(loop, 1)
    }
  }

  selectVariant(loop, e, type) {
    this.inventories[loop]['select'].forEach(element => {
      if (_.isEmpty(this.inventories[loop]['value2'])) {
        if (element['value1'] == e) {
          this.inventories[loop]['price_product'] = element['sell_price']
        }
      } else {
        if (element['value1'] == this.inventories[loop]['value1'] && element['value2'] == this.inventories[loop]['value2']) {
          this.inventories[loop]['price_product'] = element['sell_price']
        }
      }
    })

    if (this.inventories[loop]['select'][0]['value2'] == null) {
      this.inventories[loop]['disabledVar2'] = true
      this.inventories[loop]['disabledQty'] = false
    } 

    if (this.inventories[loop]['select'][0]['value2'] != null) {
      if (this.inventories[loop]['value2'] != null) {
        this.inventories[loop]['disabledQty'] = false
      }
      this.inventories[loop]['disabledVar2'] = false
    }
    if (e == undefined) {
      if (type == 1) {
        this.inventories[loop]['value1'] = null
        this.inventories[loop]['value2'] = null
      } else {
        this.inventories[loop]['value2'] = null
      }
      this.inventories[loop]['disabledQty'] = true
      this.inventories[loop]['qty'] = null
      this.inventories[loop]['price_product'] = null
      this.inventories[loop]['total_price'] = null
      this.orderTotal(loop,2)
    } else {
      if (type == 1) {
        let dummy = []
        this.inventories[loop]['select_value2'].forEach(element => {
          if (element['value1'] == this.inventories[loop]['value1']) {
            dummy.push({
              value1:element['value1'],
              value2:element['value2']
            })
          }
        });

        this.inventories[loop]['new_value2'] = dummy
      }
    }
  }

  orderTotal(loop, id) {
    if (id == 1) {
      let total = this.inventories[loop]['qty'] * this.inventories[loop]['price_product']
      this.inventories[loop]['total_price'] = total
    }
  }

  removeOrder(loop, id) {
    this.inventories.splice(loop, 1)
    this.orderTotal(loop, 2)
  }

  generateCode() {
    let url = 'code-adjustment/'+this.apiBackend.serviceAuth()['tenant_id']
    this.apiBackend.Show(url).subscribe((data: {}) => {
      let code:any = {}
      code = data
      this.formAdjustment.get('adjustment_no').setValue(code.data)
    }, (err) => {
      console.log(err)
    })
  }

  removeDuplicate() {
    this.duplicateData = false
  }

}
