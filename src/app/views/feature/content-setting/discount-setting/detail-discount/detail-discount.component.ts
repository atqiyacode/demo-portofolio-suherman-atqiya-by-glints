import { AfterContentChecked, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbCalendar, } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ContentServiceService } from '../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../library/service/sweetalert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import Swal from 'sweetalert2/dist/sweetalert2.js';


declare var $: any;
declare var moment: any;
@Component({
  selector: 'app-detail-discount',
  templateUrl: './detail-discount.component.html',
  styleUrls: ['../../content-setting.css'],
})
export class DetailDiscountComponent implements OnInit, AfterContentChecked {
  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private notify: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private location: Location

  ) {}

  @ViewChild('modalSearchProduct') public modalSearchProduct: TemplateRef<any>;

  idDetail: any;
  resBackend: any;
  productConfirmed: any = [];
  detailNameDiscount: any;
  detailDateDiscount: any;
  published: any;
  alertError: boolean;
  errorMessage: any;
  closeResult: any;
  detailStartDate: any;
  detailbanner: any;
  detailEndDate: any;

  isMasterSel: boolean;

  secondaryProduct: any;
  productSearchCurrentPage = 0;
  categoryFilter = '';
  keyFilter: any = '';
  totalProductSearch: any;
  maxPageProductSearch: number;
  paginateButtonProductSearch = [];

  dataCategories: any = [];

  checkedProduct: any = [];
  checkLength: any;

  discountPercent = 0;
  backupProductConfirmed: any = [];
  productConfirmedLength: number;

  dataFilter: any = [];
  masterCheckbox = true;

  setAllDisc: number;

  newUpdateProducts: any = [];
  submitButton = false;

  statusDiscount;
  colorStatusDiscount;
  idStatusDiscount;

  formUpdateDiscount = this.fb.group({
    name: ['', Validators.required],
    period: this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    }),
    products: [''],
    banner: ['', Validators.required],
  });

  ngOnInit() {
    this.getDetail();
  }

  ngAfterContentChecked() {
    this.checkNullDiscount();
  }

  getDetail(){
    this.idDetail = this.activatedRoute.snapshot.paramMap.get('id');
    const url = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/detail/' + this.idDetail;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.productConfirmed = [];
        let value = this.resBackend.data;
        
        const now = new Date();
        const start = new Date(value.startdate);
        const end = new Date(value.enddate);
        if (now > end) {
          this.statusDiscount = 'Telah berakhir';
          this.colorStatusDiscount = 'badge-secondary';
          this.idStatusDiscount = 1;
        } else if (now > start && now < end) {
          this.statusDiscount = 'Sedang Berjalan';
          this.colorStatusDiscount = 'badge-success';
          this.idStatusDiscount = 2;
        } else if (now < start) {
          this.statusDiscount = 'Akan Datang';
          this.colorStatusDiscount = 'badge-primary';
          this.idStatusDiscount = 3;
        }
        
        const banner = value.banner;
        this.published = value.is_published;
        this.detailNameDiscount = value.name;
        this.detailbanner = value.banner;
        this.detailStartDate = start;
        this.detailEndDate = end;

        this.detailDateDiscount = `${moment(start).format('LL')} ${moment(start).format('LT')} WIB - ${moment(end).format('LL')} ${moment(end).format('LT')} WIB`;

        value.detail.forEach(val => {
          const statusProduct = val.is_active;
          const oldPrice = val.product.sell_price;
          const discount = val.discount;
          const countNewPrice = (oldPrice * discount) / 100;
          this.productConfirmed.push({
            mainId: val.id,
            id: val.master_product_id,
            banner,
            discount,
            product_name: val.product.product_name,
            image_url: val.product.image_url,
            is_active: (statusProduct === 1) ? true : false,
            sell_price: oldPrice,
            sku: val.product.sku,
            disc_price: oldPrice - countNewPrice,
          });
        });
        this.productConfirmed = _.uniqBy(this.productConfirmed, 'id');
        this.productConfirmedLength = this.productConfirmed.length;
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
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
      console.log('failed');
    } else{
      data.discount = (currentPrice * 100) / oldPrice;
      console.log('success');
    }
  }

  deleteconfirmProductUpdate(i, item) {
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/product/delete/${item.mainId}/${item.id}`;
    if(this.productConfirmed.length < 2){
      Swal.fire({
        title: 'Product Discount Akan Kosong?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF785B',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Tidak',
      }).then((result) => {
        if (result.value) {
          this.apiBackend.Show(url).subscribe(
            (data: {}) => {
              this.resBackend = data;
              this.productConfirmed.splice(i, 1);
              this.notify.showSuccess('Product Dihapus Dari Diskon')
            },
            (err) => {
              this.notify.showError(err)
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log('cancelled');
        }
      });
    } else {
      this.apiBackend.Show(url).subscribe(
        (data: {}) => {
          this.resBackend = data;
          this.productConfirmed.splice(i, 1);
          this.notify.showSuccess('Product Dihapus Dari Diskon')
        },
        (err) => {
          this.notify.showError(err)
        }
      );
    }
    
  }

  searchProduct() {
    this.isMasterSel = false;
    this.getCategories();
    this.getProducts();
    this.modalService
      .open(this.modalSearchProduct, {
        centered: true,
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

  getCategories() {
    const url = `master-product-category/main/${this.apiBackend.serviceAuth().tenant_id}`;
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

  getProducts() {
    this.secondaryProduct = [];
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/product/list?page=${this.productSearchCurrentPage + 1}&limit=${5}&keyword=${this.keyFilter}&category=${this.categoryFilter}`;
    this.apiBackend.GetSearch(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.totalProductSearch = this.resBackend.data.total;
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

      },
      (err) => {
        this.notify.showError(err)
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

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  checkUncheckAll() {
    this.secondaryProduct.forEach(value => {
      value.isSelected = this.isMasterSel;
    });
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.secondaryProduct.every((item: any) => {
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

  confirmProduct() {
    this.checkedProduct.forEach(value => {
      const oldPrice = value.sell_price;
      const discount = value.discount;
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
      this.productConfirmed = _.uniqBy(this.productConfirmed, 'id');
      this.productConfirmedLength = this.productConfirmed.length;
    });
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

  checkAddProduct(id){
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/check-product/${this.idDetail}/${id}`;
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
        this.secondaryProduct = [];
        this.getProducts();
        this.getCheckedItemList();
        this.notify.showError(err);
      }
    );
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

  checkNullDiscount(){
    let check = this.productConfirmed.filter(value => value.discount === null);
    if (check.length > 0) {
      this.submitButton = false;
    } else {
      this.submitButton = true;
    }
  }

  onPushUpdateDiscount(){
    const urlDetail = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/detail/' + this.idDetail;
    const checkNewPrice = this.productConfirmed.filter(value => value.disc_price == null);
    if (checkNewPrice.length > 0){
      this.notify.showError('Harga Sale tidak boleh kosong!')
    } else {
      // fixed push on update
      this.formUpdateDiscount.get('name').setValue(this.detailNameDiscount);
      this.formUpdateDiscount.get('banner').setValue(this.detailbanner);
      this.formUpdateDiscount.get('period.from').setValue(this.detailStartDate);
      this.formUpdateDiscount.get('period.to').setValue(this.detailEndDate);
      this.newUpdateProducts = [];

      this.apiBackend.Show(urlDetail).subscribe(
        (data: {}) => {
          this.resBackend = data;
          const oldData = this.resBackend.data.detail;
          let setId;
          this.productConfirmed.forEach((value) => {
            const test = oldData.find((item) => item.master_product_id === value.id);
            if (test) {
              setId = value.mainId;
            } else {
              setId = 0;
            }
            this.newUpdateProducts.push({
              id: setId,
              productId: value.id,
              discount: value.discount,
              isActive: value.is_active === true ? 1 : 0
            });
          });
          this.submitUpdateDiscount();
        },
        (err) => {
          this.notify.showError(err)
        }
      );
    }
  }

  submitUpdateDiscount() {
    this.formUpdateDiscount.get('products').setValue(this.newUpdateProducts);
    const urlUpdate = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/update/' + this.idDetail;
    this.apiBackend.Update(this.formUpdateDiscount.value, urlUpdate).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.onCancel();
          this.notify.showSuccess('Diskon Berhasil Diupdate')
        } else {
          this.notify.showError(this.resBackend.message)
        }
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  onCancel(){
    this.location.back();
  }

  endDiscount(id) {
    const url = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/ended/' + id;
    Swal.fire({
      title: 'Akhiri Promo Toko?',
      text: 'Apakah Anda yakin akan mengakhiri Promo Toko ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Akhiri',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Show(url).subscribe((data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            this.notify.showSuccess('Promo Telah Dihapus')
            this.onCancel();
          } else {
            this.notify.showError(this.resBackend.message)
          }
        },
        (err) => {
          this.notify.showError(err)
        }
      );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('cancelled');
      }
    });

  }

  deleteDiscount(id) {
    const url = 'discount/' + this.apiBackend.serviceAuth().tenant_id + '/delete/' + id;
    Swal.fire({
      title: 'Hapus Promo Toko?',
      text: 'Apakah Anda yakin akan menghapus Promo Toko ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Akhiri',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Show(url).subscribe(
          (data: {}) => {
            this.resBackend = data;
            if (this.resBackend.status === 200) {
              this.notify.showSuccess('Promo Diskon Telah Dihapus');
              this.onCancel();
            } else {
              this.notify.showError(this.resBackend.message)
            }
          },
          (err) => {
            this.notify.showError(err)
          }
        );

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('cancelled');
      }
    });
  }

}
