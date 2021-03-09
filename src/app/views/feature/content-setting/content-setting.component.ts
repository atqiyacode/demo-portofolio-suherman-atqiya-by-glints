import { AfterContentChecked,  AfterViewChecked,  AfterViewInit,  Component,  OnInit,  TemplateRef,  ElementRef,  ViewChild,} from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct, } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as forms from '@angular/forms';

import { ContentServiceService } from '../../library/service/content-service.service';
import { ApiBackendService } from '../../../auth/api-backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../library/service/sweetalert.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';

declare let $: any;
@Component({
  selector: 'app-content-setting',
  templateUrl: './content-setting.component.html',
  styleUrls: ['./content-setting.css']
})
export class ContentSettingComponent implements OnInit {

  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private notify: SweetAlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  csConfig = this.content.configMenu();
  activeLanding = this.csConfig.menu[0].active;
  activePromo = this.csConfig.menu[1].active;
  activeFooter = this.csConfig.menu[2].active;
  activeDiscount = this.csConfig.menu[3].active;
  activeReview = this.csConfig.menu[4].active;

  tokenAuth = this.apiBackend.serviceAuth().tokenAuth;
  resBackend: any;

  listCustomerService: any = [];
  listAboutUs: any = [];
  listPayment: any = [];
  listDelivery: any = [];

  // bank
  dataBank: any = [];

  // courier
  dataCourier: any = [];

  ngOnInit(): void {
    this.landingPageMenu();
    this.customerServiceMenu();
    this.aboutUsMenu();
    this.paymentMenu();
    this.courierMenu();
  }

  ngAfterContentChecked() {
    this.activeLanding = this.csConfig.menu[0].active;
    this.activePromo = this.csConfig.menu[1].active;
    this.activeFooter = this.csConfig.menu[2].active;
    this.activeDiscount = this.csConfig.menu[3].active;
    this.activeReview = this.csConfig.menu[4].active;
    
  }

  setActiveCs(id) {
    for (let index = 0; index < this.csConfig.menu.length; index++) {
      if (id === index) {
        this.csConfig.menu[id].active = 'active';
      } else {
        this.csConfig.menu[index].active = '';
      }
    }
    if (id == 0) {
      $('#nav-tabContent').removeAttr('hidden', 'hidden');
      $('#nav-tabFooter').attr('hidden', 'hidden');
      $('#nav-tabDiscount').attr('hidden', 'hidden');

      $('#collapseExample').collapse('show');
      $('#collapseFooter').collapse('hide');

      $('#collapsePromo').attr('hidden', 'hidden');
      $('#collapseDiscount').attr('hidden', 'hidden');
    } else if (id == 1) {
      $('#nav-tabContent').attr('hidden', 'hidden');
      $('#nav-tabFooter').attr('hidden', 'hidden');
      $('#nav-tabDiscount').attr('hidden', 'hidden');

      $('#collapseExample').collapse('hide');
      $('#collapseFooter').collapse('hide');

      $('#collapsePromo').removeAttr('hidden', 'hidden');
      $('#collapseDiscount').attr('hidden', 'hidden');
    } else if (id == 2) {
      $('#nav-tabContent').attr('hidden', 'hidden');
      $('#nav-tabFooter').removeAttr('hidden', 'hidden');
      $('#nav-tabDiscount').attr('hidden', 'hidden');

      $('#collapseExample').collapse('hide');
      $('#collapseFooter').collapse('show');

      $('#collapsePromo').attr('hidden', 'hidden');
      $('#collapseDiscount').attr('hidden', 'hidden');
    } else if (id == 3) {
      $('#nav-tabContent').attr('hidden', 'hidden');
      $('#nav-tabFooter').attr('hidden', 'hidden');
      $('#nav-tabDiscount').removeAttr('hidden', 'hidden');

      $('#collapseExample').collapse('hide');
      $('#collapseFooter').collapse('hide');

      $('#collapsePromo').attr('hidden', 'hidden');
      $('#collapseDiscount').removeAttr('hidden', 'hidden');
    } else if (id == 4) {
      $('#nav-tabContent').attr('hidden', 'hidden');
      $('#nav-tabFooter').attr('hidden', 'hidden');
      $('#nav-tabDiscount').removeAttr('hidden', 'hidden');

      $('#collapseExample').collapse('hide');
      $('#collapseFooter').collapse('hide');

      $('#collapsePromo').attr('hidden', 'hidden');
      $('#collapseDiscount').removeAttr('hidden', 'hidden');
    }
  }

  landingPage: any = [];
  landingPageMenu(){
    this.landingPage = [
      {id: 1, name: 'Logo Company/Toko', link: "logo-setting"},
      {id: 2, name: 'Keuntungan', link: "benefit-setting"},
      {id: 3, name: 'Banner Toko', link: "banner-setting"},
      {id: 4, name: 'Testimonial', link: "testimonial-setting"},
      {id: 5, name: 'Product Special', link: "product-special"},
      {id: 6, name: 'Daftar Pesan', link: "subscription"},
    ];
  }

  customerService: any = [];
  customerServiceMenu(){
    this.customerService = [
      {id: 1, name: 'Bantuan', link: "helper-setting"},
      {id: 2, name: 'Pengembalian Barang', link: "return-setting"},
      {id: 3, name: 'Status Order', link: "order-status-setting"},
      {id: 4, name: 'Pembayaran', link: "payment-setting"},
      {id: 5, name: 'Garansi', link: "warranty-setting"},
      {id: 6, name: 'Hubungi Kami', link: "contact-us-setting"},
    ];
  }

  aboutUs: any = [];
  aboutUsMenu(){
    this.aboutUs = [
      {id: 1, name: 'About Us', link: "about-us-setting"},
      {id: 2, name: 'Secure Payment', link: "secure-payment-setting"},
      {id: 3, name: 'Persyaratan & Ketentuan', link: "terms-setting"},
      {id: 4, name: 'Kebijakan Privasi', link: "privacy-policy-setting"},
    ];
  }

  payment: any = [];
  paymentMenu(){
    this.payment = [
      {id: 1, name: 'Pilihan Pembayaran', link: "payment-option-setting"},
    ];
  }

  courier: any = [];
  courierMenu(){
    this.courier = [
      {id: 1, name: 'Pilihan Pengiriman', link: "courier-option-setting"},
    ];
  }

}
