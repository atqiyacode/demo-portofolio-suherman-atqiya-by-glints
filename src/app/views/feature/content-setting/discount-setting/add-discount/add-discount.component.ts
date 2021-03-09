import {
  AfterContentChecked,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { ContentServiceService } from '../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../library/service/sweetalert.service';
import { debounceTime } from 'rxjs/operators';
import { Location } from '@angular/common';
import * as _ from 'lodash';

declare var moment: any;
@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.css'],
})
export class AddDiscountComponent implements OnInit, AfterContentChecked {
  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private notify: SweetAlertService,
    private location: Location
  ) {}

  @ViewChild('modalSearchProduct') public modalSearchProduct: TemplateRef<any>;

  /*MODAL, Function Names Cannot Be Changed  */
  formActive: any;
  closeResult = '';
  newDiscount: any = [];
  dummyProduct: any = [];

  firstForm = false;
  previewBanner = false;
  selectedBanner: File = null;
  bannerImageView: any = '';
  discountTitle: any = '';
  discountRangeDate: any = '';

  allProduct: any = [];
  resBackend: any = {};
  idDefault = 1;
  alertError = false;
  errorMessage = '';

  formNewDiscount = this.fb.group({
    name: ['', Validators.required],
    period: this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    }),
    products: [''],
    banner: [''],
    id: [''],
  });

  alertValidDate = false;
  messageValidDate = '';

  dataCategories: any = [];

  dataFilter: any = [];
  masterCheckbox = true;
  keyFilter = '';
  categoryFilter = '';

  totalProduct: number;
  secondaryProduct: any = [];
  listProduct: any = [];
  isMasterSel: boolean;
  selectCategory: any = null;
  keyword: any = '';
  productNotFound = false;

  totalProductSearch: any = [];
  paginateButtonProductSearch: any = [];
  productSearchCurrentPage = 0;
  productSearchRows: number;
  maxPageProductSearch: number;

  checkedProduct: any;
  checkLength: any;

  productConfirmed: any = [];
  discountPercent = 0;
  backupProductConfirmed: any = [];

  discountInput: number;
  applyAllDiscount = this.fb.group({
    allDisc: [''],
  });

  discPrice: number;

  fixPushDiscount: any = [];
  jsonView: any;

  detailNameDiscount: any;
  detailDateDiscount: any;
  detailProductDiscount: any;
  updateDiscount = false;

  discountInputUpdate: number;
  applyAllDiscountUpdate = this.fb.group({
    allDiscUpdate: [''],
  });

  discPriceUpdate: number;
  setAllDisc: number;

  discountPageSizes: any = [5, 10, 15, 25, 50];
  config = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: null
  };

  discountProductPageSizes: any = [5, 10, 15, 25, 50];
  productConfig = {
    id: 'list',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: null
  };

  ngOnInit() {
    this.getCategories();
    this.formActive = 1;
  }

  ngAfterContentChecked() {
    this.validateDateDiscount();
    this.checkFirstForm();
    this.checkNullDiscount();
    
  }

  onCancel(){
    this.location.back();
  }

  checkFirstForm() {
    if (this.formNewDiscount.status !== 'INVALID' && this.previewBanner !== false){
      this.firstForm = true;
    } else {
      this.firstForm = false;
    }
  }

  validateDateDiscount() {
    const now = new Date();
    const start = new Date(this.formNewDiscount.get('period.from').value);
    const end = new Date(this.formNewDiscount.get('period.to').value);
    if (now > start) {
      this.alertValidDate = true;
      this.messageValidDate =
        'Mulai Masa Promosi Harus Lebih Besar Dari ' +
        moment(now).format('LLL');
      this.firstForm = false;
    } else if (now > end) {
      this.alertValidDate = true;
      this.messageValidDate =
        'Batas Akhir Promosi Harus Lebih Besar Dari ' +
        moment(now).format('LLL');
      this.firstForm = false;
    } else if (start >= end) {
      this.alertValidDate = true;
      this.messageValidDate =
        'Batas Akhir Promosi Harus Lebih Besar Dari  ' +
        moment(start).format('LLL');
      this.firstForm = false;
    } else {
      this.alertValidDate = false;
      this.firstForm = true;
    }
  }

  nextForm() {
    const start = new Date(this.formNewDiscount.get('period.from').value);
    const end = new Date(this.formNewDiscount.get('period.to').value);
    this.discountTitle = this.formNewDiscount.get('name').value;
    this.discountRangeDate =
      moment(start).format('LLLL') + ' - ' + moment(end).format('LLL');
    this.formActive = 0;
    this.productConfirmed = this.backupProductConfirmed;
  }

  getCategories() {
    const url = `master-product-category/main/${
      this.apiBackend.serviceAuth().tenant_id
    }`;
    this.apiBackend.GetSearch(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.resBackend.data.forEach((value) => {
          this.dataCategories.push({
            id: value.id,
            name: value.product_category_name,
          });
        });
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  filterProductList() {
    if(this.productConfirmed.length > 0){
      this.confirmProduct();
    }
    this.secondaryProduct = [];
    this.getProducts();
    this.productSearchCurrentPage = 0;
    this.isMasterSel = false;
  }

  debounce:any;
  getProducts() {
    this.secondaryProduct = [];
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/product/list?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&keyword=${this.keyFilter}&category=${this.categoryFilter}`;
    this.apiBackend.GetSearch(url).pipe(debounceTime(1000)).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.totalProductSearch = this.resBackend.data.total;
        this.config.totalItems = this.resBackend.data.total;
          this.resBackend.data.products.forEach((value) => {
            let selected = false;
            if (this.productConfirmed.find((item) => item.id === value.id)) {
              selected = true;
            }
            this.secondaryProduct.push({
              id: value.id,
              product_name: value.product_name,
              image_url: value.image_url,
              sell_price: value.sell_price,
              sku: value.sku,
              stock: value.stock_total,
              stock_out: value.stock_out,
              discount: 0,
              is_active: true,
              isSelected: selected,
            });
  
          });
          this.setupPagination();
          this.maxPageProductSearch = this.paginateButtonProductSearch.length - 1;
          this.productNotFound = false;
        },
        (err) => {
          this.alertError = true;
          this.errorMessage = err;
          this.productNotFound = true;
        }
      );
  }

  setupPagination() {
    const items = this.totalProductSearch;
    const pageCount = Math.ceil(items / 5);
    for (let i = 0; i < pageCount; i++) {
      this.paginateButtonProductSearch.push({
        id: [i],
        label: [i + 1],
      });
    }
  }

  nextPage(current) {
    if (current < this.paginateButtonProductSearch.length) {
      this.productSearchCurrentPage = current + 1;
      this.secondaryProduct = [];
      this.paginateButtonProductSearch = [];
      if(this.productConfirmed.length > 0){
        this.confirmProduct();
      }
      this.getProducts();
    }
  }

  prevPage(current) {
    if (current > 0) {
      this.productSearchCurrentPage = current - 1;
      this.secondaryProduct = [];
      this.paginateButtonProductSearch = [];
      if(this.productConfirmed.length > 0){
        this.confirmProduct();
      }
      this.getProducts();
    }
  }

  checkUncheckAll() {
    this.secondaryProduct.forEach(value => {
      value.isSelected = this.isMasterSel;
    });
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.secondaryProduct.every(item => {
      return item.isSelected === true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedProduct = [];
    this.secondaryProduct.forEach(value => {
      if (value.isSelected) {
        this.checkedProduct.push(value);
      }
    });
    this.checkLength = this.checkedProduct.length;
  }

  checkAddProduct(id){
    let start = moment(this.formNewDiscount.get('period.from').value).format('Y-MM-Do H:mm:ss');
    let end = moment(this.formNewDiscount.get('period.to').value).format('Y-MM-Do H:mm:ss');
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/check-product/0/${id}?startdate=${start}&enddate=${end}`;
    
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        return;
      },
      (err) => {
        this.secondaryProduct.forEach(value => {
          if (value.id === id) {
            value.isSelected = false;
          }
        });
        this.getCheckedItemList();
        this.getProducts();
        this.notify.showError(err);
      }
    );
  }

  imageBanner(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.selectedBanner = files[0] as File;
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.previewBanner = true;
      this.bannerImageView = reader.result;
    };
  }

  onPushNewDiscount() {
    const uploadImage: any = new FormData();
    uploadImage.append('file', this.selectedBanner, this.selectedBanner.name);
    uploadImage.append('path', 'discount-logo-banner');
    this.apiBackend.MasterProduct(uploadImage, 'upload').subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.formNewDiscount.get('banner').setValue(this.resBackend.data.file);
        this.valueBeforeSend();
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
  }

  confirmProduct() {
    this.fixPushDiscount = [];
    if (this.checkLength > 0) {
      this.formActive = 0;
      this.checkedProduct.forEach(value => {
        const oldPrice = value.sell_price;
        this.productConfirmed.push({
          id: value.id,
          product_name: value.product_name,
          image_url: value.image_url,
          sell_price: oldPrice,
          sku: value.sku,
          stock: value.stock,
          stock_out: value.stock_out,
          disc_price: null,
          discount: null,
          is_active: true,
          isSelected: value.isSelected,
        });
      });
      this.productConfirmed = _.uniqBy(this.productConfirmed, 'id');
    } else {
      this.formActive = 2;
    }
  }

  deleteconfirmProduct(item, i) {
    const id = item.id;
    this.secondaryProduct.forEach(value => {
      if (value.id === id) {
        value.isSelected = false;
      }
    });
    this.isAllSelected();
    this.productConfirmed.splice(i, 1);
    this.fixPushDiscount.splice(i, 1);
    this.getCheckedItemList();
  }

  updateDisc(id){
    const data = this.productConfirmed.find(value => value.id === id);
    if (data.discount > 100){
      data.discount = 0;
      data.disc_price = Number(data.sell_price - ((data.discount * data.sell_price) / 100));
    } else {
      data.disc_price = Number(data.sell_price - ((data.discount * data.sell_price) / 100));
    }
  }

  updatePrice(item){
    const id = item.id;
    const data = this.productConfirmed.find(value => value.id === id);
    const oldPrice = data.sell_price;
    const currentPrice = oldPrice - data.disc_price;
    if (oldPrice < data.disc_price){
      data.disc_price = oldPrice;
      data.discount = 0;
    } else{
      data.discount = (currentPrice * 100) / oldPrice;
    }
  }

  onChangeDisc() {
    const getDiscount = this.setAllDisc;
    if (getDiscount <= 100) {
      const newDiscount = getDiscount;
      this.productConfirmed.forEach(value => {
        const oldPrice = value.sell_price;
        const currentPrice = (oldPrice * newDiscount) / 100;
        const newPrice: number = oldPrice - currentPrice;
        value.disc_price = newPrice;
        value.discount = newDiscount;
      });
    } else if (getDiscount > 100) {
      this.setAllDisc = 0;
    } else if (getDiscount < 0) {
      this.setAllDisc = 0;
    }
  }

  submitButton = false;
  checkNullDiscount(){
    let check = this.productConfirmed.filter(value => value.discount === null);
    if (check.length > 0) {
      this.submitButton = false;
    } else {
      this.submitButton = true;
    }
  }

  async valueBeforeSend() {
    this.productConfirmed.forEach(value => {
      this.fixPushDiscount.push({
        productId: value.id,
        isActive: value.is_active ? 1 : 0,
        discount: value.discount,
      });
    });

    const start = moment(this.formNewDiscount.get('period.from').value).format('Y-MM-Do H:mm:ss');
    const end = moment(this.formNewDiscount.get('period.to').value).format('Y-MM-Do H:mm:ss');

    this.formNewDiscount.get('products').setValue(this.fixPushDiscount);
    this.formNewDiscount.get('period.from').setValue(start);
    this.formNewDiscount.get('period.to').setValue(end);
    this.jsonView = JSON.stringify(this.formNewDiscount.value);
    this.submitNewDiscount();
  }

  submitNewDiscount() {
    const url = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/add';
    this.apiBackend.Update(this.formNewDiscount.value, url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.notify.showSuccess('Diskon Telah Disimpan');
          this.onCancel();
        } else {
          this.notify.showError(this.resBackend.message)
        }
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  prevForm() {
    this.formActive = 1;
    this.backupProductConfirmed = this.productConfirmed;
  }

  pushProduct() {
    this.formActive = 0;
    this.modalService.dismissAll();
  }

  searchProduct() {
    this.keyFilter = '';
    this.categoryFilter = '';
    this.isMasterSel = false;
    this.productSearchCurrentPage = 0;
    this.getProducts();
    this.modalService
      .open(this.modalSearchProduct, {
        centered:true,
        size: 'lg',
        ariaLabelledBy: 'modal-product-promo',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  onPageChange(event) {
    this.config.currentPage = event;
    this.secondaryProduct = [];
    if(this.productConfirmed.length > 0){
      this.confirmProduct();
    }
    this.getProducts();
  }

  onPageSizeChange(e) {
    this.config.itemsPerPage = e.target.value;
    this.config.currentPage = 1;
    this.secondaryProduct = [];
    if(this.productConfirmed.length > 0){
      this.confirmProduct();
    }
    this.getProducts();
  }

  onPageChangeProduct(event) {
    this.productConfig.currentPage = event;
    this.secondaryProduct = [];
    if(this.productConfirmed.length > 0){
      this.confirmProduct();
    }
    this.getProducts();
  }

  onPageSizeChangeProduct(e) {
    this.productConfig.itemsPerPage = e.target.value;
    this.productConfig.currentPage = 1;
    this.secondaryProduct = [];
    if(this.productConfirmed.length > 0){
      this.confirmProduct();
    }
    this.getProducts();
  }

}
