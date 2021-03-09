import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import * as forms from '@angular/forms';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare let $:any;
@Component({
    selector: 'app-banner-setting',
    templateUrl: 'banner-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class BannerSettingComponent implements OnInit {

  
  resBackend: any;
  dataBanner: any = [];
  alertError: boolean;
  errorMessage: any;
  selectedBanner: File;
  myImageBanner: boolean;
  dataImageBannerView: string | ArrayBuffer;
  btnAct: any;
  bannerTitle: string;
  closeResult: string;

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
  ) { }

  @ViewChild('modalBanner') public modalBanner: TemplateRef < any > ;

  formBanner = this.fb.group({
    name: ['', forms.Validators.required],
    id: [''],
  });

  bannerSize: number = 5;
  blankBanner: any = [];

  activeLanding = 'active';
  ngOnInit() {
    this.getBanner();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');

    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  getBanner() {
    let dataBlank;
    const url = 'slideshow/' + this.apiBackend.serviceAuth().tenant_id;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.resBackend.data.forEach(val => {
            this.dataBanner.push({
              id: val.id,
              data: val.image_url,
            });
          });
          dataBlank = this.bannerSize - this.resBackend.data.length;
          for (let i = 0; i < dataBlank; i++) {
            this.dataBanner.push({
              id: 0,
              data: null,
            });
          }
        } else {
          this.notify.showError(this.resBackend.message);
        }
      },
      (err) => {
        if(err){
          for (let i = 0; i < this.bannerSize; i++) {
            this.dataBanner.push({
              id: 0,
              data: null,
            });
          }
        }
      }
    );
  }

  bannerShowByid(id) {
    const url = `slideshow/${this.apiBackend.serviceAuth().tenant_id}/detail/${id}`;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.formBanner.get('id').setValue(this.resBackend.data.id);
        this.formBanner.get('name').setValue(this.resBackend.data.image_url);
      },
      (err) => {
        this.notify.showError(err)
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
      this.myImageBanner = true;
      this.dataImageBannerView = reader.result;
    };
  }

  onUploadBanner() {
    let imageBannerUrl;
    let updateBannerUrl;
    if(this.formBanner.get('id').value !== 0){
      updateBannerUrl = `slideshow/${this.apiBackend.serviceAuth().tenant_id}/update/${this.formBanner.get('id').value}`;
    } else {
      updateBannerUrl = `slideshow/${this.apiBackend.serviceAuth().tenant_id}/add`;
    }
    let selectedBanner: any = new FormData();
    selectedBanner.append('file', this.selectedBanner, this.selectedBanner.name);
    selectedBanner.append('path', 'logo');
    this.apiBackend.MasterProduct(selectedBanner, 'upload').subscribe(
      (data: {}) => {
        this.resBackend = data;
        imageBannerUrl = this.resBackend.data.file;
        this.apiBackend.Update({image_url: imageBannerUrl},updateBannerUrl).subscribe(
            (data: {}) => {
              this.resBackend = data;
              if (this.resBackend.status === 200) {
                this.dataBanner = [];
                this.modalService.dismissAll(this.modalBanner);
                selectedBanner = null;
                this.getBanner();
                this.notify.showSuccess(
                  this.resBackend.message
              );
              } else {
                this.notify.showError(this.resBackend.message);
              }
            },
            (err) => {
              this.notify.showError(err);
            }
          );
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }

  removeImageBanner(id) {
    this.dataBanner[id].data = null;
  }

  openModalBanner(id, btn) {
    this.btnAct = btn;
    if (id !== 0) {
      this.bannerShowByid(id);
      this.bannerTitle = `Edit Banner Toko`;
      this.myImageBanner = false;
    } else {
      this.myImageBanner = false;
      this.bannerTitle = `Tambah Banner Toko`;
      this.formBanner.get('id').setValue(0);
      this.formBanner.get('name').setValue('');
    }

    this.modalService
    .open(this.modalBanner, {
      size: 'lg',
      ariaLabelledBy: 'modal-banner',
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

  deleteBanner(item){
    const url = `slideshow/${this.apiBackend.serviceAuth().tenant_id}/delete/${item.id}`;
    Swal.fire({
      title: 'Hapus Banner Toko?',
      text: 'Apakah Anda yakin akan menghapus Banner ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Delete(url).subscribe((data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Banner Berhasil Dihapus',
              showConfirmButton: false,
              timer: 3000,
            });
            this.dataBanner = [];
            this.getBanner();
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

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
