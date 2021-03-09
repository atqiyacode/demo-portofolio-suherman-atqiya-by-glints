import { Component, OnInit, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { SalesService } from "../../../../library/service/sales.service";
import { LoadJsService } from "../../../../library/service/load-js.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { NotificationService } from "../../../../library/service/notification.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-form-retur-order',
  templateUrl: './form-retur-order.component.html',
  styleUrls: ['./form-retur-order.component.css']
})
export class FormReturOrderComponent implements OnInit, AfterContentChecked {

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
  menuBreadcrumb = this.configMenuDashboard['brd-retur']

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
  variant_2 = new FormControl()

  today = new Date()
  formatDate = formatDate(this.today, 'yyyyMMdd', 'en-ID')
  msgValidation = ""
  validForm = true
  nameBtn = "Simpan"
  isReadonly = false
  ngOnInit() {
    this.memberSelect()
    this.warehouseList()
    this.generateCode()
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      this.menuBreadcrumb[2]['name'] = "Ubah Retur Penjualan"
      this.nameBtn = "Ubah"
      this.isReadonly = true
    } else {
      let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
      this.formReturOrder.get('created_at').setValue(date)
      this.menuBreadcrumb[2]['name'] = "Tambah Retur Penjualan"
      this.nameBtn = "Simpan"
      this.isReadonly = false
    }

  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[1]['img'] = "true"
    this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"

