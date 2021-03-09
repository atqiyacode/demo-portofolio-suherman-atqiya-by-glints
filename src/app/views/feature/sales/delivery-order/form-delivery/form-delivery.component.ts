import { Component, OnInit, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

import { SalesService } from "../../../../library/service/sales.service";
import { LoadJsService } from "../../../../library/service/load-js.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { NotificationService } from "../../../../library/service/notification.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-form-delivery',
  templateUrl: './form-delivery.component.html',
  styleUrls: ['./form-delivery.component.css']
})
export class FormDeliveryComponent implements OnInit, AfterContentChecked {

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
  menuBreadcrumb = this.configMenuDashboard['brd-delivery']

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
      this.menuBreadcrumb[2]['name'] = "Ubah Pengiriman Barang"
      this.nameBtn = "Edit"
      this.isReadonly = true
    } else {
      this.generateCode()
      let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
      this.formDeliveryOrder.get('delivery_date').setValue(date)
      this.menuBreadcrumb[2]['name'] = "Tambah Pengiriman Barang"
      this.nameBtn = "Simpan"
      this.isReadonly = false
    }

  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[1]['img'] = "true"
    this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"


    if (this.formDeliveryOrder.valid == false) {
      this.msgValidation = "Lengkapi form pengiriman barang"
      if (this.noOrder.valid == false) {
        this.msgValidation = "No order harus di pilih"
      }

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
          // if (this.dataProduct.data[index]['variant'].length == 0) {
          //   this.dummyOrder[loop]['disabledQty'] = false
          // }
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
        let end = this.price_product.value + this.price_logistic.value + this.service_fee.value
        this.endTotal.setValue(end)
      }
    }
    if (this.dummyOrder.length == 0) {
      let end = this.price_product.value + this.price_logistic.value + this.service_fee.value
      this.endTotal.setValue(end)
    }
  }
  dataCode: any = {}
  generateCode() {
    this.apiBackend.Get('code-do/').subscribe((data: {}) => {
      this.dataCode = data
      let code = "DO/" + this.formatDate + '/' + this.dataCode.data
      this.formDeliveryOrder.get('no_do').setValue(code)
    },
      (err) => {
        console.log(err)
      });
  }

  dataOrder: any = {}
  loadingAction = false
  noOrder = new FormControl(null, Validators.required)
  master_warehouse_id = new FormControl()
  changeOrder(data) {
    let url = 'member/' + this.apiBackend.serviceAuth()['tenant_id'] + '/order/' + data['id']
    this.apiBackend.Show(url).subscribe((data: {}) => {
      let dummy: any = {}
      dummy = data
      this.dataOrder['data'] = dummy.data.order
    },
      (err) => {
        console.log(err)
      });
  }
  showDelivery(dummyData) {
    this.loadingAction = true
    this.dummyOrder = []
    if (dummyData == undefined) {
      this.price_product.setValue(0)
      this.price_logistic.setValue(0)
      this.service_fee.setValue(0)
      this.endTotal.setValue(0)
    } else {
      this.formDeliveryOrder.get('order_id').setValue(dummyData['id'])
      this.productSelectDetails(dummyData['master_warehouse_id'])

      this.master_warehouse_id.setValue(dummyData['master_warehouse_id'])
      this.price_product.setValue(dummyData['price_product'])
      this.price_logistic.setValue(dummyData['price_logistic'])
      this.service_fee.setValue(dummyData['service_fee'])
      let end = this.price_product.value + dummyData['price_logistic'] + dummyData['service_fee']
      this.endTotal.setValue(end)

      this.orderTable = true
      let dummyDetails = dummyData['details']
      setTimeout(() => {
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty'] * dummyDetails[index]['price']
          if (this.activeRoute.snapshot.paramMap.get("id") != null) {
            this.dummyOrder.push({
              id: dummyDetails[index]['id'],
              master_product_id: dummyDetails[index]['master_product_id'],
              value1: dummyDetails[index]['products']['variant'][0]['value1'],
              value2: dummyDetails[index]['products']['variant'][0]['value2'],
              qty: dummyDetails[index]['qty'],
              price: dummyDetails[index]['price'],
              weight: dummyDetails[index]['weight'],
              totalDetail: total_detail,
              select: [], disabledQty: true, disabledVar2: true, status: true
            })
          } else {
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
                select: [], disabledQty: true, disabledVar2: true, status: true
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
                select: [], disabledQty: true, disabledVar2: true, status: true
              })
            }
          }
          

          this.selectProduct(index, dummyDetails[index]['master_product_id'], 2)
        }
      }, 1000)

    }
    setTimeout(() => {
      this.loadingAction = false
    }, 2000)

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
  /*CRUD */
  formDeliveryOrder = this.fb.group({
    user_id: [null],
    tenant_id: [null],
    member_id: [null, Validators.required],
    no_do: [null, Validators.required],
    order_id: [null],
    noresi: [null, Validators.required],
    delivery_date: [null],
    is_active: [1],
    status: [2],
  })
  formDeliveryStatus = this.fb.group({
    noresi: [null],
    status: [2],
  })

  submitSave() {
    this.loadingAction = true
    if (this.formDeliveryOrder.valid == true && this.noOrder.valid == true) {
      this.formDeliveryStatus.get('status').setValue(this.isChecked)
      this.formDeliveryOrder.get('status').setValue(this.isChecked)
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {

        this.formDeliveryOrder.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
        this.formDeliveryOrder.get('user_id').setValue(this.apiBackend.serviceAuth()['user_id'])
        this.apiBackend.Create(this.formDeliveryOrder.value, 'store-do').subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.notify.showSuccess("Sukses tambah pengiriman barang", "ACCOUNTING SYSTEM")
            this.router.navigate(['/dashboard-sales/delivery-order'])
          } else {
            this.notify.showError("Gagal tambah pengiriman barang", "ACCOUNTING SYSTEM")
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
        this.formDeliveryStatus.get('noresi').setValue(this.formDeliveryOrder.get('noresi').value)

        let id = this.activeRoute.snapshot.paramMap.get("id")
        this.apiBackend.StatusUpdate('update-do/' + id, this.formDeliveryStatus.value).subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.notify.showSuccess("Sukses update pengiriman barang", "ACCOUNTING SYSTEM")
            this.router.navigate(['/dashboard-sales/delivery-order'])
          } else {
            this.notify.showError("Gagal update pengiriman barang", "ACCOUNTING SYSTEM")
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
      }

    } else {
      alert(this.msgValidation)
      this.loadingAction = false
    }

  }
  dataDetails: any = {}
  showById(id) {
    let url = "do/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + id
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      let dummy: any = {}
      dummy = data
      this.dataDetails = dummy.data.order
      this.dataDetails['details'] = dummy.data.detail
      this.showOrder(dummy.data.order.order_id)
      this.noOrder.setValue(this.dataDetails.order_no)
      let day = this.dataDetails.delivery_date.split(" ")
      this.formDeliveryOrder.get('noresi').setValue(this.dataDetails.noresi)
      this.formDeliveryOrder.get('delivery_date').setValue(day[0])
      this.formDeliveryOrder.get('no_do').setValue(this.dataDetails.no_do)
      this.formDeliveryOrder.get('member_id').setValue(this.dataDetails.member_id)
    },
      (err) => {
      });
  }
  showOrder(id) {
    this.apiBackend.Show("order/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      this.dataDetails['master_warehouse_id'] = this.responseBackend.data.order.master_warehouse_id
      this.showDelivery(this.dataDetails)
    },
      (err) => {
        this.errorMessage = err
        setTimeout(() => {
          this.alertError = true

        }, 4000)
      });
  }
}
