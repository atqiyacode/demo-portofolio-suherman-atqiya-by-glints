import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import * as forms from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare let $: any;
@Component({
    selector: 'app-product-special',
    templateUrl: 'product-special.component.html',
    styleUrls: ['../content-setting.css']
})

export class ProductSpecialComponent implements OnInit {
  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
  ) { }

  @ViewChild('modalSearchProduct') public modalSearchProduct: TemplateRef<any>;


  keyFilter: any = '';
  closeResult: any = '';
  debounce: any;
  resBackend: any;
  totalProductSearch:number;

  productConfirmed: any = [];
  secondaryProduct: any = [];

  totalData: any;
  
  specialProduct: any = [];

  config = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: null
  };

  ngOnInit() {
    this.getSpecialProduct();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');
    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  getSpecialProduct() {
    const url = `product-special/list/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}`;
    this.apiBackend.GetSearch(url).pipe(debounceTime(1000)).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if(this.resBackend.status == 200){
          this.totalData = this.resBackend.data.total - 1;
          this.config.totalItems = this.resBackend.data.total - 1;
          this.resBackend.data.product.forEach(val => {
            this.specialProduct.push(val);
          });
        } else {
          this.notify.showError(this.resBackend.message)
        }
        },
        (err) => {
          this.notify.showError(err)
        }
      );      
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.specialProduct = [];
    this.getSpecialProduct();
  }

  getProducts() {
    if(this.keyFilter.length >= 3){
      const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/product/list?page=${1}&limit=${5}&keyword=${this.keyFilter}`;
      this.apiBackend.GetSearch(url).pipe(debounceTime(1000)).subscribe(
        (data: {}) => {
          this.resBackend = data;
          this.totalProductSearch = this.resBackend.data.total;
            this.resBackend.data.products.forEach((value) => {
              this.secondaryProduct.push(value);
            });
          },
          (err) => {
            this.notify.showError(err)
          }
        );
    }
  }

  goSpecial(item){
    const url = `product-special/${this.apiBackend.serviceAuth().tenant_id}/submit`;
    this.apiBackend.Update({
      master_product_id: item.id,
      is_special: 1
    }, url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.notify.showSuccess('Produk Menjadi Special')
          this.specialProduct = [];
          this.getSpecialProduct();
        } else {
          this.notify.showError(this.resBackend.message)
        }
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  filterProductList() {
    this.secondaryProduct = [];
    this.getProducts();
  }

  searchProduct(e) {
    this.keyFilter = e.target.value;
    this.modalService
      .open(this.modalSearchProduct, {
        centered:true,
        size: 'lg',
        ariaLabelledBy: 'modal-product-special',
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

  onDeleteProduct(item){
    const url = `product-special/${this.apiBackend.serviceAuth().tenant_id}/submit`;
    Swal.fire({
      title: 'Hapus Produk Spesial?',
      text: 'Apakah Anda yakin akan menghapus Produk Spesial ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Update({
          master_product_id: item.id,
          is_special: 0
        }, url).subscribe((data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Promo Spesial Dihapus',
              showConfirmButton: false,
              timer: 3000,
            });
            this.specialProduct = [];
            this.config.currentPage = 1;
            this.getSpecialProduct();
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
