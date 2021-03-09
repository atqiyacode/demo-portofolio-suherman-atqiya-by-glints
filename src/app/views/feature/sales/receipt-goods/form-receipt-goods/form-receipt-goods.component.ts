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
  selector: 'app-form-receipt-goods',
  templateUrl: './form-receipt-goods.component.html',
  styleUrls: ['./form-receipt-goods.component.css']
})
export class FormReceiptGoodsComponent implements OnInit, AfterContentChecked {

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
  menuBreadcrumb = this.configMenuDashboard['brd-receipt-order']

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
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      this.menuBreadcrumb[2]['name'] = "Ubah Penerimaan Barang Retur"
      this.nameBtn = "Ubah"
      this.isReadonly = true
    } else {
      let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
      this.formReceiptOrder.get('created_at').setValue(date)
      this.nameBtn = "Simpan"
      this.isReadonly = false
    }

  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[1]['img'] = "true"
    this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"

    if (this.formReceiptOrder.valid == false) {
      this.msgValidation = "Lengkapi form retur penjualan"
    }
  }
  isChecked = 2
  checkedRadio = new FormControl(false)
  checkboxDelivery() {
    if (this.checkedRadio.value == false) {
      this.isChecked = 2
    } else {
      this.isChecked = 3
    }

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

  idReturn = 0
  dataOrder: any = {}
  loadingAction = false
  master_warehouse_id = new FormControl()
  changeOrder(data) {
    if (_.isEmpty(data)) {
      this.dataOrder['data'] = []
      this.formReceiptOrder.get('order_id').setValue(null)
    } else {
      let url = 'member/' + this.apiBackend.serviceAuth()['tenant_id'] + '/return-receipt/' + data['id']
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
    this.idReturn = dummyData['id']
    this.loadingAction = true
    this.dummyOrder = []
    if (dummyData == undefined) {
      this.price_product.setValue(0)
      this.price_logistic.setValue(0)
      this.service_fee.setValue(0)
      this.endTotal.setValue(0)
    } else {
      this.productSelectDetails(dummyData['master_warehouse_id'])
      this.master_warehouse_id.setValue(dummyData['master_warehouse_id'])
      this.formReceiptOrder.get('order_id').setValue(dummyData['id'])
      this.formReceiptOrder.get('noresi').setValue(dummyData['noresi_member'])
      this.orderTable = true
      let dummyDetails = dummyData['details']
      // setTimeout(() => {
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty'] * dummyDetails[index]['price']
          this.price_product.setValue(this.price_product.value + total_detail)
          this.endTotal.setValue(this.price_product.value)
          if (dummyDetails[index]['values'] == null) {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: null,
              value2: null,
              qty: dummyDetails[index]['qty'],
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
              price: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: true, disabledVar2: true, status: true,
              notes: dummyDetails[index]['notes'],
              statusDelete: false
            })
          }

          // this.selectProduct(index, dummyDetails[index]['master_product_id'], 2)
        }
        this.loadingAction = false
      // }, 1000)

    }

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
    if (id == 1) {
      let total = this.dummyOrder[loop]['qty'] * this.dummyOrder[loop]['price']
      this.dummyOrder[loop]['totalDetail'] = total
    }

    for (let index = 0; index < this.dummyOrder.length; index++) {
      if (this.dummyOrder[index]['totalDetail'] != null) {
        this.price_product.setValue(this.price_product.value + this.dummyOrder[index]['totalDetail'])
        // let end = this.price_product.value+this.price_logistic.value+this.service_fee.value
        this.endTotal.setValue(this.price_product.value)
      }
    }
  }

  /*CRUD */
  formReceiptOrder = this.fb.group({
    tenant_id: [null],
    order_id: [null, Validators.required],
    member_id: [null, Validators.required],
    invoice_no: [null],
    noresi: [null, Validators.required],
    created_at: [null],
    status: [2],
    details: [null],
  })
  formUpdateStatus = this.fb.group({
    status: 2,
    warehouse_id: null,
    noresi: null
  })

  submitSave() {
    this.formReceiptOrder.markAllAsTouched()
    if (this.formReceiptOrder.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masih ada input yang kosong',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    this.loadingAction = true
    this.formUpdateStatus.get('status').setValue(this.isChecked)
    this.formUpdateStatus.get('warehouse_id').setValue(this.master_warehouse_id.value)
    this.formUpdateStatus.get('noresi').setValue(this.formReceiptOrder.get('noresi').value)
    let url = 'return/' + this.apiBackend.serviceAuth()['tenant_id'] + '/update-status/' + this.idReturn
    this.apiBackend.StatusUpdate(url, this.formUpdateStatus.value).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          title: 'Sukses ubah penerimaan barang retur',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['/dashboard-sales/return-receipt-order'])
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal ubah penerimaan barang retur!',
          showConfirmButton: false,
          timer: 2000
        })
        this.notify.showError("Gagal ubah retur penjualan", "ACCOUNTING SYSTEM")
      }
      this.loadingAction = false
    },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
          showConfirmButton: false,
          timer: 2000
        })
        this.loadingAction = false
      });

  }
  dataDetails: any = {}
  showById(id) {
    let url = "return/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      let dummy: any = {}
      dummy = data
      this.dataDetails = dummy.data.order_return
      this.formReceiptOrder.get('member_id').setValue(dummy.data.order_return.member_id)
      this.formReceiptOrder.get('order_id').setValue(dummy.data.order_return.order_id)
      this.dataDetails['details'] = dummy.data.details
      this.dataDetails['master_warehouse_id'] = dummy.data.orders.master_warehouse_id
      this.dataDetails['price_product'] = dummy.data.orders.price_product

      let date = this.dataDetails.created_at.split(' ')
      this.formReceiptOrder.get('created_at').setValue(date[0])
      let dataSO = {}
      dataSO['id'] = dummy.data.order_return.member_id
      this.changeOrder(dataSO)
      this.showRetur(this.dataDetails)
    },
      (err) => {
      });
  }
}
