import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { InventoryService } from "../../../../library/service/inventory.service";
import { SweetAlertService } from "../../../../library/service/sweetalert.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
@Component({
  selector: 'app-form-product-inventory',
  templateUrl: './form-product-inventory.component.html',
  styleUrls: ['./form-product-inventory.component.css']
})
export class FormProductInventoryComponent implements OnInit, AfterViewInit, AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private alert: SweetAlertService,
    public attribute: InventoryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public menuService: MenuDashboardService,
  ) { }
  /*CHILDREN UPLOAD IMAGE */
  @ViewChild('content') public templateref: TemplateRef<any>
  @ViewChild('modalSpesification') public modalSpesification: TemplateRef<any>
  @ViewChild('modalWholescale') public modalWholescale: TemplateRef<any>

  btnShow = false
  afterInit = 0

  /*STRING */
  errorMessage = ""
  alertError = false
  response_backend: any = {}

  /*FORM INFORMATION*/
  informProduct = this.fb.group({
    product_name: [null, [Validators.required, Validators.minLength(10)]],
    parent_old: [null, Validators.required],
    parent_new: [null, Validators.required],
    product_category_id: [null, Validators.required],
  })
  /*FORM IMAGE MAIN */
  imageMainArray = []
  /*FORM DESCRIPTION PRODUCT */
  descProduct = this.fb.group({
    description: [null, [Validators.required, Validators.minLength(10)]],
    master_brand_id: [null, Validators.required],
  })
  arraySpec: any = []
  /*FORM PRICE WITHOUT VARIANT */
  priceProduct = this.fb.group({
    minimum_order: [null, [Validators.required, Validators.pattern("^[0-9]*")]],
    sell_price: [null, [Validators.required, Validators.pattern("^[0-9]*")]]
  })
  sellPriceById = new FormControl('')
  /*FORM STATUS RETAIL */
  productStatusRetail = this.fb.group({
    stock_product: [null, [Validators.required, Validators.pattern("^[0-9]*")]],
    sku: [null, Validators.required],
    is_active: [true],
  })
  /*FORM WEIGHT */
  weightProduct = this.fb.group({
    weight_id: [null, Validators.required],
    weight: [null, Validators.required],
    total_weight: [null],
    long: [null],
    wide: [null],
    height: [null],
    minimum_stock: [null, Validators.required],
  })
  /*DATA SELECT WEIGHT */
  base_unit = [
    { id: 1, name: 'gram' },
    { id: 2, name: 'kg' }
  ];

  /*FORM TO API */
  formSubmitProduct = this.fb.group({
    product_name: [null],
    product_category_id: [null],
    images: [null],
    description: [null],
    master_brand_id: [null],
    specification: [null],
    weight: [null],
    dimensions: [null],
    sell_price: [null],
    base_price: [null],
    price_retail: [null],
    variation: [null],
    variant_cat: [null],
    minimum_order: [null],
    minimum_stock: [null],
    stock_begining: [null],
    sku: [null],
    is_active: [null],
  })
  /*ETC */
  is_adjusted = false

  ngOnInit() {
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.btnShow = true
    }
    for (let index = 0; index < 4; index++) {
      this.imageMainArray.push({ id: 0, image_url: null });
    }
    this.categoryList()
    this.brandList()

  }
  ngAfterViewInit() {
  }
  ngAfterContentChecked() {
  }
  /*API CATEGORY*/
  selectCategory = 1
  dataCategoryProduct: any = {}
  dataSubCategory1: any = {}
  dataSubCategory2: any = {}
  categoryList() {
    this.apiBackend.Get('master-data-product-category').subscribe((data: {}) => {
      this.dataCategoryProduct = data
      if (this.activeRoute.snapshot.paramMap.get("id") != null) {
        this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*CHANGE SUB CATEGORY */
  changeSub1(e) {
    this.dataSubCategory2 = {}
    this.dataSubCategory1 = {}
    if (_.isEmpty(e) == false) {
      this.dataSubCategory1['data'] = e['children']
      this.selectCategory = 2
    } else {
      this.informProduct.get('product_category_id').setValue(null)
      this.informProduct.get('parent_new').setValue(null)
      this.selectCategory = 1
    }

  }
  changeSub2(e) {
    this.dataSubCategory2 = {}
    if (_.isEmpty(e) == false) {
      this.dataSubCategory2['data'] = e['children']
      this.selectCategory = 3
    } else {
      this.informProduct.get('product_category_id').setValue(null)
      this.selectCategory = 2
    }

  }

  /*BRAND LIST */
  dataBrand: any = {}
  brandList() {
    this.apiBackend.Get('brand').subscribe((data: {}) => {
      this.dataBrand = data
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*NEW IMAGE PRODUCT */
  submittedImage = false
  imageProductNew(id, files) {
    var reader = new FileReader();
    if (files.length === 0)
      return;
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      let uploadImage: any = new FormData()
      uploadImage.append("file", files[0])
      uploadImage.append("path", "image-main")
      this.apiBackend.MasterProduct(uploadImage, 'upload').subscribe((data: {}) => {
        this.response_backend = data
        if (this.response_backend.status == 200) {
          this.imageMainArray[id]['image_url'] = this.response_backend['data']['file']
        } else {
          this.alert.showError('Gagal upload gambar produk')
        }
      },
        (err) => {
          this.alert.showError(err)
        });
    }

  }
  removeImageProductNew(id, i) {
    this.imageMainArray[i]['image_url'] = null
    if (id != 0) {
      let url = "product/delete/image-main/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' +
        this.activeRoute.snapshot.paramMap.get("id") + '/' + id
      this.apiBackend.Show(url).subscribe((data: {}) => {
        this.response_backend = data
      },
        (err) => {
          this.alert.showError(err)
        });
    }
  }

  /*=====SPESIFICATION=====*/
  submittedSpec = false
  tableSpecification = false
  createSpecification() {
    this.tableSpecification = true
    let dummy: any = {}
    dummy['name'] = null
    dummy['description'] = null
    if (this.arraySpec.length == 0) {
      this.arraySpec.push(dummy)
    }
    let length = this.arraySpec.length - 1
    if (this.arraySpec[length]['name'] != null) {
      this.arraySpec.push(dummy)
    }
  }
  removeSpecification(id) {
    this.arraySpec.splice(id, 1)
    if (this.arraySpec.length == 0) {
      this.tableSpecification = false
    }
  }

  /*=======VARIANT======== */
  tableVariant = false
  dataVariation = []
  dataVariant: any = []
  dummyVariantOne = new FormArray([])
  dummyVariantTwo = new FormArray([])
  variation1 = new FormControl()
  variation2 = new FormControl()
  sell_price_var = new FormControl()
  base_price_var = new FormControl()
  stock_var = new FormControl()
  sku_var = new FormControl()
  dataVariantTable() {
    let data = {}
    data['id'] = 0
    data['sku'] = null
    data['sell_price'] = null
    data['base_price'] = null
    data['value1'] = 1
    data['value2'] = 1
    data['image_url'] = null
    data['stock_begining'] = null
    data['is_active'] = true
    data['disabled'] = false
    return data
  }
  onVariant() {
    this.tableVariant = true
    this.btnPriceRetail = false
    this.priceProduct.get('sell_price').setValidators(null)
    this.priceProduct.get('sell_price').updateValueAndValidity()
    this.priceProduct.get('sell_price').disable()
    this.priceProduct.reset()
    this.productStatusRetail.reset()
    this.productStatusRetail.get('is_active').setValue(true)

    this.productStatusRetail.get('stock_product').setValidators(null)
    this.productStatusRetail.get('sku').setValidators(null)
    this.productStatusRetail.get('stock_product').updateValueAndValidity()
    this.productStatusRetail.get('sku').updateValueAndValidity()
    this.productStatusRetail.get('stock_product').disable()
    this.productStatusRetail.get('sku').disable()

    this.sameSellPriceVariant()
  }
  offVariant() {
    this.tableVariant = false
    let remove = []
    for (let index = 0; index < this.dataVariant.length; index++) {
      remove.push(this.dataVariant[index]['id'])
    }
    this.dataVariant = []
    for (let rm = 0; rm < remove.length; rm++) {
      this.deleteVariationToApi(remove[rm])
    }
    this.priceProduct.get('sell_price').enable()
    this.priceProduct.get('sell_price').setValidators([Validators.required, Validators.pattern("^[0-9]*")])
    this.priceProduct.get('sell_price').updateValueAndValidity()

    this.productStatusRetail.get('stock_product').setValidators([Validators.required, Validators.pattern("^[0-9]*")])
    this.productStatusRetail.get('sku').setValidators(Validators.required)
    this.productStatusRetail.get('stock_product').updateValueAndValidity()
    this.productStatusRetail.get('sku').updateValueAndValidity()
    this.productStatusRetail.enable()
    this.productStatusRetail.get('is_active').setValue(true)
  }
  /*CREATE VARIATION */
  createVariantOne() {
    /*Validation Variant < 20 */
    if (this.dataVariant.length < 20) {
      if (this.dummyVariantOne.value.length == 0) {
        this.dummyVariantOne.push(new FormControl(''))
      }
      let no = this.dummyVariantOne.value.length - 1
      let var1: any = true
      for (let index = 0; index <= no; index++) {
        if (_.isEmpty(this.dummyVariantOne.value[index])) {
          var1 = false
        }
      }
      if (var1 == true) {
        this.dummyVariantOne.push(new FormControl(''))
      }

    } else {
      this.alert.showError('Maksimal Variant 20')
    }
  }
  createVariantTwo() {
    if (this.dummyVariantOne.value.length == 0) {
      this.alert.showError('Varian 1 Harus diisi')
      return;
    }
    /*Validation Variant < 20 */
    if (this.dataVariant.length < 20) {
      if (this.dummyVariantTwo.value.length == 0) {
        this.dummyVariantTwo.push(new FormControl(''))
      }
      let no = this.dummyVariantTwo.value.length - 1
      let var1: any = true
      for (let index = 0; index <= no; index++) {
        if (_.isEmpty(this.dummyVariantTwo.value[index])) {
          var1 = false
        }
      }
      if (var1 == true) {
        this.dummyVariantTwo.push(new FormControl(''))
      }

    } else {
      this.alert.showError('Maksimal Variant 20')
    }
  }

  /*DELETE VARIATION */
  deleteVariantOne(id) {
    let delVar = this.dummyVariantOne.value[id]
    this.dummyVariantOne.removeAt(id)
    let remove = []
    for (let index = 0; index < this.dataVariant.length; index++) {
      if (this.dataVariant[index]['value1'] == delVar) {
        this.dataVariant[index]['value1'] = null
        remove.push(this.dataVariant[index]['id'])
      }
    }
    if (this.dataVariant.length > 0) {
      this.deleteVariation(1, remove)
    }
  }
  deleteVariantTwo(id) {
    let delVar = this.dummyVariantTwo.value[id]
    this.dummyVariantTwo.removeAt(id)
    let remove = []
    for (let index = 0; index < this.dataVariant.length; index++) {
      if (this.dataVariant[index]['value2'] == delVar) {
        this.dataVariant[index]['value2'] = null
        remove.push(this.dataVariant[index]['id'])
      }
    }
    if (this.dataVariant.length > 0) {
      this.deleteVariation(2, remove)
    }
  }
  deleteVariation(type, remove) {
    let noVar1 = 1
    let noVar2 = 1
    if (this.dummyVariantTwo.value.length != 0) {
      noVar2 = this.dummyVariantTwo.value.length
    }
    if (this.dummyVariantOne.value.length != 0) {
      noVar1 = this.dummyVariantOne.value.length
    }
    let total = noVar1 * noVar2
    if (this.dataVariant.length > total) {
      if (type == 1) {
        _.remove(this.dataVariant, function (e) {
          return _.isEmpty(e['value1']);
        })
      }
      if (type == 2) {
        _.remove(this.dataVariant, function (e) {
          return _.isEmpty(e['value2']);
        })
      }
      for (let index = 0; index < remove.length; index++) {
        this.deleteVariationToApi(remove[index])
      }
    }
    if (this.dataVariant.length == 1) {
      if (_.isEmpty(this.dataVariant[0]['value1']) && _.isEmpty(this.dataVariant[0]['value2'])) {
        this.dataVariant.splice(1, 1)
        this.offVariant()
      }
    }
    if (this.dataVariant.length == 0) {
      this.offVariant()
    }
  }
  deleteVariationToApi(id) {
    if (id != 0) {
      let url = "product/delete/variation/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id
      this.apiBackend.Show(url).subscribe((data: {}) => {
        this.response_backend = data
      },
        (err) => {
          this.alert.showError(err)
        });
    }

  }
  /*SETTING VARIATION 1 AND 2 IN TABLE */
  setVariant() {
    let varOne = this.dummyVariantOne.value
    let varTwo = this.dummyVariantTwo.value
    let noVar1 = 1
    let noVar2 = 1
    let dummyVar = []
    if (varOne.length != 0) {
      noVar1 = varOne.length
    }
    if (varTwo.length != 0) {
      noVar2 = varTwo.length
    }
    if (this.dataVariant.length == 0) {
      this.onVariant()
      for (let v1 = 0; v1 < noVar1; v1++) {
        for (let v2 = 0; v2 < noVar2; v2++) {
          if (this.dataVariant.length < 20) {
            let data = this.dataVariantTable()
            data['value2'] = varTwo[v2]
            data['value1'] = varOne[v1]
            this.dataVariant.push(data)
          } else {
            return;
          }
        }
      }

    } else {
      for (let v1 = 0; v1 < noVar1; v1++) {
        for (let v2 = 0; v2 < noVar2; v2++) {
          if (this.dataVariant.length < 20) {
            let data = this.dataVariantTable()
            data['value2'] = varTwo[v2]
            data['value1'] = varOne[v1]
            dummyVar.push(data)
          } else {
            return;
          }

        }
      }
      for (let index = 0; index < dummyVar.length; index++) {
        for (let variant = 0; variant < this.dataVariant.length; variant++) {

          let valBoolean1 = this.dataVariant[variant]['value1'] == dummyVar[index]['value1']
          if (valBoolean1 == true &&
            this.dataVariant[variant]['value2'] == dummyVar[index]['value2']) {
            dummyVar[index]['id'] = this.dataVariant[variant]['id']
            dummyVar[index]['sku'] = this.dataVariant[variant]['sku']
            dummyVar[index]['sell_price'] = this.dataVariant[variant]['sell_price']
            dummyVar[index]['base_price'] = this.dataVariant[variant]['base_price']
            dummyVar[index]['image_url'] = this.dataVariant[variant]['image_url']
            dummyVar[index]['stock_begining'] = this.dataVariant[variant]['stock_begining']
            dummyVar[index]['is_active'] = this.dataVariant[variant]['is_active']
            dummyVar[index]['disabled'] = this.dataVariant[variant]['disabled']
          }
          if (valBoolean1 == true && _.isEmpty(this.dataVariant[variant]['value2'])) {
            dummyVar[index]['id'] = this.dataVariant[variant]['id']
            dummyVar[index]['sku'] = this.dataVariant[variant]['sku']
            dummyVar[index]['sell_price'] = this.dataVariant[variant]['sell_price']
            dummyVar[index]['base_price'] = this.dataVariant[variant]['base_price']
            dummyVar[index]['image_url'] = this.dataVariant[variant]['image_url']
            dummyVar[index]['stock_begining'] = this.dataVariant[variant]['stock_begining']
            dummyVar[index]['is_active'] = this.dataVariant[variant]['is_active']
            dummyVar[index]['disabled'] = this.dataVariant[variant]['disabled']

          }


        }
      }
      this.dataVariant = dummyVar
    }
  }
  /*SET ALL INFORMATION VARIANT */
  setInformVarAll() {
    if (this.dataVariant.length > 0) {
      for (let i = 0; i < this.dataVariant.length; i++) {
        if (this.sell_price_var.value > 0) {
          this.dataVariant[i]['sell_price'] = this.sell_price_var.value
          this.sameSellPriceVariant()
        }
        if (this.base_price_var.value > 0) {
          this.dataVariant[i]['base_price'] = this.base_price_var.value
        }
        if (this.stock_var.value > 0) {
          if (this.dataVariant[i]['disabled'] == false) {
            this.dataVariant[i]['stock_begining'] = this.stock_var.value
          }
        }
        if (_.isEmpty(this.sku_var.value) == false) {
          this.dataVariant[i]['sku'] = this.sku_var.value
        }
        let no = this.dataVariant.length - 1
        if (no == i) {
          this.sell_price_var.setValue(null)
          this.base_price_var.setValue(null)
          this.stock_var.setValue(null)
          this.sku_var.setValue(null)
          return true
        }
      }
    }
  }
  /*IMAGE VARIATION */
  previewImageVariant(files, id) {
    if (files.length === 0)
      return;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      let uploadImage: any = new FormData()
      uploadImage.append("file", files[0])
      uploadImage.append("path", "image-variation")
      this.apiBackend.MasterProduct(uploadImage, 'upload').subscribe((data: {}) => {
        this.response_backend = data
        if (this.response_backend.status == 200) {
          this.dataVariant[id]['image_url'] = this.response_backend['data']['file']
        } else {
          this.alert.showError('Gagal upload gambar variant')
        }
      },
        (err) => {
          this.alert.showError(err)
        });

    }
  }
  removeImageVariation(id) {
    this.dataVariant[id]['image_url'] = null
  }
  /*VALIDATION VARIANT DOUBLE */
  validVariant1(e) {
    let lower = []
    this.dummyVariantOne.value.forEach(element => {
      lower.push(element.toLowerCase())
    });
    let prev = lower.length
    let curr = _.uniq(lower)
    if (prev == curr.length) {
      this.setVariant()
    } else {
      this.dummyVariantOne.removeAt(prev - 1)
      this.createVariantOne()
      this.alert.showError('Duplicate varian 1 ' + e.target.value)
    }
  }
  validVariant2(e) {
    let lower = []
    this.dummyVariantTwo.value.forEach(element => {
      lower.push(element.toLowerCase())
    });
    let prev = lower.length
    let curr = _.uniq(lower)
    if (prev == curr.length) {
      this.setVariant()
    } else {
      this.dummyVariantTwo.removeAt(prev - 1)
      this.createVariantTwo()
      this.alert.showError('Duplicate varian 2 ' + e.target.value)
    }
  }
  /*IF VARIATION SELL PRICE SAME */
  sameSellPriceVariant() {
    if (this.dataVariant.length > 1) {
      let dummy=[]
      this.dataVariant.forEach(element => {
        dummy.push(element.sell_price)
      });
      let uniq = _.uniq(dummy)
      if (uniq.length == 1) {
        this.sellPriceById.setValue(uniq[0])
        this.btnPriceRetail = true
      } else {
        if (this.activeRoute.snapshot.paramMap.get("id") != null) {
          let no = []
          for (let index = 0; index < this.dataPriceRetail.length; index++) {
            this.removePriceRetail(index, this.dataPriceRetail[index].id,2)
            no.push(index)
          }
          this.dataPriceRetail.splice(no, no.length)
        } else {
          this.dataPriceRetail = []
        }
        this.tablePriceRetail = false
        this.btnPriceRetail = false
      }
      
    }
  }

  /*RETAIL */
  dataPriceRetail: any = []
  btnPriceRetail = true
  tablePriceRetail = false
  createPriceRetail() {
    if (this.dataPriceRetail.length <= 20) {
      this.tablePriceRetail = true
      if (this.dataPriceRetail.length == 0) {
        this.dataPriceRetail.push({ id: 0, qty_min: null, qty_max: null, price: null, is_active_prc: true, disabled: 'false' })
      }
      let lengthSpesific = this.dataPriceRetail.length - 1
      if (this.dataPriceRetail[lengthSpesific]['qty_min'] != null && this.dataPriceRetail[lengthSpesific]['qty_max'] != null
        && this.dataPriceRetail[lengthSpesific]['price'] != null) {
        let totalMin = this.dataPriceRetail[lengthSpesific]['qty_max'] + 1
        this.dataPriceRetail.push({ id: 0, qty_min: totalMin, qty_max: null, price: null, is_active_prc: true, disabled: 'true' })
      } 
    } else {
      this.alert.showError('Maksimal Harga Grosir 20')
    }
  }
  removePriceRetail(id, idRetail, type) {
    if (type == 1) {
      this.dataPriceRetail.splice(id, 1)
    }
    if (this.dataPriceRetail.length > 0) {
      this.dataPriceRetail[0]['disabled'] = false
      for (let index = 1; index < this.dataPriceRetail.length; index++) {
        this.dataPriceRetail[index]['qty_min'] = this.dataPriceRetail[index - 1]['qty_max'] + 1
      }
    }
    if (idRetail > 0) {
      let url = "product/delete/price-retail/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + idRetail
      this.apiBackend.Show(url).subscribe((data: {}) => {
        this.response_backend = data
        return this.dataPriceRetail
      },
        (err) => {
        });
    }
    if (this.dataPriceRetail.length == 0) {
      this.tablePriceRetail = false
    }
  }
  sellPriceRetail() {
    this.dataPriceRetail.forEach(element => {
      if (element.price > this.priceProduct.get('sell_price').value) {
        element.price = null
      }
    });
  }

  maxPriceRetail(id) {

    if (this.dataPriceRetail[id].qty_max < this.dataPriceRetail[id].qty_min) {
      if (this.dataPriceRetail[id].qty_max > 0) {
        this.alert.showError('Max harga grosir tidak boleh lebih kecil dari Min harga grosir')
      }
      this.dataPriceRetail[id].qty_max = null
    }
  }
  totalPriceRetail(id) {
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      if (this.sellPriceById.value < this.dataPriceRetail[id].price) {
        this.dataPriceRetail[id].price = null
        this.alert.showError('Harga grosir tidak boleh melebihi harga variant')
      }
    } else {
      if (this.priceProduct.get('sell_price').value < this.dataPriceRetail[id].price) {
        this.dataPriceRetail[id].price = null
        this.alert.showError('Harga grosir tidak boleh melebihi harga satuan')
      }
    }
    
  }
  /*END RETAIL */
  /*WEIGHT */
  totalWeight() {
    if (this.weightProduct.get('weight_id').value != null && this.weightProduct.get('weight_id').value != 1) {
      let con = this.weightProduct.get('weight').value * 1000
      this.weightProduct.get('total_weight').setValue(con)
    } else {
      this.weightProduct.get('total_weight').setValue(this.weightProduct.get('weight').value)
    }
  }
  /*END */

  /*=======CRUD=========== */
  submitProduct() {
    this.informProduct.markAllAsTouched()
    this.descProduct.markAllAsTouched()
    this.priceProduct.markAllAsTouched()
    this.productStatusRetail.markAllAsTouched()
    this.weightProduct.markAllAsTouched()
    if (this.informProduct.invalid || this.descProduct.invalid || this.priceProduct.invalid || this.productStatusRetail.invalid || this.weightProduct.invalid) {
      return;
    }

    /*VALIDATION IMAGE MAIN */
    let img = false
    for (let index = 0; index < this.imageMainArray.length; index++) {
      if (this.imageMainArray[index]['image_url'] != null) {
        img = true
      }
    }
    if (img == false) {
      this.alert.showError('Minimal 1 gambar')
      return;
    }
    /*VALIDATION SPECIFICATION */
    let spec = false
    if (this.arraySpec.length > 0) {
      for (let index = 0; index < this.arraySpec.length; index++) {
        if (this.arraySpec[index]['name'] != null && this.arraySpec[index]['description'] != null) {
          spec = true
        }
      }
    }
    if (spec == false) {
      this.alert.showError('Minimal 1 spesifikasi')
      return;
    }
    /*VALIDATION VARIANT */
    /*VARIANT 1 REQUIRED */
    if (this.dataVariant.length > 0) {
      let findStatus = _.findKey(this.dataVariant, ['is_active', true])
      if (_.isUndefined(findStatus)) {
        this.alert.showError('Minimal 1 variant aktif')
        return
      }
      
      if (this.dummyVariantOne.length == 0) {
        this.alert.showError('Variant 1 harus diisi')
        return;
      }
      for (let index = 0; index < this.dataVariant.length; index++) {
        if (_.isNull(this.dataVariant[index].sell_price) || _.isNull(this.dataVariant[index].base_price) || 
            _.isNull(this.dataVariant[index].stock_begining) || _.isNull(this.dataVariant[index].sku)) {
          this.alert.showError('Lengkapi form variant')
          return;
        }
      }
    }
    /*CONVERT STATUS */
    if (this.productStatusRetail.get('is_active').value == true) {
      this.productStatusRetail.get('is_active').setValue(1)
    }
    if (this.productStatusRetail.get('is_active').value == false) {
      this.productStatusRetail.get('is_active').setValue(0)
    }
    /*SET VALUE TO API */
    let dimensions = {}
    dimensions['long'] = this.weightProduct.get('long').value
    dimensions['wide'] = this.weightProduct.get('wide').value
    dimensions['height'] = this.weightProduct.get('height').value
    /*PRICE RETAIL */
    let dummyPriceRetail = []
    this.dataPriceRetail.forEach(element => {
      let data: any = {}
      data['id'] = element.id
      data['qty_min'] = element.qty_min
      data['qty_max'] = element.qty_max
      data['price'] = element.price
      dummyPriceRetail.push(data)
    });
    /*VARIATION */
    let dummyVariation = []
    this.dataVariant.forEach(element => {
      let data = {}
      data['id'] = element.id
      data['sku'] = element.sku
      data['sell_price'] = element.sell_price
      data['base_price'] = element.base_price
      data['value1'] = element.value1
      data['value2'] = element.value2
      data['image_url'] = element.image_url
      data['stock_begining'] = element.stock_begining
      data['is_active'] = element.is_active
      dummyVariation.push(data)
    });

    if (this.dataVariation.length == 0) {
      let data = {}
      data['id'] = 0
      data['variation'] = this.variation1.value
      let data2 = {}
      data2['id'] = 0
      data2['variation'] = this.variation2.value
      this.dataVariation.push(data)
      this.dataVariation.push(data2)
    }

    this.formSubmitProduct.patchValue({
      product_name: this.informProduct.get('product_name').value,
      product_category_id: this.informProduct.get('product_category_id').value,
      images: this.imageMainArray,
      description: this.descProduct.get('description').value,
      master_brand_id: this.descProduct.get('master_brand_id').value,
      specification: this.arraySpec,
      weight: this.weightProduct.get('total_weight').value,
      dimensions: dimensions,
      sell_price: this.priceProduct.get('sell_price').value,
      price_retail: dummyPriceRetail,
      variation: dummyVariation,
      variant_cat: this.dataVariation,
      minimum_order: this.priceProduct.get('minimum_order').value,
      minimum_stock: this.weightProduct.get('minimum_stock').value,
      stock_begining: this.productStatusRetail.get('stock_product').value,
      sku: this.productStatusRetail.get('sku').value,
      is_active: this.productStatusRetail.get('is_active').value,
    })
    if (this.activeRoute.snapshot.paramMap.get("id") == null) {
      this.formSubmitProduct.addControl('tenant_id', new FormControl(this.apiBackend.serviceAuth()['tenant_id']))
      this.formSubmitProduct.addControl('user_id', new FormControl(this.apiBackend.serviceAuth()['user_id']))
      this.submitCreate()
    } else {
      this.submitUpdate()
    }
  }

  showById(id) {
    let url = "master-data-product/" + this.apiBackend.serviceAuth()['tenant_id']+'/'+id
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.response_backend = data
      let dataShow = this.response_backend.data[0]
      this.is_adjusted = dataShow.is_adjusted
      /*SETVALUE INFORM */
      this.informProduct.patchValue({
        product_name: dataShow.product_name
      })
      for (let index = 0; index < this.dataCategoryProduct.data.length; index++) {
        for (let index2 = 0; index2 < this.dataCategoryProduct.data[index]['children'].length; index2++) {
          for (let index3 = 0; index3 < this.dataCategoryProduct.data[index]['children'][index2]['children'].length; index3++) {
            if (this.dataCategoryProduct.data[index]['children'][index2]['children'][index3]['id'] == dataShow.product_category_id) {
              this.dataSubCategory1['data'] = this.dataCategoryProduct.data[index]['children']
              this.dataSubCategory2['data'] = this.dataCategoryProduct.data[index]['children'][index2]['children']
              this.informProduct.patchValue({
                parent_old: this.dataCategoryProduct.data[index]['id'],
                parent_new: this.dataCategoryProduct.data[index]['children'][index2]['id'],
                product_category_id:this.dataCategoryProduct.data[index]['children'][index2]['children'][index3]['id']
              })
              this.selectCategory = 3
            }
          }
        }
      }
      /*SETVALUE IMAGE MAIN */
      for (let index = 0; index < dataShow.image.length; index++) {
        if (dataShow.image[index].is_active == 1 && dataShow.image[index].master_product_variant_id == 0) {
          this.imageMainArray[index]['id'] = dataShow.image[index].id
          this.imageMainArray[index]['image_url'] = dataShow.image[index].image_url
        }
      }
      /*SETVALUE DESCRIPTION */
      this.descProduct.patchValue({
        description: dataShow.description,
        master_brand_id: dataShow.master_brand_id,
      })
      let sp_json = JSON.parse(dataShow.specification)
      if (sp_json.length > 0) {
        this.tableSpecification = true
        for (let indexSpec = 0; indexSpec < sp_json.length; indexSpec++) {
          this.arraySpec.push({ name: sp_json[indexSpec]['name'], description: sp_json[indexSpec]['description'] })
        }
      }
      /*IF VARIANT */
      if (dataShow.variant.length > 0) {
        this.onVariant()
        let dummyVar1=[]
        let dummyVar2=[]
        dataShow.variant.forEach(element => {
          let data={}
          data['id'] = element.id
          data['value1'] = element.value1
          data['value2'] = element.value2
          data['sell_price'] = element.sell_price
          data['base_price'] = element.base_price
          data['image_url'] = element.image.image_url
          data['stock_begining'] = element.stock.stock_begining
          data['sku'] = element.sku
          if (element.is_active == 1) {
            data['is_active'] = true
          } else {
            data['is_active'] = false
          }
          data['disabled'] = true
          this.dataVariant.push(data)
          if (element.value1 != null) {
            dummyVar1.push(element.value1)
          }
          if (element.value2 != null) {
            dummyVar2.push(element.value2)
          }
        });

        for (let index = 0; index < dummyVar1.length; index++) {
          this.dummyVariantOne.push(new FormControl(dummyVar1[index]))
        }
        for (let index = 0; index < dummyVar2.length; index++) {
          this.dummyVariantTwo.push(new FormControl(dummyVar2[index]))
        }
        this.sameSellPriceVariant()
      } else {
        this.priceProduct.get('sell_price').setValue(dataShow.sell_price)
        this.productStatusRetail.get('stock_product').setValue(dataShow.stock[0].stock_begining)
        this.productStatusRetail.patchValue({
          sku: dataShow.sku
        })
      }
      let lastIdRetail = dataShow.price.length-1
      this.priceProduct.get('minimum_order').setValue(dataShow.minimum_order)
      if (dataShow.price.length > 0) {
        this.tablePriceRetail = true
        dataShow.price.forEach(element => {
          this.dataPriceRetail.push(
            {
              id: element['id'], qty_min: element['qty_min'], qty_max: element['qty_max'], price: element['price'],
              is_active_prc: true, disabled: 'true'
            })
        });
        this.dataPriceRetail[lastIdRetail].disabled = false
      }
      this.productStatusRetail.get('stock_product').disable()
      this.productStatusRetail.patchValue({
        is_active: dataShow.is_active,
      })
      let dim = JSON.parse(dataShow.dimensions)
      this.weightProduct.patchValue({
        weight_id: 1,
        weight: dataShow.weight,
        total_weight: dataShow.weight,
        minimum_stock: dataShow.minimum_stock,
        long: dim.long,
        wide: dim.wide,
        height: dim.height,
      })

    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*CREATE */
  submitCreate() {
    this.apiBackend.UpdateEtc(this.formSubmitProduct.value, 'store-product').subscribe((data: {}) => {
      this.response_backend = data
      if (this.response_backend.status == 200) {
        this.alert.showSuccess('Berhasil tambah produk')
        this.router.navigate(['/dashboard-inventory/product-data'])
      } else {
        this.alert.showError('Gagal tambah produk')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*UPDATE */
  submitUpdate() {
    let url = "update-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.activeRoute.snapshot.paramMap.get("id")
    this.apiBackend.UpdateEtc(this.formSubmitProduct.value, url).subscribe((data: {}) => {
      this.response_backend = data
      if (this.response_backend.status == 200) {
        this.alert.showSuccess('Berhasil edit produk')
        this.router.navigate(['/dashboard-inventory/product-data'])
      } else {
        this.alert.showError('Gagal edit produk')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
}
