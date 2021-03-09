import { Component, OnInit, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";
import * as _ from 'lodash';

import { SalesService } from "../../../../library/service/sales.service";
import { LoadJsService } from "../../../../library/service/load-js.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { NotificationService } from "../../../../library/service/notification.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-form-quotation',
  templateUrl: './form-quotation.component.html',
  styleUrls: ['./form-quotation.component.css']
})
export class FormQuotationComponent implements OnInit, AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    public notify: NotificationService,
    public salesService: SalesService,
    public loadJs: LoadJsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public menuService: MenuDashboardService,
  ) { }
  configMenuDashboard = this.menuService.menu()
  configAttribute = this.salesService.configSalesOrder()
  menuBreadcrumb = this.configMenuDashboard['brd-quotation']

  orderTable = false
  urlApiMaster = ""
  responseBackend: any = {}
  responseProductList: any = {}
  dataProduct: any = {}
  dataVariant: any = {}
  dataMember: any = {}
  errorMessage = ""
  alertError = false

  endTotal = new FormControl(null, Validators.required)
  isApproved = new FormControl(0, Validators.required)
  price_product = new FormControl(0)
  price_logistic = new FormControl(0)
  service_fee = new FormControl(0)
  tax = new FormControl(0)
  variant_2 = new FormControl()

  /*FORM CRUD */
  formQuotation = this.fb.group({
    user_id: [null],
    member_id: [null, Validators.required],
    tenant_id: [null],
    master_warehouse_id: [null, Validators.required],
    quotation_no: [null],
    quotation_date: [null],
    delivery_destination: [''],
    logistic_id: [0],
    price_product: [0],
    price_logistic: [0],
    service_fee: [null],
    tax: [0],
    is_active: [1],
    is_approved: [0],
    details: [],

  })
  /*END FORM CRUD */

  today = new Date()
  formatDate = formatDate(this.today, 'yyyyMMdd', 'en-ID')
  btnActive = 1
  msgValidation = ""
  validForm = true

  /*LIFECYCLE HOOKS ANGULAR */
  ngOnInit() {
    this.selectMember()
    this.warehouseList()
    this.generateCode()
    this.price_logistic.setValue(20000)
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      this.urlApiMaster = "update-quotation/" + this.activeRoute.snapshot.paramMap.get("id")
      this.btnActive = 2
    } else {
      this.urlApiMaster = "store-quotation"
      this.btnActive = 1
    }
    let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
    this.formQuotation.get('quotation_date').setValue(date)
  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[1]['img'] = "true"
    this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.menuBreadcrumb[2]['name'] = "Ubah Penawaran Harga"
    } else {
      this.menuBreadcrumb[2]['name'] = "Tambah Penawaran Harga"
    }
    if (this.dummyOrder.length == 0) {
      this.validForm = false
      this.msgValidation = "Minimal 1 produk ditambahkan"
    } else {
      for (let index = 0; index < this.dummyOrder.length; index++) {
        if (this.dummyOrder[index]['status'] == true) {
          this.validForm = true
        } else {
          this.dummyOrder[index]['status'] = false
          this.validForm = false
        }
      }
    }
  }

  /*GENERATE CODE */
  dataCode: any = {}
  generateCode() {
    this.apiBackend.Get('code-quotation/').subscribe((data: {}) => {
      this.dataCode = data
      let code = "SQ/" + this.formatDate + '/' + this.dataCode.data
      this.formQuotation.get('quotation_no').setValue(code)
    },
      (err) => {
        console.log(err)
      });
  }

  /*WAREHOUSE */
  dataWarehouse: any = {}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
    },
      (err) => {
        console.log(err)
      });
  }
  stockProduct(e) {
    if (_.isUndefined(e)) {
      return;
    }
    let url = "stock-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + e
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataProduct = data
    },
      (err) => {
        console.log(err)
      });
  }

  /*MEMBER */
  selectMember() {
    this.apiBackend.Get('member-list').subscribe((data: {}) => {
      this.dataMember = data
    },
      (err) => {
        console.log(err)
      });
  }

  /*CREATE ORDER QUOTATION */
  dummyOrder = []
  addOrder() {
    this.orderTable = true
    if (this.dummyOrder.length == 0) {
      this.dummyOrder.push({
        id: 0, master_product_id: null, value1: null, value2: null, qty: null, price: null, weight: null,
        totalDetail: null, select: [], disabledQty: true, disabledVar2: true, maxQty: null, status: false
      })
    }
    let length = this.dummyOrder.length - 1
    if (this.dummyOrder[length]['totalDetail'] != null) {
      this.dummyOrder.push({
        id: 0, master_product_id: null, value1: null, value2: null, qty: null, price: null, weight: null,
        totalDetail: null, select: [], disabledQty: true, disabledVar2: true, maxQty: null, status: false
      })
    }

  }

  /*TABLE INPUT PRODUCT */
  priceRetailProduct = []
  selectProduct(loop, id, type) {
    if (type == 1) {
      this.dummyOrder[loop]['select'] = null
      this.dummyOrder[loop]['value1'] = null
      this.dummyOrder[loop]['value2'] = null
      this.dummyOrder[loop]['weight'] = null
      this.dummyOrder[loop]['price'] = null
      this.dummyOrder[loop]['disabledQty'] = true
      this.dummyOrder[loop]['qty'] = null
      this.dummyOrder[loop]['totalDetail'] = null
      this.variant_2.reset()
    }

    if (id != undefined) {
      for (let index = 0; index < this.dataProduct.data.length; index++) {
        if (id == this.dataProduct.data[index]['id']) {
          this.priceRetailProduct = this.dataProduct.data[index]['price_retail']
          if (this.dataProduct.data[index]['variant'].length == 0) {
            this.dummyOrder[loop]['disabledQty'] = false
          }
          let dummy_value1: any = []
          let dummy_value2: any = []
          this.dataProduct.data[index]['variant'].forEach(element => {
            dummy_value1.push({ value1: element['value1'], value2: element['value2'] })
            dummy_value2.push({ value1: element['value1'], value2: element['value2'] })
          });
          this.dummyOrder[loop]['select_value1'] = _.uniqBy(dummy_value1, 'value1')
          this.dummyOrder[loop]['select_value2'] = dummy_value2
          this.dummyOrder[loop]['select'] = this.dataProduct.data[index]['variant']
          this.dummyOrder[loop]['maxQty'] = this.dataProduct.data[index]['stock']
          this.dummyOrder[loop]['minQty'] = this.dataProduct.data[index]['minimum_order']
          if (type == 1) {
            this.dummyOrder[loop]['weight'] = this.dataProduct.data[index]['weight']
            this.dummyOrder[loop]['price'] = this.dataProduct.data[index]['sell_price']
            this.dummyOrder[loop]['priceWithoutRetail'] = this.dataProduct.data[index]['sell_price']
          }

        }
      }
    } else {
      this.dummyOrder[loop]['value2'] = null
      this.dummyOrder[loop]['value1'] = null
      this.dummyOrder[loop]['disabledQty'] = true
      this.dummyOrder[loop]['qty'] = null
      this.dummyOrder[loop]['price'] = null
      this.dummyOrder[loop]['totalDetail'] = null
      this.orderTotal(loop, 2)
    }

  }
  selectVariant(loop, e, type) {

    this.dummyOrder[loop]['select'].forEach(element => {
      if (_.isEmpty(this.dummyOrder[loop]['value2'])) {
        if (element['value1'] == e) {
          this.dummyOrder[loop]['price'] = element['sell_price']
        }
      } else {
        if (element['value1'] == this.dummyOrder[loop]['value1'] && element['value2'] == this.dummyOrder[loop]['value2']) {
          this.dummyOrder[loop]['price'] = element['sell_price']
        }
      }
    });
    if (this.dummyOrder[loop]['select'][0]['value2'] == null) {
      this.dummyOrder[loop]['disabledVar2'] = true
      this.dummyOrder[loop]['disabledQty'] = false
    }

    if (this.dummyOrder[loop]['select'][0]['value2'] != null) {
      if (this.dummyOrder[loop]['value2'] != null) {
        this.dummyOrder[loop]['disabledQty'] = false
      }
      this.dummyOrder[loop]['disabledVar2'] = false
    }
    if (e == undefined) {
      if (type == 1) {
        this.dummyOrder[loop]['value1'] = null
        this.dummyOrder[loop]['value2'] = null
      } else {
        this.dummyOrder[loop]['value2'] = null
      }
      this.dummyOrder[loop]['disabledQty'] = true
      this.dummyOrder[loop]['qty'] = null
      this.dummyOrder[loop]['price'] = null
      this.dummyOrder[loop]['totalDetail'] = null
      this.orderTotal(loop, 2)
    } else {
      if (type == 1) {
        let dummy = []
        this.dummyOrder[loop]['select_value2'].forEach(element => {
          if (element['value1'] == this.dummyOrder[loop]['value1']) {
            dummy.push({
              value1: element['value1'],
              value2: element['value2']
            })
          }
        });
        this.dummyOrder[loop]['new_value2'] = dummy

      }
    }

  }

  /*TOTAL ORDER */
  orderTotal(loop, id) {
    this.price_product.setValue(0)
    this.tax.setValue(0)
    this.endTotal.setValue(0)

    if (id == 1) {
      /*PRICE WITH RETAIL */
      for (let index = 0; index < this.priceRetailProduct.length; index++) {
        if (this.dummyOrder[loop]['qty'] >= this.priceRetailProduct[index]['qty_min'] && this.dummyOrder[loop]['qty'] <= this.priceRetailProduct[index]['qty_max']) {
          this.dummyOrder[loop]['price'] = this.priceRetailProduct[index]['price']
          break;
        } else {
          this.dummyOrder[loop]['price'] = this.dummyOrder[loop]['priceWithoutRetail']
        }
      }
      let total = this.dummyOrder[loop]['qty'] * this.dummyOrder[loop]['price']
      this.dummyOrder[loop]['totalDetail'] = total
    }

    for (let index = 0; index < this.dummyOrder.length; index++) {
      if (this.dummyOrder[index]['totalDetail'] != null) {
        this.price_product.setValue(this.price_product.value + this.dummyOrder[index]['totalDetail'])
        // this.tax.setValue(this.price_product.value*0.02)
        let end = this.price_product.value
        // let end = this.price_product.value+this.price_logistic.value+this.service_fee.value+this.tax.value
        this.endTotal.setValue(this.price_product.value)
      }
    }
    if (this.dummyOrder.length == 0) {
      // let end = this.price_product.value+this.price_logistic.value+this.service_fee.value+this.tax.value
      this.endTotal.setValue(this.price_product.value)
    }

  }
  serviceFeeKeyup() {
    this.endTotal.setValue(0)
    for (let index = 0; index < this.dummyOrder.length; index++) {
      // let end = this.price_product.value+this.price_logistic.value+this.service_fee.value+this.tax.value
      this.endTotal.setValue(this.price_product.value)
    }
  }
  minQtyOrder(id) {

    if (this.dummyOrder[id]['qty'] < this.dummyOrder[id]['minQty']) {
      this.dummyOrder[id]['status'] = false
      this.msgValidation = "Form tidak sesuai/kosong"
    } else {
      if (this.dummyOrder[id]['qty'] > this.dummyOrder[id]['maxQty']) {
        this.dummyOrder[id]['status'] = false
        this.msgValidation = "Form tidak sesuai/kosong"
      } else {
        this.dummyOrder[id]['status'] = true
      }
    }
  }
  /*REMOVE ORDDER QUOTATION */
  removeOrder(loop, id) {
    this.dummyOrder.splice(loop, 1)
    this.orderTotal(loop, 2)

    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      let url = "quotation-detail/" + id + '/delete/' + this.activeRoute.snapshot.paramMap.get("id")
      this.apiBackend.Delete(url).subscribe((data: {}) => {

      },
        (err) => {
          console.log(err)
        });
    }
  }

  /*CHECKED APPROVED OR REJECTED */
  checkedRadio = false
  checkedFalse = false
  setRadio(val) {
    this.isApproved.setValue(val)
  }

  /*CRUD FORM*/
  submitSave() {
    if (this.validForm == true && this.formQuotation.valid == true) {
      this.formQuotation.get('user_id').setValue(this.apiBackend.serviceAuth()['user_id'])
      this.formQuotation.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
      this.formQuotation.get('is_approved').setValue(this.isApproved.value)
      this.formQuotation.get('price_logistic').setValue(this.price_logistic.value)
      this.formQuotation.get('price_product').setValue(this.price_product.value)
      this.formQuotation.get('service_fee').setValue(this.service_fee.value)
      this.formQuotation.get('tax').setValue(this.tax.value)

      let url = ""
      let responseSuccess = ""
      let responseError = ""
      let detailsOrder = []
      for (let index = 0; index < this.dummyOrder.length; index++) {
        detailsOrder.push({
          id: this.dummyOrder[index]['id'],
          master_product_id: this.dummyOrder[index]['master_product_id'],
          value1: this.dummyOrder[index]['value1'],
          value2: this.dummyOrder[index]['value2'],
          qty: this.dummyOrder[index]['qty'],
          price: this.dummyOrder[index]['price'],
          weight: this.dummyOrder[index]['weight'],
        })
        if (this.activeRoute.snapshot.paramMap.get("id") == null) {
          delete this.dummyOrder[index]['id']
        }
      }
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {
        url = "store-quotation"
        responseSuccess = "Sukses Tambah Harga Penawaran"
        responseError = "Gagal Tambah Harga Penawaran"
      } else {
        url = "quotation/" + this.apiBackend.serviceAuth()['tenant_id'] + '/update/' + this.activeRoute.snapshot.paramMap.get("id")
        responseSuccess = "Sukses Edit Harga Penawaran"
        responseError = "Gagal Edit Harga Penawaran"
      }
      this.formQuotation.get('details').setValue(detailsOrder)
      this.apiBackend.Create(this.formQuotation.value, url).subscribe((data: {}) => {
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          this.notify.showSuccess(responseSuccess, "ACCOUNTING SYSTEM")
          this.router.navigate(['/dashboard-sales/sales-quotation'])
        } else {
          this.notify.showError(responseError, "ACCOUNTING SYSTEM")
        }
      },
        (err) => {
          setTimeout(() => {
            this.alertError = true
            this.errorMessage = err
          }, 4000)

        });
    } else {
      alert(this.msgValidation)

    }

  }
  showById(id) {
    this.apiBackend.Show("quotation/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data

      let dummyData = this.responseBackend.data['quotation']
      this.stockProduct(dummyData['master_warehouse_id'])
      this.formQuotation.get('member_id').setValue(dummyData['member_id'])
      this.formQuotation.get('quotation_date').setValue(dummyData['quotation_date'])
      this.formQuotation.get('quotation_no').setValue(dummyData['quotation_no'])

      this.formQuotation.get('master_warehouse_id').setValue(dummyData['master_warehouse_id'])

      if (dummyData['is_approved'] != 0) {
        this.isApproved.setValue(dummyData['is_approved'])
      }
      if (dummyData['is_approved'] == 1) {
        this.checkedRadio = true
        this.checkedFalse = false
      } else if (dummyData['is_approved'] == 2) {
        this.checkedRadio = false
        this.checkedFalse = true
      } else {
        this.checkedRadio = false
        this.checkedFalse = false
      }
      this.orderTable = true

      let dummyDetails = this.responseBackend.data['detail']
      setTimeout(() => {
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty'] * dummyDetails[index]['price']
          if (dummyDetails[index]['values'] == null) {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: null,
              value2: null,
              qty: dummyDetails[index]['qty'],
              price: dummyDetails[index]['price'],
              priceWithoutRetail: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: false, disabledVar2: false, status: true
            })
            this.selectProduct(index, dummyDetails[index]['master_product_id'], 2)
          } else {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: dummyDetails[index]['values']['value1'],
              value2: dummyDetails[index]['values']['value2'],
              qty: dummyDetails[index]['qty'],
              price: dummyDetails[index]['price'],
              priceWithoutRetail: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: false, disabledVar2: false, status: true
            })
            this.selectProduct(index, dummyDetails[index]['master_product_id'], 2)
          }

        }
      }, 1000)

      this.price_product.setValue(dummyData['price_product'])
      this.price_logistic.setValue(dummyData['price_logistic'])
      this.service_fee.setValue(dummyData['service_fee'])
      this.tax.setValue(dummyData['tax'])
      let end = this.price_product.value + dummyData['price_logistic'] + dummyData['service_fee'] + dummyData['tax']
      this.endTotal.setValue(end)
    },
      (err) => {
        setTimeout(() => {
          this.alertError = true
          this.errorMessage = err
        }, 4000)
      });
  }
}