    if (this.formReturOrder.invalid) {
      this.msgValidation = "Lengkapi retur penjualan"
    }
  }
  dataCode: any = {}
  generateCode() {
    this.apiBackend.Get('code-return').subscribe((data: {}) => {
      this.dataCode = data
      let code = "RET/" + this.formatDate + '/' + this.dataCode.data
      this.formReturOrder.get('order_return_no').setValue(code)
    },
      (err) => {
        console.log(err)
      });
  }
  setStatus(id) {
    this.formReturOrder.get('status').setValue(id)
    this.formUpdateStatus.get('status').setValue(id)
  }
  dataWarehouse: any = {}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
    },
      (err) => {
        console.log(err)
      });
  }
  memberSelect() {
    this.apiBackend.Get('member-list').subscribe((data: {}) => {
      this.dataMember = data
    },
      (err) => {
        console.log(err)
      });
  }

  dataOrder: any = {}
  loadingAction = false
  master_warehouse_id = new FormControl()
  changeOrder(data) {
    this.dummyOrder = []
    if (this.activeRoute.snapshot.paramMap.get("id") == null) {
      this.formReturOrder.get('order_id').setValue(null)
    }
    if (_.isEmpty(data)) {
      this.dataOrder['data'] = []
      this.formReturOrder.get('order_id').setValue(null)
    } else {
      let url = 'member/' + this.apiBackend.serviceAuth()['tenant_id'] + '/return-order/' + data['id']
      this.apiBackend.Show(url).subscribe((data: {}) => {
        let dummy: any = {}
        dummy = data
        this.dataOrder['data'] = dummy.data.order
      },
        (err) => {
          console.log(err)
        });
    }

  }
  showRetur(dummyData) {
    this.loadingAction = true
    this.dummyOrder = []
    if (dummyData == undefined) {
      this.price_product.setValue(0)
      this.price_logistic.setValue(0)
      this.service_fee.setValue(0)
      this.endTotal.setValue(0)
    } else {
      this.formReturOrder.get('invoice_no').setValue(dummyData['invoice_no'])
      this.productSelectDetails(dummyData['master_warehouse_id'])
      this.master_warehouse_id.setValue(dummyData['master_warehouse_id'])

      // this.price_logistic.setValue(dummyData['price_logistic'])
      // this.service_fee.setValue(dummyData['service_fee'])
      // let end = this.price_product.value+dummyData['price_logistic']+dummyData['service_fee']

      this.orderTable = true
      let dummyDetails = dummyData['details']
      setTimeout(() => {
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty'] * dummyDetails[index]['price']
          this.price_product.setValue(this.price_product.value + total_detail)
          this.endTotal.setValue(this.endTotal.value + total_detail)
          if (_.isNull(dummyDetails[index]['values'])) {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: null,
              value2: null,
              qty: dummyDetails[index]['qty'],
              qtyOrder: dummyDetails[index]['qty'],
              price: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: true, disabledVar2: true, status: true,
              notes: dummyDetails[index]['notes'],
              statusDelete: false
            })
          } else {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: dummyDetails[index]['values']['value1'],
              value2: dummyDetails[index]['values']['value2'],
              qty: dummyDetails[index]['qty'],
              qtyOrder: dummyDetails[index]['qty'],
              price: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: true, disabledVar2: true, status: true,
              notes: dummyDetails[index]['notes'],
              statusDelete: false
            })
          }

          this.selectProduct(index, dummyDetails[index]['master_product_id'], 2)
        }
      }, 1000)

    }
    setTimeout(() => {
      this.loadingAction = false
    }, 2000)

  }
  removeOrder(id) {
    let no = id
    this.dummyOrder.splice(id, 1)
    this.orderTotal(no, 2)
  }

  productSelectDetails(e) {
    let url = "stock-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + e
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataProduct = data
    },
      (err) => {
        console.log(err)
      });
  }
  selectProduct(loop, id, type) {
    if (id != undefined) {
      for (let index = 0; index < this.dataProduct.data.length; index++) {
        if (id == this.dataProduct.data[index]['id']) {
          if (this.dataProduct.data[index]['variant'].length == 0) {
            this.dummyOrder[loop]['disabledQty'] = false
          }
          this.dummyOrder[loop]['select'] = this.dataProduct.data[index]['variant']
          this.dummyOrder[loop]['maxQty'] = this.dataProduct.data[index]['stock']
          if (type == 1) {
            this.dummyOrder[loop]['weight'] = this.dataProduct.data[index]['weight']
            this.dummyOrder[loop]['price'] = this.dataProduct.data[index]['sell_price']
          }

        }
      }
    } else {
      this.dummyOrder[loop]['master_product_variant_id_2'] = null
      this.dummyOrder[loop]['master_product_variant_id'] = null
      this.dummyOrder[loop]['disabledQty'] = true
      this.dummyOrder[loop]['qty'] = null
      this.dummyOrder[loop]['price'] = null
      this.dummyOrder[loop]['totalDetail'] = null
      this.orderTotal(loop, 2)
    }

  }

  dummyOrder = []
  orderTotal(loop, id) {

    this.service_fee.setValue(0)
    this.price_product.setValue(0)
    this.endTotal.setValue(0)
    if (this.dummyOrder[loop]['qty'] > this.dummyOrder[loop]['qtyOrder']) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Melebihi Jumlah Order, Max ' + this.dummyOrder[loop]['qtyOrder'],
        showConfirmButton: false,
        timer: 3000
      })
      this.dummyOrder[loop]['qty'] = this.dummyOrder[loop]['qtyOrder']
    }
    if (id == 1) {
      let total = this.dummyOrder[loop]['qty'] * this.dummyOrder[loop]['price']
      this.dummyOrder[loop]['totalDetail'] = total
    }

    for (let index = 0; index < this.dummyOrder.length; index++) {
      if (this.dummyOrder[index]['totalDetail'] != null) {
        this.price_product.setValue(this.price_product.value + this.dummyOrder[index]['totalDetail'])
        this.endTotal.setValue(this.price_product.value)
      }
    }
  }

  /*CRUD */
  formReturOrder = this.fb.group({
    tenant_id: [null],
    order_id: [null, Validators.required],
    member_id: [null, Validators.required],
    invoice_no: [null, Validators.required],
    order_return_no: [null, Validators.required],
    created_at: [null],
    status: [1],
    details: [null, Validators.required],
  })
  formUpdateStatus = this.fb.group({
    status: 1,
    warehouse_id: null,
    order_return_no: null
  })

  submitSave() {
    this.loadingAction = true
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
        notes: this.dummyOrder[index]['notes'],
      })
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {
        delete detailsOrder[index]['id']
      }
    }
    this.formReturOrder.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    this.formReturOrder.get('details').setValue(detailsOrder)
    if (this.formReturOrder.valid == true) {
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {
        this.apiBackend.Create(this.formReturOrder.value, 'store-return').subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.notify.showSuccess("Sukses tambah retur penjualan", "ACCOUNTING SYSTEM")
            this.router.navigate(['/dashboard-sales/retur-order'])
          } else {
            this.notify.showError("Gagal tambah retur penjualan", "ACCOUNTING SYSTEM")
          }
          this.loadingAction = false
        },
          (err) => {
            this.errorMessage = err
            this.loadingAction = false
            this.alertError = true
            setTimeout(() => {
              this.alertError = false
            }, 4000)

          });
      } else {
        this.formUpdateStatus.get('warehouse_id').setValue(this.master_warehouse_id.value)
        this.formUpdateStatus.get('order_return_no').setValue(this.formReturOrder.get('order_return_no').value)
        let url = 'return/' + this.apiBackend.serviceAuth()['tenant_id'] + '/update-status/' + this.activeRoute.snapshot.paramMap.get("id")
        this.apiBackend.StatusUpdate(url, this.formUpdateStatus.value).subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.notify.showSuccess("Sukses ubah retur penjualan", "ACCOUNTING SYSTEM")
            this.router.navigate(['/dashboard-sales/retur-order'])
          } else {
            this.notify.showError("Gagal ubah retur penjualan", "ACCOUNTING SYSTEM")
          }
          this.loadingAction = false
        },
          (err) => {
            this.errorMessage = err
            // this.loadingAction = false
            this.alertError = true
            setTimeout(() => {
              this.alertError = false
              this.loadingAction = false
            }, 4000)

          });
      }

    } else {
      alert(this.msgValidation)
      this.loadingAction = false
    }

  }
  dataDetails: any = {}
  showById(id) {
    let url = "return/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      let dummy: any = {}
      dummy = data
      this.dataDetails = dummy.data.order_return
      this.formReturOrder.get('member_id').setValue(dummy.data.order_return.member_id)
      this.formReturOrder.get('order_id').setValue(dummy.data.order_return.order_id)
      this.dataDetails['details'] = dummy.data.details
      this.dataDetails['master_warehouse_id'] = dummy.data.orders.master_warehouse_id
      this.dataDetails['price_product'] = dummy.data.orders.price_product
      let date = this.dataDetails.created_at.split(' ')
      this.formReturOrder.get('created_at').setValue(date[0])
      let dataSO = {}
      dataSO['id'] = dummy.data.order_return.member_id
      this.changeOrder(dataSO)
      this.showRetur(this.dataDetails)
    },
      (err) => {
      });
  }
  showOrder(id) {
    this.apiBackend.Show("order/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      this.dataDetails['master_warehouse_id'] = this.responseBackend.data.order.master_warehouse_id
      this.showRetur(this.dataDetails)

    },
      (err) => {
        this.errorMessage = err
        setTimeout(() => {
          this.alertError = true

        }, 4000)
      });
  }
}
