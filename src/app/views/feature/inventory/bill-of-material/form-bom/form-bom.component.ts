import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef, Renderer2
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as _ from 'lodash';
import { formatDate } from "@angular/common";

import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { SweetAlertService } from "../../../../library/service/sweetalert.service";
import { DateService } from "../../../../library/service/date.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";

@Component({
  selector: 'app-form-bom',
  templateUrl: './form-bom.component.html',
  styleUrls: ['./form-bom.component.css']
})
export class FormBomComponent implements OnInit,AfterViewInit {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private alert: SweetAlertService,
    public date: DateService,
    public menuService: MenuDashboardService,
    private renderer:Renderer2
  ) { }
  /*CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-bom']

  /*FORM */
  formInform = this.fb.group({
    bom_reff_no: ['', Validators.required],
    production_date: ['', Validators.required],
    master_warehouse_id: [null, Validators.required],
  })
  formFinishMaterial = this.fb.group({
    code: [null, Validators.required],
    name: [null, Validators.required],
    variant1: [null],
    variant2: [null],
    qty: [null, [Validators.required, Validators.pattern("^[0-9]*")]],
  })
  /*FORM RAW MATERIAL */
  formArrayRaw = new FormArray([])
  formRaw = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    variant1: new FormControl(''),
    variant2: new FormControl(''),
    qty: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*")]),
    price: new FormControl(''),
    total: new FormControl(''),
  })

  /*STRING FINISH MATERIAL*/
  dataProduct:any={}
  dataVariation:any=[]
  dataVariant1:any={}
  dataVariant2:any={}
  dataPriceRetail:any=[]
  sellPriceFinish=null
  totalProductFinish=null
  cardActive = 1
  /*STRING RAW MATERIAL */
  tableRawMaterial = false
  dataRawMaterial:any={}

  ngOnInit() {
    this.menuBreadcrumb[1]['img'] = "true"
    this.menuBreadcrumb[1]['color'] = "#696969"
    this.menuBreadcrumb[2]['active'] = "true"
    this.menuBreadcrumb[2]['color'] = "#1c100b"
    this.formInform.get('production_date').setValue(this.date.date())
    this.warehouseList()
    this.generateCode()
    this.dataVariant1.data
    this.dataVariant2.data
  }
  ngAfterViewInit() {
    this.renderer.setStyle(this.finishMaterial.nativeElement, 'color', '#1c100b')
  }

  /*WAREHOUSE */
  dataWarehouse: any = {}
  warehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
    },
      (err) => {
      });
  }
  /*GENERATE CODE */
  dataCode: any
  generateCode() {
    let url = "bom/" + this.apiBackend.serviceAuth()['tenant_id'] + '/code'
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataCode = data
      let code = "BOM-"+this.date.dateCode()+'-'+this.dataCode.data
      this.formInform.get('bom_reff_no').setValue(code)
    },
      (err) => {
      });

  }

  /*MENU BOM */
  @ViewChild('finishMaterial', { static: false }) finishMaterial: ElementRef;
  @ViewChild('rawMaterial', { static: false }) rawMaterial: ElementRef;
  clickMenuBom(val) {
    if (this.formFinishMaterial.invalid) {
      this.alert.showError('Lengkapi Form Barang Jadi')
      return;
    }
    this.cardActive = val
    if (val == 1) {
      this.renderer.setStyle(this.finishMaterial.nativeElement, 'color', '#1c100b')
      this.renderer.setStyle(this.rawMaterial.nativeElement, 'color', '#696969')
    } else {
      this.renderer.setStyle(this.finishMaterial.nativeElement, 'color', '#696969')
      this.renderer.setStyle(this.rawMaterial.nativeElement, 'color', '#1c100b')
    }
  }
  clickCancel() {
    this.cardActive = 1
    if (this.cardActive == 1) {
      this.renderer.setStyle(this.finishMaterial.nativeElement, 'color', '#1c100b')
      this.renderer.setStyle(this.rawMaterial.nativeElement, 'color', '#696969')
    } else {
      this.renderer.setStyle(this.finishMaterial.nativeElement, 'color', '#696969')
      this.renderer.setStyle(this.rawMaterial.nativeElement, 'color', '#1c100b')
    }
    this.formFinishMaterial.reset()
  }
  /*END */

  /*STOCK PRODUCT WITH WAREHOUSE */
  stockProduct(e) {
    this.formFinishMaterial.reset()
    this.dataProduct = {}
    this.dataVariant1 = {}
    this.dataVariant2 = {}
    this.sellPriceFinish = null
    this.totalProductFinish = null
    if (_.isUndefined(e)) {
      return;
    }
    let url = "stock-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + e['id']
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataProduct = data
    },
      (err) => {
        
      });
  }
  /*SELECT PRODUCT */
  selectProduct(data) {
    let variant=[]
    this.dataPriceRetail = []
    this.dataVariant1={}
    this.dataVariant2={}
    this.sellPriceFinish = null
    this.totalProductFinish = null
    this.formFinishMaterial.get('code').setValue(null)
    this.formFinishMaterial.get('qty').setValue(null)
    this.formFinishMaterial.get('variant1').setValue(null)
    this.formFinishMaterial.get('variant2').setValue(null)
    if (_.isUndefined(data)) {
      return
    }
    this.formFinishMaterial.get('code').setValue(data.sku)
    this.dataPriceRetail = data.price_retail
    this.sellPriceFinish = data.sell_price
    this.sellPriceWithoutRetail = this.sellPriceFinish
    data.variant.forEach(element => {
      variant.push({value:element.value1})
      this.dataVariation.push(element)
    });
    this.dataVariant1['data'] = _.uniqBy(variant,'value')
    if (this.dataVariant1.data.length > 0) {
      this.formFinishMaterial.get('variant1').setValidators(Validators.required)
    } else {
      this.formFinishMaterial.get('variant1').setValidators(null)
    }
    this.formFinishMaterial.get('variant1').updateValueAndValidity()
  }
  /*SELECT VARIANT 1*/
  selectVariant1(data) {
    let variant=[]
    this.dataVariant2={}
    this.formFinishMaterial.get('qty').setValue(null)
    this.formFinishMaterial.get('variant2').setValue(null)
    if (_.isUndefined(data)) {
      return;
    }
    this.dataVariation.forEach(element => {
      if (element.value1 == data.value) {
        this.sellPriceFinish = element.sell_price
        this.sellPriceWithoutRetail = this.sellPriceFinish
        if (_.isEmpty(element.value2)) {
        } else {
          variant.push({value:element.value2})
        }
      }
    });
    this.dataVariant2['data'] = _.uniqBy(variant,'value')
    if (this.dataVariant2.data.length > 0) {
      this.formFinishMaterial.get('variant2').setValidators(Validators.required)
    } else {
      this.formFinishMaterial.get('variant2').setValidators(null)
    }
    this.formFinishMaterial.get('variant2').updateValueAndValidity()
  }
  /*SELECT VARIANT 2 */
  selectVariant2(data) {
    this.dataVariation.forEach(element => {
      if (this.formFinishMaterial.get('variant1').value == element.value1 && element.value2 == data.value) {
        this.sellPriceFinish = element.sell_price
        this.sellPriceWithoutRetail = this.sellPriceFinish
      }
    });
  }
  /*QTY */
  sellPriceWithoutRetail:number
  keyupQty(data) {
    if (this.dataPriceRetail.length > 0) {
      for (let index = 0; index < this.dataPriceRetail.length; index++) {
        if (data.target.value >= this.dataPriceRetail[index].qty_min && data.target.value <= this.dataPriceRetail[index].qty_max) {
          this.sellPriceFinish = this.dataPriceRetail[index].price
          return
        } else {
          this.sellPriceFinish = this.sellPriceWithoutRetail
        }
      }
    }
  }
  /*TOTAL */
  orderTotal() {
    let total = this.formFinishMaterial.get('qty').value*this.sellPriceFinish
    this.totalProductFinish = total
  }

  /*RAW MATERIAL */
  /*CREATE PRODUCT */
  createProduct() {
    this.tableRawMaterial = true
    this.formArrayRaw.push(this.formRaw)
  }
}
