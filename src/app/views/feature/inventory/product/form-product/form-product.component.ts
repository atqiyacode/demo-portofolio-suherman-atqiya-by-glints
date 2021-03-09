import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { InventoryService } from "../../../../library/service/inventory.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import * as _ from 'lodash';
import { SweetAlertService } from "../../../../library/service/sweetalert.service";

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit, AfterContentChecked {

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
  @ViewChild('content') public templateref: TemplateRef<any>
  @ViewChild('modalSpesification') public spesification: TemplateRef<any>
  @ViewChild('modalWholescale') public modalWholescale: TemplateRef<any>;
  errorMessage = ""
  alertError = false
  formData: any = new FormData()
  delivery_minimum = new FormControl()
  is_active_product = new FormControl(true)
  formDisable = this.fb.group({
    unit_price: [null],
  })
  formDisableProductManagement = this.fb.group({
    stock_product: [null],
    sku: [null],
  })
  formMasterProduct = this.fb.group({
    id: [''],
    product_name: [null],
    product_category_id: [null],
    description: [null],
  })

  response_backend: any = {}
  attributeProduct = this.attribute.configInventoryProduct()
  message = ""

  base_unit = [
    { id: 1, name: 'gram' },
    { id: 2, name: 'kg' }
  ];
  /*LOAD PAGE AND API SAVE,UPDATE*/
  urlCreate = "store-product"
  urlShowById = "master-data-product/" + this.apiBackend.serviceAuth()['tenant_id']
  urlUpdate = "update-product/"
  urlApiMaster = ""
  dataApi: any = {}
  dataImageMain = []
  btnShow = false
  ngOnInit() {
    this.categoryList()
    this.brandList()

    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      this.btnShow = true
    }
    for (let index = 0; index < 4; index++) {
      this.dataImageMain.push({ id: 0, image_url: null })
    }
  }
  btnWholesale = true
  name_variant1 = ""
  name_variant2 = ""
  ngAfterContentChecked() {

    if (this.variation.value != null) {
      this.name_variant1 = this.variation.value
    }
    if (this.variation2.value != null) {
      this.name_variant2 = this.variation2.value
    }
    this.activeWholesale()
    if (this.dataVariant.length > 0) {
      this.cardVariant = true
    }
    // if (this.dummyDataWholesale.length > 0) {
    //   this.tableWholesale = true
    // }
  }

  /*MODAL, Function Names Cannot Be Changed  */
  closeResult = ''
  openModal() {
    this.modalService.open(this.templateref,
      { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  openModalSpec() {
    this.addSpesification()
    this.modalService.open(this.spesification,
      { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  openModalWholesale() {
    this.addWholesale()
    this.modalService.open(this.modalWholescale,
      { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /*END MODAL */
  /*=====SPESIFICATION=====*/
  dummyDataSpesification = []
  tableSpesification = false
  addSpesification() {
    this.tableSpesification = true
    if (this.dummyDataSpesification.length == 0) {
      this.dummyDataSpesification.push({ name: null, description: null })
    }
    let lengthSpesific = this.dummyDataSpesification.length - 1
    if (this.dummyDataSpesification[lengthSpesific]['name'] != null) {
      this.dummyDataSpesification.push({ name: null, description: null })
    }
  }
  removeSpesification(id) {
    this.dummyDataSpesification.splice(id, 1)
    if (this.dummyDataSpesification.length == 0) {
      this.tableSpesification = false
    }
  }

  /*=====VARIANT=====*/
  cardVariant = false
  dataVariant: any = []
  dummyDataVariantOne = new FormArray([]);
  dummyDataVariantTwo = new FormArray([]);
  onVariant() {
    this.formDisable.disable()
    this.formDisableProductManagement.disable()
    this.formDisableProductManagement.reset()
    this.formDisable.reset()
    this.dummyDataWholesale = []
    this.tableWholesale = false
    this.btnWholesale = false
  }
  disableVariant() {
    this.btnWholesale = true
    this.dummyDataVariantOne.clear()
    this.dummyDataVariantTwo.clear()
    this.formDisable.enable()
    this.formDisableProductManagement.enable()
    let remove = []
    for (let index = 0; index < this.dataVariant.length; index++) {
      remove.push(this.dataVariant[index]['id'])
    }
    this.dataVariant = []
    for (let rm = 0; rm < remove.length; rm++) {
      this.deleteVariationToApi(remove[rm])
    }
  }
  dataVariantTable() {
    let data = {}
    data['id'] = 0
    data['sku'] = null
    data['sell_price'] = null
    data['base_price'] = null
    data['value1'] = null
    data['value2'] = null
    data['image_url'] = null
    data['stock_begining'] = null
    data['is_active'] = 1
    data['disabled'] = false
    return data
  }
  addVariantOne() {
    /*Validation Variant < 20 */
    if (this.dataVariant.length < 20) {
      if (this.dummyDataVariantOne.value.length == 0) {
        this.dummyDataVariantOne.push(new FormControl(''))
      }
      let no = this.dummyDataVariantOne.value.length - 1
      let var1: any = true
      for (let index = 0; index <= no; index++) {
        if (_.isEmpty(this.dummyDataVariantOne.value[index])) {
          var1 = false
        }
      }
      if (var1 == true) {
        this.dummyDataVariantOne.push(new FormControl(''))
      }

    }
  }
  addVariantTwo() {
    /*Validation Variant < 20 */
    if (this.dataVariant.length < 20) {
      if (this.dummyDataVariantTwo.value.length == 0) {
        this.dummyDataVariantTwo.push(new FormControl(''))
      }
      let no = this.dummyDataVariantTwo.value.length - 1
      let var1: any = true
      for (let index = 0; index <= no; index++) {
        if (_.isEmpty(this.dummyDataVariantTwo.value[index])) {
          var1 = false
        }
      }
      if (var1 == true) {
        this.dummyDataVariantTwo.push(new FormControl(''))
      }

    }

  }

  deleteVariantOne(id) {
    let delVar = this.dummyDataVariantOne.value[id]
    this.dummyDataVariantOne.removeAt(id)
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
    let delVar = this.dummyDataVariantTwo.value[id]
    this.dummyDataVariantTwo.removeAt(id)
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
    if (this.dummyDataVariantTwo.value.length != 0) {
      noVar2 = this.dummyDataVariantTwo.value.length
    }
    if (this.dummyDataVariantOne.value.length != 0) {
      noVar1 = this.dummyDataVariantOne.value.length
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
      if (_.isEmpty(this.dataVariant[0]['value1']) && _.isEmpty(this.dataVariant[0]['value1'])) {
        this.dataVariant.splice(1, 1)
        this.disableVariant()
      }
    }
    if (this.dataVariant.length == 0) {
      this.disableVariant()
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
  /*=====SET VARIANT TO TABLE=====*/
  sell_price_var = new FormControl(null)
  base_price_var = new FormControl(null)
  stock_var = new FormControl(null)
  sku_var = new FormControl(null)
  image_var = new FormControl(null)
  setInformVarAll() {
    if (this.dataVariant.length > 0) {
      for (let i = 0; i < this.dataVariant.length; i++) {
        if (_.isInteger(this.sell_price_var.value)) {
          if (this.sell_price_var.value != 0) {
            this.dataVariant[i]['sell_price'] = this.sell_price_var.value
          }
        }
        if (_.isInteger(this.base_price_var.value)) {
          if (this.base_price_var.value != 0) {
            this.dataVariant[i]['base_price'] = this.base_price_var.value
          }
        }
        if (_.isInteger(this.stock_var.value)) {
          if (this.stock_var.value != 0) {
            if (this.dataVariant[i]['disabled'] == false) {
              this.dataVariant[i]['stock_begining'] = this.stock_var.value
            }
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
  setVariant() {
    let varOne = this.dummyDataVariantOne.value
    let varTwo = this.dummyDataVariantTwo.value
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
  previewImageVariant(files, id) {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      let uploadImage: any = new FormData()
      uploadImage.append("file", files[0])
      uploadImage.append("path", "image-variation")
      this.urlApiMaster = "upload"
      this.apiBackend.MasterProduct(uploadImage, this.urlApiMaster).subscribe((data: {}) => {
        this.response_backend = data
        if (this.response_backend.status == 200) {
          this.dataVariant[id]['image_url'] = this.response_backend['data']['file']
        } else {
          this.alert.showError('Gagal upload image variant')
        }
      },
        (err) => {
          this.alert.showError(err)
        });

    }
  }
  removeVariant(id) {
    this.dataVariant.splice(id, 1)
  }
  removeVarAll() {
    this.dataVariant = []
  }
  removeImageVariation(id) {
    this.formData.delete('image_var[' + id + ']')
    this.dataVariant[id]['image_url'] = null
  }

  /*NEW IMAGE PRODUCT */
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
          this.dataImageMain[id]['image_url'] = this.response_backend['data']['file']
        } else {
          this.alert.showError('Gagal upload image main')
        }
      },
        (err) => {
          this.alert.showError(err)
        });
      this.divValidation = 0
    }

  }
  removeImageProductNew(id, i) {
    this.dataImageMain[i]['image_url'] = null
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

  /*=====Wholesale=====*/
  dummyDataWholesale: any = []
  tableWholesale = false
  addWholesale() {
    this.tableWholesale = true
    if (this.dummyDataWholesale.length == 0) {
      this.dummyDataWholesale.push({ id: 0, qty_min: null, qty_max: null, price: null, is_active_prc: true, disabled: 'false' })
    }
    let lengthSpesific = this.dummyDataWholesale.length - 1
    if (this.dummyDataWholesale[lengthSpesific]['qty_min'] != null && this.dummyDataWholesale[lengthSpesific]['qty_max'] != null) {
      let totalMin = this.dummyDataWholesale[lengthSpesific]['qty_max'] + 1
      this.dummyDataWholesale.push({ id: 0, qty_min: totalMin, qty_max: null, price: null, is_active_prc: true, disabled: 'true' })
    }
  }
  removeWholesale(id, idWs) {
    this.dummyDataWholesale.splice(id, 1)
    if (this.dummyDataWholesale.length == 0) {
      this.tableWholesale = false
    }
    if (this.dummyDataWholesale.length > 0) {
      this.dummyDataWholesale[0]['disabled'] = false
      for (let index = 1; index < this.dummyDataWholesale.length; index++) {
        this.dummyDataWholesale[index]['qty_min'] = this.dummyDataWholesale[index - 1]['qty_max'] + 1
      }
    }
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      let url = "product/delete/price-retail/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + idWs
      this.apiBackend.Show(url).subscribe((data: {}) => {
        this.response_backend = data
        return this.dummyDataWholesale
      },
        (err) => {
          this.alert.showError(err)
        });
    }
  }
  /*ACTIVE WHOLESALE*/
  activeWholesale() {
    let same = 1
    for (let index = 0; index < this.dataVariant.length; index++) {
      if (this.dataVariant[index]['sell_price'] == this.dataVariant[0]['sell_price']) {
        same = 0
      } else {
        same = 1
        this.dummyDataWholesale = []
        this.btnWholesale = false
        return false
      }
    }
    if (same == 0) {
      this.btnWholesale = true
      this.tableWholesale = false
    }
  }
  priceWholesale(id) {
    if (this.dummyDataWholesale[id]['price'] > this.formDisable.get('unit_price').value) {
      alert('harga grosir melebihi harga satuan')
      this.dummyDataWholesale[id]['price'] = this.formDisable.get('unit_price').value
    }
  }
  /*=====ETC=====*/
  weight_select = new FormControl()
  weight_product = new FormControl()
  weight_total = new FormControl()
  long_product = new FormControl()
  wide_product = new FormControl()
  height_product = new FormControl()
  minimum_stock = new FormControl()
  tax_sell_id = new FormControl()
  tax_buy_id = new FormControl()

  totalWeight() {
    if (this.weight_select.value != null && this.weight_select.value != 1) {
      let con = this.weight_product.value * 1000
      this.weight_total.setValue(con)
    } else {
      this.weight_total.setValue(this.weight_product.value)
    }
  }

  /*BRAND */
  brandProduct = new FormControl(null, Validators.required)
  dataBrand: any = {}
  brandList() {
    this.apiBackend.Get('brand').subscribe((data: {}) => {
      this.dataBrand = data
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*CATEGORY LIST */
  selectCategory = 1
  dataCategoryProduct: any = {}
  dataSubCategory1: any = {}
  dataSubCategory2: any = {}
  categoryList() {
    this.apiBackend.Get('master-data-product-category').subscribe((data: {}) => {
      this.dataCategoryProduct = data
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  changeSub1(e) {
    this.dataSubCategory2 = {}
    this.dataSubCategory1 = {}
    this.parentNew.setValue(null)
    this.productCategoryId.setValue(null)
    for (let index = 0; index < this.dataCategoryProduct.data.length; index++) {
      if (this.dataCategoryProduct.data[index]['id'] == e) {
        this.dataSubCategory1 = this.dataCategoryProduct.data[index]['children']
        this.selectCategory = 2
        return false
      }
    }

  }
  changeSub2(e) {
    this.dataSubCategory2 = {}
    this.productCategoryId.setValue(null)
    for (let index = 0; index < this.dataCategoryProduct.data.length; index++) {
      for (let index2 = 0; index2 < this.dataCategoryProduct.data[index]['children'].length; index2++) {
        if (this.dataCategoryProduct.data[index]['children'][index2]['id'] == e) {
          this.dataSubCategory2 = this.dataCategoryProduct.data[index]['children'][index2]['children']
          this.selectCategory = 3
          return false
        }
      }

    }

  }

  /*VALIDATOR */
  @ViewChild('divInformProduct') public divInformProduct: ElementRef
  @ViewChild('divImageProduct') public divImageProduct: ElementRef
  @ViewChild('divDescProduct') public divDescProduct: ElementRef
  @ViewChild('divPriceProduct') public divPriceProduct: ElementRef
  @ViewChild('divManagementProduct') public divManagementProduct: ElementRef
  @ViewChild('divEtcProduct') public divEtcProduct: ElementRef
  divValidation = 0
  validForm() {
    if (this.nameProduct.valid == false) {
      this.divInformProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 1
      return this.divValidation
    }
    if (this.parentOld.valid == false) {
      this.divInformProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 2
      return this.divValidation
    }
    if (this.parentNew.valid == false) {
      this.divInformProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 3
      return this.divValidation
    }
    if (this.productCategoryId.valid == false) {
      this.divInformProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 4
      return this.divValidation
    }
    let validImage = 0
    for (let imagePro = 0; imagePro < this.dataImageMain.length; imagePro++) {
      if (this.dataImageMain[imagePro]['image_url'] == null) {
        validImage = 1
      } else {
        validImage = 0
        return true
      }

    }
    if (validImage == 1) {
      this.divImageProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 5
      return this.divValidation
    }
    if (this.descriptionProduct.value == null || this.descriptionProduct.value == "") {
      this.divDescProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 6
      return this.divValidation
    }
    if (this.brandProduct.value == null) {
      this.divDescProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 7
      return this.divValidation
    }
    if (this.dummyDataSpesification.length == 0) {
      this.divDescProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
      this.divValidation = 8
      return this.divValidation
    }
    /*JIKA VARIANT TIDAK AKTIF */
    if (this.dataVariant.length == 0) {
      if (_.isEmpty(this.delivery_minimum.value)) {
        this.divPriceProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
        this.divValidation = 10
        return this.divValidation
      }
      if (_.isEmpty(this.formDisable.get('unit_price').value)) {
        this.divPriceProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
        this.divValidation = 11
        return this.divValidation
      }
      if (this.dummyDataWholesale.length == 0) {
        this.divPriceProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
        this.divValidation = 12
        return this.divValidation
      }
      if (_.isEmpty(this.formDisableProductManagement.get('stock_product').value)) {
        this.divManagementProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
        this.divValidation = 13
        return this.divValidation
      }
      if (_.isEmpty(this.formDisableProductManagement.get('sku').value)) {
        this.divManagementProduct.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
        this.divValidation = 14
        return this.divValidation
      }
    }
    /*WITH VARIANT */
    if (this.dataVariant.length > 0) {
      if (_.isEmpty(this.dataVariant[0]['value1'])) {
        alert('Variasi 1 harus di isi')
        this.divValidation = 20
        return this.divValidation
      }
      let is_act = 0
      for (let index = 0; index < this.dataVariant.length; index++) {
        if (this.dataVariant[0]['is_active'] == false || this.dataVariant[0]['is_active'] == 0) {
          is_act = 1
        } else {
          is_act = 0
          return true
        }
      }
      if (is_act == 1) {
        alert('Status variant minimal satu aktif')
        this.divValidation = 20
        return this.divValidation
      }
    }
  }

  stopValid() {
    this.divValidation = 0
  }
  /*=====SAVE PRODUCT=====*/
  nameProduct = new FormControl('', Validators.required)
  parentOld = new FormControl(null, Validators.required)
  parentNew = new FormControl(null, Validators.required)
  productCategoryId = new FormControl(null, Validators.required)
  descriptionProduct = new FormControl('', Validators.required)
  variation = new FormControl('')
  variation2 = new FormControl('')
  dataVariationCat: any = []

  formCreateProduct = this.fb.group({
    tenant_id: [null],
    user_id: [null],
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
  formProduct = this.fb.group({
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
  mappingForm() {
    this.validForm()

    let dimensions = { 'long': this.long_product.value, 'wide': this.wide_product.value, 'height': this.height_product.value }
    let mapImage = []
    for (let index = 0; index < this.dataImageMain.length; index++) {
      if (this.dataImageMain[index]['image_url'] != null) {
        mapImage.push(this.dataImageMain[index])
      }
    }
    let validationWholesale = 0
    if (this.dummyDataWholesale.length != 0) {
      for (let index = 0; index < this.dummyDataWholesale.length; index++) {
        if (this.dummyDataWholesale[index]['price'] > this.formDisable.get('unit_price').value) {
          validationWholesale = 1
        } else {
          delete this.dummyDataWholesale[index]['disabled']
          delete this.dummyDataWholesale[index]['is_active_prc']
        }
      }
    }

    if (this.dataVariant.length != 0) {
      for (let index = 0; index < this.dataVariant.length; index++) {
        delete this.dataVariant[index]['disabled']
      }
    }

    if (this.is_active_product.value == true) {
      this.is_active_product.setValue(1)
    }
    if (this.is_active_product.value == false) {
      this.is_active_product.setValue(0)
    }

    this.formCreateProduct.get('product_name').setValue(this.nameProduct.value)
    this.formCreateProduct.get('product_category_id').setValue(this.productCategoryId.value)
    this.formCreateProduct.get('images').setValue(mapImage)
    this.formCreateProduct.get('description').setValue(this.descriptionProduct.value)
    this.formCreateProduct.get('master_brand_id').setValue(this.brandProduct.value)
    this.formCreateProduct.get('specification').setValue(this.dummyDataSpesification)
    this.formCreateProduct.get('weight').setValue(this.weight_total.value)
    this.formCreateProduct.get('dimensions').setValue(dimensions)
    this.formCreateProduct.get('sell_price').setValue(this.formDisable.get('unit_price').value)
    this.formCreateProduct.get('base_price').setValue(this.formDisable.get('unit_price').value)
    this.formCreateProduct.get('price_retail').setValue(this.dummyDataWholesale)
    this.formCreateProduct.get('variation').setValue(this.dataVariant)
    this.formCreateProduct.get('variant_cat').setValue(this.dataVariationCat)
    this.formCreateProduct.get('minimum_order').setValue(this.delivery_minimum.value)
    this.formCreateProduct.get('minimum_stock').setValue(this.minimum_stock.value)
    this.formCreateProduct.get('stock_begining').setValue(this.formDisableProductManagement.get('stock_product').value)
    this.formCreateProduct.get('sku').setValue(this.formDisableProductManagement.get('sku').value)
    this.formCreateProduct.get('is_active').setValue(this.is_active_product.value)

    this.formProduct.get('product_name').setValue(this.nameProduct.value)
    this.formProduct.get('product_category_id').setValue(this.productCategoryId.value)
    this.formProduct.get('images').setValue(mapImage)
    this.formProduct.get('description').setValue(this.descriptionProduct.value)
    this.formProduct.get('master_brand_id').setValue(this.brandProduct.value)
    this.formProduct.get('specification').setValue(this.dummyDataSpesification)
    this.formProduct.get('weight').setValue(this.weight_total.value)
    this.formProduct.get('dimensions').setValue(dimensions)
    this.formProduct.get('sell_price').setValue(this.formDisable.get('unit_price').value)
    this.formProduct.get('base_price').setValue(this.formDisable.get('unit_price').value)
    this.formProduct.get('price_retail').setValue(this.dummyDataWholesale)
    this.formProduct.get('variation').setValue(this.dataVariant)
    this.formProduct.get('variant_cat').setValue(this.dataVariationCat)
    this.formProduct.get('minimum_order').setValue(this.delivery_minimum.value)
    this.formProduct.get('minimum_stock').setValue(this.minimum_stock.value)
    this.formProduct.get('stock_begining').setValue(this.formDisableProductManagement.get('stock_product').value)
    this.formProduct.get('sku').setValue(this.formDisableProductManagement.get('sku').value)
    this.formProduct.get('is_active').setValue(this.is_active_product.value)
    let url = ""
    let msgSc = ""
    let msgEr = ""
    if (validationWholesale != 0) {
      alert('Harga grosir melebihi harga satuan')
      return;
    }
    if (this.divValidation == 0) {
      if (this.activeRoute.snapshot.paramMap.get("id") == null) {
        this.formCreateProduct.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
        this.formCreateProduct.get('user_id').setValue(this.apiBackend.serviceAuth()['user_id'])
        url = "store-product"
        msgSc = "Berhasil tambah produk"
        msgEr = "Gagal tambah produk"
        this.dataVariationCat.push({ id: 0, variation: this.variation.value })
        this.dataVariationCat.push({ id: 0, variation: this.variation2.value })
        this.apiBackend.UpdateEtc(this.formCreateProduct.value, url).subscribe((data: {}) => {
          this.response_backend = data
          if (this.response_backend.status == 200) {
            this.alert.showSuccess(msgSc)
            this.router.navigate(['/dashboard-inventory/product-data'])
          } else {
            this.alert.showError(msgEr)
          }
        },
          (err) => {
            this.alert.showError(err)
          });
      } else {
        if (this.dataVariant != 0) {
          this.dataVariationCat[0]['variation'] = this.variation.value
          this.dataVariationCat[1]['variation'] = this.variation2.value
        }

        url = "update-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.activeRoute.snapshot.paramMap.get("id")
        msgSc = "Berhasil edit produk"
        msgEr = "Gagal edit produk"
        this.apiBackend.UpdateEtc(this.formProduct.value, url).subscribe((data: {}) => {
          this.response_backend = data
          if (this.response_backend.status == 200) {
            this.alert.showSuccess(msgSc)
            this.router.navigate(['/dashboard-inventory/product-data'])
          } else {
            this.alert.showError(msgEr)
          }
        },
          (err) => {
            this.alert.showError(err)
          });
      }

    }

  }
  /*=====SHOW BY ID AND UPDATE======*/
  showById(id) {
    this.apiBackend.Show(this.urlShowById + '/' + id).subscribe((data: {}) => {
      this.dataApi = data
      this.nameProduct.setValue(this.dataApi.data[0].product_name)
      this.descriptionProduct.setValue(this.dataApi.data[0].description)
      /*LOOPING KATEGORI */
      let categoryPro: any = []
      categoryPro = this.dataCategoryProduct.data
      setTimeout(() => {
        /*CATEGORY */
        for (let index = 0; index < this.dataCategoryProduct.data.length; index++) {
          for (let index2 = 0; index2 < this.dataCategoryProduct.data[index]['children'].length; index2++) {
            for (let index3 = 0; index3 < this.dataCategoryProduct.data[index]['children'][index2]['children'].length; index3++) {
              if (this.dataCategoryProduct.data[index]['children'][index2]['children'][index3]['id'] == this.dataApi.data[0].product_category_id) {
                this.dataSubCategory1 = this.dataCategoryProduct.data[index]['children']
                this.dataSubCategory2 = this.dataCategoryProduct.data[index]['children'][index2]['children']
                this.parentOld.setValue(this.dataCategoryProduct.data[index]['id'])
                this.parentNew.setValue(this.dataCategoryProduct.data[index]['children'][index2]['id'])
                this.productCategoryId.setValue(this.dataCategoryProduct.data[index]['children'][index2]['children'][index3]['id'])
                this.selectCategory = 3
              }
            }
          }
        }
      }, 1000)

      /*IMAGE MAIN AND SPESIFICATION */
      let image_product = this.dataApi.data[0].image
      let editdummyImage = []
      for (let main = 0; main < image_product.length; main++) {
        if (image_product[main]['master_product_variant_id'] == 0 && image_product[main]['image_url'] != null) {
          editdummyImage.push({ id: image_product[main]['id'], image: image_product[main]['image_url'] })
        }
      }
      for (let index = 0; index < editdummyImage.length; index++) {
        this.dataImageMain[index]['id'] = editdummyImage[index]['id']
        this.dataImageMain[index]['image_url'] = editdummyImage[index]['image']
      }
      let sp_json = JSON.parse(this.dataApi.data[0].specification)
      if (sp_json.length.length != 0) {
        this.tableSpesification = true
        for (let indexSpec = 0; indexSpec < sp_json.length; indexSpec++) {
          this.dummyDataSpesification.push({ name: sp_json[indexSpec]['name'], description: sp_json[indexSpec]['description'] })
        }
      }

      /*VARIANT */
      if (this.dataApi.data[0].variant_cat.length > 1) {
        this.name_variant1 = this.dataApi.data[0].variant_cat[0]['variation']
        this.name_variant2 = this.dataApi.data[0].variant_cat[1]['variation']
        this.variation.setValue(this.dataApi.data[0].variant_cat[0]['variation'])
        this.variation2.setValue(this.dataApi.data[0].variant_cat[1]['variation'])

        this.dataVariationCat.push({ id: this.dataApi.data[0].variant_cat[0]['id'], variation: this.dataApi.data[0].variant_cat[0]['variation'] })
        this.dataVariationCat.push({ id: this.dataApi.data[0].variant_cat[1]['id'], variation: this.dataApi.data[0].variant_cat[1]['variation'] })
      }

      let variant = this.dataApi.data[0].variant
      if (variant.length != 0) {
        this.onVariant()
        let dummyVar1 = []
        let dummyVar2 = []
        for (let indexVar = 0; indexVar < variant.length; indexVar++) {
          if (variant[indexVar]['image'] != null) {
            this.dataVariant.push(
              {
                id: variant[indexVar]['id'], sku: variant[indexVar]['sku'],
                sell_price: variant[indexVar]['sell_price'], base_price: variant[indexVar]['base_price'],
                value1: variant[indexVar]['value1'], value2: variant[indexVar]['value2'],
                image_url: variant[indexVar]['image']['image_url'],
                stock_begining: variant[indexVar]['stock']['stock_begining'],
                is_active: variant[indexVar]['is_active'], disabled: true
              }
            )
          } else {
            this.dataVariant.push(
              {
                id: variant[indexVar]['id'], sku: variant[indexVar]['sku'],
                sell_price: variant[indexVar]['sell_price'], base_price: variant[indexVar]['base_price'],
                value1: variant[indexVar]['value1'], value2: variant[indexVar]['value2'],
                image_url: null,
                stock_begining: variant[indexVar]['stock']['stock_begining'],
                is_active: variant[indexVar]['is_active'], disabled: true
              }
            )
          }
          if (variant[indexVar]['value1'] != null) {
            dummyVar1.push(variant[indexVar]['value1'])
          }
          if (variant[indexVar]['value2'] != null) {
            dummyVar2.push(variant[indexVar]['value2'])
          }

        }
        dummyVar1 = _.uniq(dummyVar1)
        dummyVar2 = _.uniq(dummyVar2)
        for (let index = 0; index < dummyVar1.length; index++) {
          this.dummyDataVariantOne.push(new FormControl(dummyVar1[index]))
        }
        for (let index = 0; index < dummyVar2.length; index++) {
          this.dummyDataVariantTwo.push(new FormControl(dummyVar2[index]))
        }

      }

      /*NOT VARIANT */
      this.formDisable.get('unit_price').setValue(this.dataApi.data[0].sell_price)
      this.delivery_minimum.setValue(this.dataApi.data[0].minimum_order)
      this.is_active_product.setValue(this.dataApi.data[0].is_active)
      this.formDisableProductManagement.get('sku').setValue(this.dataApi.data[0].sku)
      this.minimum_stock.setValue(this.dataApi.data[0].minimum_stock)
      if (variant.length == 0) {
        this.formDisableProductManagement.get('stock_product').setValue(this.dataApi.data[0].stock[0]['stock_begining'])
      }
      let wholesale = this.dataApi.data[0].price
      let lastWs = wholesale.length - 1
      if (wholesale.length > 0) {
        console.log('masuk');
        
        for (let ws = 0; ws < wholesale.length; ws++) {
          if (ws != lastWs) {
            this.dummyDataWholesale.push(
              {
                id: wholesale[ws]['id'], qty_min: wholesale[ws]['qty_min'], qty_max: wholesale[ws]['qty_max'], price: wholesale[ws]['price'],
                is_active_prc: true, disabled: 'true'
              })
          } else {
            this.dummyDataWholesale.push(
              {
                id: wholesale[ws]['id'], qty_min: wholesale[ws]['qty_min'], qty_max: wholesale[ws]['qty_max'], price: wholesale[ws]['price'],
                is_active_prc: true, disabled: 'false'
              })
          }

        }
        this.tableWholesale = true
      }
      /*END */

      let dim = JSON.parse(this.dataApi.data[0].dimensions)
      this.long_product.setValue(dim['long'])
      this.wide_product.setValue(dim['wide'])
      this.height_product.setValue(dim['height'])
      this.tax_buy_id.setValue(this.dataApi.data[0].tax_buy_id)
      this.tax_sell_id.setValue(this.dataApi.data[0].tax_sell_id)
      this.weight_select.setValue(1)
      this.weight_total.setValue(this.dataApi.data[0].weight)
      this.weight_product.setValue(this.dataApi.data[0].weight)
      this.brandProduct.setValue(this.dataApi.data[0].master_brand_id)
    },
      (err) => {
        this.alert.showError(err)
      });
  }
}
