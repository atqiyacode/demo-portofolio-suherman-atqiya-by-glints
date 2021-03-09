import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewChecked, AfterContentChecked,TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbCalendar, NgbDatepicker, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";
import * as _ from 'lodash';

import { SalesService } from "../../../../library/service/sales.service";
import { LoadJsService } from "../../../../library/service/load-js.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { NotificationService } from "../../../../library/service/notification.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.css']
})
export class FormOrderComponent implements OnInit, AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    public notify : NotificationService,
    public salesService: SalesService,
    public loadJs: LoadJsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public menuService:MenuDashboardService,
    public modalService: NgbModal,
    private renderer:Renderer2,
  ) { }
  configMenuDashboard = this.menuService.menu()
  configAttribute = this.salesService.configSalesOrder()
  menuBreadcrumb = this.configMenuDashboard['brd-order']

  orderTable = false
  responseBackend:any={}
  responseProductList:any={}
  dataProduct:any={}
  dataVariant:any={}
  dataMember:any={}
  errorMessage = ""
  alertError = false
  cardOrder = 1

  endTotal = new FormControl(null, Validators.required)
  isApproved = new FormControl(0, Validators.required)
  price_product = new FormControl(0)
  price_logistic = new FormControl(0)
  service_fee = new FormControl(0)
  tax = new FormControl(0)
  variant_2 = new FormControl()

  today = new Date()
  formatDate = formatDate(this.today, 'yyyyMMdd', 'en-ID')
  msgValidation = ""
  validForm = true
  nameDraft = ""

  /*LIFECYCLE HOOKS ANGULAR */
  ngOnInit() {
    this.selectMember()
    this.warehouseList()
    this.generateCode()
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
    } else {
      this.nameDraft = "Simpan"
    }
    let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
    this.formOrder.get('created_at').setValue(date)
    this.formOrder.get('service_fee').setValue(4950)
    this.service_fee.setValue(4950)
  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[1]['img']="true"
    this.menuBreadcrumb[1]['color']="#696969"
    this.menuBreadcrumb[2]['active']="true"
    this.menuBreadcrumb[2]['color']="#1c100b"
    // if (this.dummyOrder.length == 0) {
    //   this.validForm = false
    //   this.msgValidation = "Minimal 1 produk ditambahkan"
    // } else {
    
  }
  /*MODAL DISMISS */
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /*GENERATE CODE */
  dataCode:any={}
  generateCode() {
    this.apiBackend.Get('code-order/').subscribe((data: {}) => { 
      this.dataCode = data
      let code = "SO/"+this.formatDate+'/'+this.dataCode.data
      this.formOrder.get('order_no').setValue(code)
    },
    (err) => {
      console.log(err)
    });
  }

  /*WAREHOUSE */
  dataWarehouse:any={}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => { 
      this.dataWarehouse = data
    },
    (err) => {
      console.log(err)
    });
  }
  showWarehouse(id) {
    this.apiBackend.Show('warehouse/'+this.apiBackend.serviceAuth()['tenant_id']+'/'+id).subscribe((data: {}) => { 
      this.responseBackend = data
      this.formLogistic.get('o').setValue(this.responseBackend.data[0]['location_id'])
    },
    (err) => {
      console.log(err)
    });
  }
  stockProduct(e) {
    let url = "stock-product/"+this.apiBackend.serviceAuth()['tenant_id']+'/'+e
    this.apiBackend.GetSearch(url).subscribe((data: {}) => { 
      this.dataProduct = data
    },
    (err) => {
      console.log(err)
    });
  }

  /*MEMBER */
  cicilanByTenant = true
  selectMember() {
    this.apiBackend.MemberList().subscribe((data: {}) => { 
      this.dataMember = data
    },
    (err) => {
      console.log(err)
    });
  }
  showMember(data) {
    if (data == undefined) {
    } else {
      this.apiBackend.Show('member/'+this.apiBackend.serviceAuth()['tenant_id']+'/'+data['id']).subscribe((data: {}) => { 
        this.responseBackend = data
        this.responseBackend.data['address'].forEach(element => {
          if (element['is_delivery_address'] == 1) {
            this.formLogistic.get('d').setValue(element['location_id'])
          }
        });
        if (this.responseBackend.data.cicilan_by_tenant == 0) {
          this.cicilanByTenant = false
        } else {
          this.cicilanByTenant = true
        }
        
      },
      (err) => {
        console.log(err)
      });
    }
    
  }
  
  /*CREATE ORDER */
  dummyOrder= []
  addOrder() {
    this.price_logistic.setValue(0)
    this.orderTable = true
    if (this.dummyOrder.length == 0) {
      this.dummyOrder.push({id:0,master_product_id:null,value1:null,value2:null,qty:null,price:null,weight:null,
        totalDetail:null,select:[],disabledQty:true,disabledVar2:true,maxQty:null,status:false})
    }
    let length = this.dummyOrder.length-1
    if (this.dummyOrder[length]['totalDetail'] != null) {
      this.dummyOrder.push({id:0,master_product_id:null,value1:null,value2:null,qty:null,price:null,weight:null,
        totalDetail:null,select:[],disabledQty:true,disabledVar2:true,maxQty:null,status:false})
    }
    
  }

  /*TABLE INPUT PRODUCT */
  priceRetailProduct = []
  selectProduct(loop,id,type) {
    if (type == 1) {
      this.dummyOrder[loop]['select'] = null
      this.dummyOrder[loop]['master_product_variant_id'] = null
      this.dummyOrder[loop]['master_product_variant_id_2'] = null
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
          let dummy_value1:any=[]
          let dummy_value2:any=[]
          this.dataProduct.data[index]['variant'].forEach(element => {
            dummy_value1.push({value1:element['value1'], value2:element['value2']})
            dummy_value2.push({value1:element['value1'], value2:element['value2']})
            // if (_.isEmpty(element['value1']) == false) {
            //   dummy_value1.push({value1:element['value1'], value2:element['value2']})
            // }
            // if (_.isEmpty(element['value2']) == false) {
            //   dummy_value2.push({value1:element['value1'], value2:element['value2']})
            // }
          });
          this.dummyOrder[loop]['select_value1'] = _.uniqBy(dummy_value1,'value1')
          this.dummyOrder[loop]['select_value2'] = dummy_value2
          this.dummyOrder[loop]['select'] = this.dataProduct.data[index]['variant']
          this.dummyOrder[loop]['maxQty'] = this.dataProduct.data[index]['stock']
          this.dummyOrder[loop]['minQty'] = this.dataProduct.data[index]['minimum_order']
          if (type == 1) {
            this.dummyOrder[loop]['weight'] = this.dataProduct.data[index]['weight']
            this.dummyOrder[loop]['price'] = this.dataProduct.data[index]['sell_price']
            this.dummyOrder[loop]['priceWithoutRetail'] = this.dataProduct.data[index]['sell_price']
            this.weightShp = this.weightShp+this.dataProduct.data[index]['weight']
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
      this.orderTotal(loop,2)
    }

  }
  selectVariant(loop,e,type) {
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
      this.orderTotal(loop,2)
    } else {
      if (type == 1) {
        let dummy = []
        this.dummyOrder[loop]['select_value2'].forEach(element => {
          if (element['value1'] == this.dummyOrder[loop]['value1']) {
            dummy.push({
              value1:element['value1'],
              value2:element['value2']
            })
          }
        });
        this.dummyOrder[loop]['new_value2'] = dummy

      }
    }
    
  }

  /*TOTAL ORDER */
  orderTotal(loop,id) {
    this.price_product.setValue(0)
    this.tax.setValue(0)
    this.endTotal.setValue(0)

    /*PRICE WITH RETAIL */
    if (id == 1) {
      for (let index = 0; index < this.priceRetailProduct.length; index++) {
        if (this.dummyOrder[loop]['qty'] >= this.priceRetailProduct[index]['qty_min'] && this.dummyOrder[loop]['qty'] <= this.priceRetailProduct[index]['qty_max'] ) {
          this.dummyOrder[loop]['price'] = this.priceRetailProduct[index]['price']
          break;
        } else {
          this.dummyOrder[loop]['price'] = this.dummyOrder[loop]['priceWithoutRetail']
        }
      }
      let total = this.dummyOrder[loop]['qty']*this.dummyOrder[loop]['price']
      this.dummyOrder[loop]['totalDetail'] = total
    }

    for (let index = 0; index < this.dummyOrder.length; index++) {
      if (this.dummyOrder[index]['totalDetail'] != null) {
        this.price_product.setValue(this.price_product.value+this.dummyOrder[index]['totalDetail'])
        // this.tax.setValue(this.price_product.value*0.02)
        let end = this.price_product.value+this.price_logistic.value+this.service_fee.value
        this.endTotal.setValue(end)
      }
    }
    if (this.dummyOrder.length == 0) {
      let end = this.price_product.value+this.price_logistic.value+this.service_fee.value
      this.endTotal.setValue(end)
    }
  }
  serviceFeeKeyup() {
    this.endTotal.setValue(0)
    for (let index = 0; index < this.dummyOrder.length; index++) {
      let end = this.price_product.value+this.price_logistic.value+this.service_fee.value
      this.endTotal.setValue(end)
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
  removeOrder(loop,id) {
    this.price_logistic.setValue(0)
    this.weightShp = this.weightShp-this.dummyOrder[loop]['weight']
    this.dummyOrder.splice(loop, 1)
    this.orderTotal(loop,2)

    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      let url = "quotation-detail/"+id+'/delete/'+this.activeRoute.snapshot.paramMap.get("id")
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

  /*LOGISTIC */
  @ViewChild('contentModal') public templateref: TemplateRef<any>;
  dataLogisticOrder:any={}
  closeResult = ''
  modalLogistic = 0
  loadingLogistic = false
  openModal(id) {
    this.modalLogistic = id
    // this.dataLogisticOrder = {}
    this.listLogistic()
    if (this.formOrder.valid) {
      if (this.dummyOrder.length > 0) {
        this.modalService.open(this.templateref,  
          {ariaLabelledBy: 'modal-basic-title', scrollable: true}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      } else {
        alert('Minimal 1 produk ditambahkan')
      }
      
    } else {
      alert('Lengkapi Form')
    }
    
  }
  listLogistic() {
    this.apiBackend.Show('tenant/'+this.apiBackend.serviceAuth()['tenant_id']+'/list-logistic').subscribe((data: {}) => { 
      this.dataLogisticOrder = data
    },
    (err) => {
      console.log(err)
    });
  }

  weightShp = 0
  formLogistic = this.fb.group({
    o:[null],
    d:[null],
    wt:[null],
    v:[null],
  })
  tenant_postal_fee = new FormControl()
  alert_logistic = false
  error_logistic = ""
  dataFormLogistic = {}
  submitLogistic() {
    this.loadingLogistic = true
    let convertKg = this.weightShp/1000
    this.formOrder.get('logistic_id').setValue(this.dummyLogistic['master_logistic_id'])
    if (this.modalLogistic == 2) {
      this.price_logistic.setValue(this.tenant_postal_fee.value)
      this.tenant_postal_fee.setValue(null)
      let end = this.price_product.value+this.price_logistic.value+this.service_fee.value
      this.endTotal.setValue(end)
    }
    if (this.dummyLogistic['master_logistic_id'] == 99) {
      this.modalLogistic = 2
      this.loadingLogistic = false
    } else {
      this.formLogistic.get('v').setValue(this.endTotal.value)
      this.formLogistic.get('wt').setValue(convertKg)
      this.apiBackend.Shipping(this.formLogistic.value,'logistic/'+this.apiBackend.serviceAuth()['tenant_id']+'/rate/'+this.dummyLogistic['rate_id']).subscribe((data: {}) => { 
        this.responseBackend = data
        this.price_logistic.setValue(this.responseBackend.data['0']['finalRate'])
        this.endTotal.setValue(this.endTotal.value+this.price_logistic.value)
        this.modalService.dismissAll()
        this.loadingLogistic = false
      },
      (err) => {
        this.loadingLogistic = false
        this.alert_logistic = true
        if (err == 413) {
          this.error_logistic = "Wilayah Customer tidak dapat dijangkau, silahkan pilih By Tenant"
        } else {
          this.error_logistic = err
        }
        setTimeout(()=>{
          this.alert_logistic = false
         }, 5000)
      });
      
    }
  }
  dummyLogistic:any={}
  checkLogistic(val) {
    this.dummyLogistic = val
  }
  cancelLogistic() {
    this.loadingLogistic = false
  }
  /*END LOGISTIC */
  /*PAYMENT */
  modalPayment = 1
  noOrder = ""
  @ViewChild('contentPayment') public contentPayment: TemplateRef<any>;
  payment(id) {
    this.modalPayment = id
    if (this.dummyOrder.length == 0) {
      alert('Minimal 1 produk ditambahkan')
      return;
    }
    if (this.price_logistic.value == 0 || _.isNull(this.price_logistic.value)) {
      alert('Ekspedisi belum dipilih')
      return;
    }
    for (let index = 0; index < this.dummyOrder.length; index++) {
      if (this.dummyOrder[index]['qty'] < this.dummyOrder[index]['minQty']) {
        this.dummyOrder[index]['status'] = false
        alert('Minimal jumlah tidak sesuai')
        return;
      } else {
        if (this.dummyOrder[index]['qty'] > this.dummyOrder[index]['maxQty']) {
          this.dummyOrder[index]['status'] = false
          alert('Melebihi maksimal jumlah')
          return;
        } else {
          this.dummyOrder[index]['status'] = true
        }
      }
    }
    if (this.formOrder.valid == false) {
      alert('Nama pelanggan dan Gudang harus diisi')
      return;
    }
    if (id == 1) {
      this.listBank()
    }
    this.modalService.open(this.contentPayment,  
      {ariaLabelledBy: 'modal-basic-title',scrollable: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }
  dataBank:any={}
  dummyBankOrder:any={}
  listBank() {
    let dummy:any=[]
    this.apiBackend.Show('tenant/'+this.apiBackend.serviceAuth()['tenant_id']+'/list-bank').subscribe((data: {}) => { 
      this.dataBank = data

      if (this.cicilanByTenant == false) {
        for (let index = 0; index < this.dataBank.data.length; index++) {
          if (this.dataBank.data[index]['bank_id'] == 99) {
          } else {
            dummy.push(this.dataBank.data[index])
          }
        }
        this.dataBank['data'] = dummy 
      }
      
    },
    (err) => {
      console.log(err)
      // this.alertError = true
      // this.errorMessage = err
    });
  }
  submitBank(item) {
    this.dummyBankOrder = item
    this.formOrder.get('master_bank_id').setValue(this.dummyBankOrder['bank_id'])
    this.formOrder.get('payment_type').setValue(this.dummyBankOrder['payment_type'])
  }
  copyText(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.modalService.dismissAll()
  }
  selectPaymentTenant(e) {
    this.formOrder.get('tenor').setValue(e.target.value)
  }

  loadingPayment = false
  paymentByTenant = false
  submitOrderModal() {
    if (this.dummyBankOrder['bank_id'] != 99) {
      this.loadingPayment = true
      this.submitSave()
    } else {
      this.formOrder.get('tenor').setValue(3)
      this.modalPayment = 4
    } 
  }
  submitOrderByTenant() {
    this.loadingPayment = true
    this.submitSave()
  }
  /*DRAFT */
  btnDraft = 0
  saveDraft() {
    this.btnDraft = 1
    this.submitSave()
  }
  /*CRUD */
  totalOrder = ""
  formOrder = this.fb.group({
    user_id:[null],
    member_id:[null, Validators.required],
    tenant_id:[null],
    master_bank_id:[null],
    master_warehouse_id:[null, Validators.required],
    order_no:[null],
    created_at:[null],
    delivery_destination:[''],
    logistic_id:[0],
    price_product:[0],
    price_logistic:[0],
    service_fee:[null],
    tax:[0],
    is_active:[1],
    is_draft:[0],
    payment_type:[null],
    tenor:[null],
    details:[],
    quotation_no:[null],
  })
  /*BY QUOTATION */
  noQuotation = new FormControl(null)
  disabledQuotation = false
  @ViewChild('hello', { static: false }) divHello: ElementRef;
  dataShowQuotation:any={}
  showQuotation(data) {
    if (data == undefined) {
        this.dataShowQuotation = {}
        this.formOrder.get('quotation_no').setValue(null)
        if (this.disabledQuotation == true) {
          this.selectByQuotation(undefined)
        }
    } else {
      let url = "member/"+this.apiBackend.serviceAuth()['tenant_id']+'/quotation/'+data['id']
      this.apiBackend.GetSearch(url).subscribe((data: {}) => { 
        let dummy:any={}
        dummy = data
        this.dataShowQuotation['data'] = dummy.data.quotation
      },
      (err) => {
        console.log(err)
      });
    }
    
  }
  selectByQuotation(dummyData) {
    this.loadingAction = true
    this.dummyOrder = []
    if (dummyData == undefined) {
      this.noQuotation.setValue(null)
      this.disabledQuotation = false
      let date = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
      this.formOrder.get('created_at').setValue(date)
      this.formOrder.get('master_warehouse_id').setValue(null)
      this.price_product.setValue(null)
      this.price_logistic.setValue(0)
      // this.service_fee.setValue(null)
      this.endTotal.setValue(null)
      this.formOrder.get('quotation_no').setValue(null)
    } else {
      this.formOrder.get('quotation_no').setValue(dummyData['quotation_no'])
      this.showWarehouse(dummyData['master_warehouse_id'])
      this.stockProduct(dummyData['master_warehouse_id'])

      this.disabledQuotation = true
      this.formOrder.get('created_at').setValue(dummyData['quotation_date'])
      this.formOrder.get('master_warehouse_id').setValue(dummyData['master_warehouse_id'])
      this.price_product.setValue(dummyData['price_product'])
      // this.price_logistic.setValue(dummyData['price_logistic'])
      // this.service_fee.setValue(dummyData['service_fee'])
      let end = this.price_product.value+this.service_fee.value
      this.endTotal.setValue(end)

      this.formLogistic.get('v').setValue(this.endTotal.value)

      this.orderTable = true
      let dummyDetails = dummyData['details']
      setTimeout(()=>{
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty']*dummyDetails[index]['price']
          this.weightShp = this.weightShp+dummyDetails[index]['weight']
          if (dummyDetails[index]['values'] == null) {
            this.dummyOrder.push({
              id:dummyDetails[index]['id'],
              master_product_id:dummyDetails[index]['master_product_id'],
              value1:null,
              value2:null,
              qty:dummyDetails[index]['qty'],
              price:dummyDetails[index]['price'],
              priceWithoutRetail:dummyDetails[index]['price'],
              weight:dummyDetails[index]['weight'],
              totalDetail:total_detail,
              select:[],disabledQty:true,disabledVar2:true,status:true})
          } else {
            this.dummyOrder.push({
              id:dummyDetails[index]['id'],
              master_product_id:dummyDetails[index]['master_product_id'],
              value1:dummyDetails[index]['values']['value1'],
              value2:dummyDetails[index]['values']['value2'],
              qty:dummyDetails[index]['qty'],
              price:dummyDetails[index]['price'],
              priceWithoutRetail:dummyDetails[index]['price'],
              weight:dummyDetails[index]['weight'],
              totalDetail:total_detail,
              select:[],disabledQty:true,disabledVar2:true,status:true})
          }
          
          this.selectProduct(index,dummyDetails[index]['master_product_id'],2)
        }
      }, 1000)
      
    }
    setTimeout(()=>{
      this.loadingAction = false
    }, 2000)
    
  }
  
  loadingAction = false
  btnTenant = false
  submitSave() {
    if (this.validForm == true && this.formOrder.valid == true) {
      this.formOrder.get('user_id').setValue(this.apiBackend.serviceAuth()['user_id'])
      this.formOrder.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
      this.formOrder.get('price_logistic').setValue(this.price_logistic.value)
      this.formOrder.get('price_product').setValue(this.price_product.value)
      // this.formOrder.get('tax').setValue(this.tax.value)
      this.totalOrder = this.endTotal.value
      let url = ""
      let responseSuccess = ""
      let responseError = ""
      let detailsOrder = []
      for (let index = 0; index < this.dummyOrder.length; index++) {
        
        detailsOrder.push({
          id:this.dummyOrder[index]['id'],
          master_product_id:this.dummyOrder[index]['master_product_id'],
          value1:this.dummyOrder[index]['value1'],
          value2:this.dummyOrder[index]['value2'],
          qty:this.dummyOrder[index]['qty'],
          price:this.dummyOrder[index]['price'],
          weight:this.dummyOrder[index]['weight'],
        })
        if (this.activeRoute.snapshot.paramMap.get("id") == null) {
          delete detailsOrder[index]['id']
        }
      }
      if (this.btnDraft == 1) {
        this.formOrder.get('is_draft').setValue(1)
      } else {
        this.formOrder.get('is_draft').setValue(0)
      }
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {
        url = "store-order"
        responseSuccess = "Sukses Tambah Pesanan"
        responseError = "Gagal Tambah Pesanan"
      } else {
        url = "order/"+this.apiBackend.serviceAuth()['tenant_id']+'/update/'+this.activeRoute.snapshot.paramMap.get("id")
        responseSuccess = "Sukses Edit Pesanan"
        responseError = "Gagal Edit Pesanan"
      }
      this.formOrder.get('details').setValue(detailsOrder)
      this.apiBackend.Create(this.formOrder.value,url).subscribe((data: {}) => { 
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          if (this.btnDraft != 1) {
            if (this.dummyBankOrder['bank_id'] != 99) {
              this.btnTenant = false
              // this.totalOrder = this.responseBackend.data.payment.total
              this.noOrder = this.responseBackend.data.payment.account_no
              this.dateOrder = formatDate(this.responseBackend.data.payment.expired_at, 'EEEE, dd LLLL yyyy HH:mm', 'en-ID')
              this.finishedOrder(1)
            } else {
              this.btnTenant = true
              this.router.navigate(['/dashboard-sales/sales-order'])
            }
            this.modalPayment = 3
          } else {
            this.router.navigate(['dashboard-sales/sales-order']);
          }
          
        } else {
          this.notify.showError(responseError, "ACCOUNTING SYSTEM")
        }
        this.loadingPayment = false
      },
      (err) => {
        this.loadingPayment = false
       setTimeout(()=>{
        this.alertError = true
        this.errorMessage = err
       }, 4000)
      
      });
  } else {
    alert(this.msgValidation)
    
  }
    
  }
  btnActive = true
  showById(id) {
    this.nameDraft = "Edit"
    this.apiBackend.Show("order/"+this.apiBackend.serviceAuth()['tenant_id']+'/'+id).subscribe((data: {}) => { 
      this.responseBackend = data
      let dummyData = this.responseBackend.data['order']
      let date = dummyData['created_at'].split(' ')

      this.stockProduct(dummyData['master_warehouse_id'])
      this.formOrder.get('member_id').setValue(dummyData['member_id'])
      this.formOrder.get('created_at').setValue(date[0])
      this.formOrder.get('order_no').setValue(dummyData['order_no'])
      this.formOrder.get('master_warehouse_id').setValue(dummyData['master_warehouse_id'])

      this.orderTable = true
      let dummyDetails = this.responseBackend.data['detail']
      setTimeout(()=>{
        for (let index = 0; index < dummyDetails.length; index++) {
          let total_detail = dummyDetails[index]['qty']*dummyDetails[index]['price']
          if (dummyDetails[index]['values'] == null) {
            this.dummyOrder.push({
              id:dummyDetails[index]['id'],
              master_product_id:dummyDetails[index]['master_product_id'],
              value1:null,
              value2:null,
              qty:dummyDetails[index]['qty'],
              price:dummyDetails[index]['price'],
              priceWithoutRetail:dummyDetails[index]['price'],
              weight:dummyDetails[index]['weight'],
              totalDetail:total_detail,
              select:[],disabledQty:false,disabledVar2:false,status:true})
          } else {
            this.dummyOrder.push({
              id:dummyDetails[index]['id'],
              master_product_id:dummyDetails[index]['master_product_id'],
              value1:dummyDetails[index]['values']['value1'],
              value2:dummyDetails[index]['values']['value2'],
              qty:dummyDetails[index]['qty'],
              price:dummyDetails[index]['price'],
              priceWithoutRetail:dummyDetails[index]['price'],
              weight:dummyDetails[index]['weight'],
              totalDetail:total_detail,
              select:[],disabledQty:false,disabledVar2:false,status:true})
          }
          
          this.selectProduct(index,dummyDetails[index]['master_product_id'],2)
        }
      }, 1000)

      this.price_product.setValue(dummyData['price_product'])
      this.price_logistic.setValue(dummyData['price_logistic'])
      // this.service_fee.setValue(dummyData['service_fee'])
      // this.tax.setValue(dummyData['tax'])
      let end = this.price_product.value+dummyData['price_logistic']+this.service_fee.value
      this.endTotal.setValue(end)
    },
    (err) => {
      this.errorMessage = err
      setTimeout(()=>{
        this.alertError = true
        
      }, 4000)
    });
  }

  dateOrder = ""
  finishedOrder(type) {
    
    this.cardOrder = 2
    this.menuBreadcrumb[2]['active']="true"
    this.menuBreadcrumb[2]['color']="#696969"
    this.menuBreadcrumb[3]['active']="true"
    this.menuBreadcrumb[3]['color']="#1c100b"
    if (type == 2) {
      this.modalService.dismissAll()
    }
   
  }
  finishedOrderTenant() {
    this.modalService.dismissAll()
    this.router.navigate(['/dashboard-sales/sales-order'])
  }
  printPage() {
    window.print();
  }
}
