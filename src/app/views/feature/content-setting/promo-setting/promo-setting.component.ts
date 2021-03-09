import { Component, OnInit, AfterContentChecked, TemplateRef, ViewChild, } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import * as forms from '@angular/forms';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var $: any;
declare var moment: any;
@Component({
    selector: 'app-promo-setting',
    templateUrl: 'promo-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class PromoSettingComponent implements OnInit, AfterContentChecked {
  closeResult: string;
  formBanner: any;
  alertError: boolean;
  errorMessage: any;
  formData: any = new FormData();

  
  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
  ) { }

  @ViewChild('modalPromo') public modalPromo: TemplateRef < any > ;

  resBackend: any;
  dataPromo: any = [];
  dataImagePromoView: any = '';
  myImagePromo = false;
  selectedPromo: File = null;
  first: number;
  last: number;

  promoActive = false;
  promoStart: any;
  promoEnd: any;

  formPromo = this.fb.group({
    name: ['', forms.Validators.required],
    startdate: ['', forms.Validators.required],
    enddate: ['', forms.Validators.required],
    desc: ['', forms.Validators.required],
    banner: [''],
    id: [''],
  });

  pageSizes: any = [3, 5, 10, 15, 25, 50];

  config = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: null
  };

  ngOnInit() {
    this.getPromo();
    $('#promo-page').addClass('active');
    $('#landing-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  ngAfterContentChecked(){
    this.checkFormPromo()
  }

  getPromo() {
    const url = `promo/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}`;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.config.totalItems = this.resBackend.data.total;
        if (this.resBackend.status === 200) {
          this.resBackend.data.promotions.forEach(value => {
            let labelDatePromo = '';
            let labelStatusPromo = '';
            const now = new Date();
            const start = new Date(value.startdate);
            const end = new Date(value.enddate);
            if (now > end) {
              // has been passed
              labelDatePromo = `Sudah Berakhir ${moment(end).fromNow()} (${moment(end).format('LL')})`;
              labelStatusPromo = 'text-danger';
            } else if (start > new Date()) {
              // on going promo
              labelDatePromo = `Akan Dimulai ${moment(start).fromNow()}`;
              labelStatusPromo = 'text-info';
            } else {
              // active promo
              labelDatePromo = `Akan Berakhir ${moment(end).fromNow()} Lagi`;
              labelStatusPromo = 'text-success';
            }

            this.dataPromo.push({
              id: value.id,
              name: value.name,
              desc: value.desc,
              banner: value.banner,
              promoDate: labelDatePromo,
              promoStatus: labelStatusPromo,
            });
          });
        } else {
          this.notify.showError(this.resBackend.message);
        }
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.dataPromo = [];
    this.getPromo();
  }

  onPageSizeChange(e) {
    this.config.itemsPerPage = e.target.value;
    this.config.currentPage = 1;
    this.dataPromo = [];
    this.getPromo();
  }

  alertValidDate: any;
  submitButton: boolean = false;
  messageValidDate = '';
  validateDatePromo() {
    const now = new Date(new Date().setDate(new Date().getDate()-1));
    const start = new Date(this.formPromo.get('startdate').value);
    const end = new Date(this.formPromo.get('enddate').value);
    if (now > start) {
      this.alertValidDate = true;
      this.messageValidDate = `Minimal Mulai Masa Promosi ${moment(new Date()).format('LL')}`;
    } else if (now > end) {
      this.alertValidDate = true;
      this.messageValidDate = `Batas Akhir Promosi Harus Lebih Besar Dari ${moment(new Date()).format('LL')}`;
    } else if (start >= end) {
      this.alertValidDate = true;
      this.messageValidDate = `Batas Akhir Promosi Harus Lebih Besar Dari  ${moment(start).format('LL')}`;
    } else {
      this.alertValidDate = false;
    }
  }

  checkFormPromo() {
    if (this.formPromo.status !== 'INVALID' && this.myImagePromo !== false){
      this.validateDatePromo();
      if(this.alertValidDate === false){
        this.submitButton = true;
      } else {
        this.submitButton = false;
      }
    } else {
      this.submitButton = false;
    }
  }

  openModalPromo() {
    this.formPromo.reset();
    this.myImagePromo = false;
    this.promoActive = false;

    this.modalService
      .open(this.modalPromo, {
        size: 'lg',
        ariaLabelledBy: 'modal-promo',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    $('#modalAddPromoLabel').text('Tambah Promo Baru');
  }

  clickDetailPromo(item) {
    this.formPromo.get('id').setValue(item.id);
    const url = `promo/${this.apiBackend.serviceAuth().tenant_id}/detail/${item.id}`;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        moment.updateLocale('id', null);
        let labelDatePromo = '';
        const now = new Date();
        const start = new Date(this.resBackend.data.startdate);
        const end = new Date(this.resBackend.data.enddate);

        if (now > end) {
          // has been passed
          labelDatePromo = `Sudah Berakhir ${moment(end).fromNow()} (${moment(end).format('LL')})`;
          $('.btn-edit-promo').hide();
          $('.btn-delete-promo').show();
        } else if (start > new Date()) {
          // on going promo
          $('.btn-edit-promo').show();
          $('.btn-delete-promo').show();
          labelDatePromo = 'Akan Dimulai ' + moment(start).fromNow();
        } else {
          // active promo
          $('.btn-edit-promo').show();
          $('.btn-delete-promo').hide();
          labelDatePromo = 'Akan berakhir ' + moment(end).fromNow() + ' Lagi';
        }
        $('#modalPromo').modal('show');
        $('#modalPromoLabel').text('Detail Promo');
        $('.label-promo-name').text(this.resBackend.data.name);
        $('.label-promo-desc').text(this.resBackend.data.desc);
        $('.label-promo-date').text(labelDatePromo);
        $('[name="promo_id"]').val(this.resBackend.data.id);
        $('.label-promo-banner').html(`
            <img src="${this.resBackend.data.banner}" alt="promo-image" class="img-fluid" style="object-fit: contain; height: 300px;">
            `);
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
  }

  imagePromo(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.selectedPromo = files[0] as File;
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.myImagePromo = true;
      this.formData.append('file', files[0]);
      this.formData.append('path', 'banner');
      this.dataImagePromoView = reader.result;
      this.uploadImagePromo();
    };
  }

  uploadImagePromo() {
    let resUploap: any = {};
    this.apiBackend.GeneralUpload(this.formData).subscribe(
      (data: {}) => {
        resUploap = data;
        this.formPromo.get('banner').setValue(resUploap.data.file);
      },
      (err) => {}
    );
  }

  editPromo() {
    const idPromo = this.formPromo.value.id;
    const url =
      'promo/' + this.apiBackend.serviceAuth().tenant_id + '/detail/' + idPromo;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        const now = new Date();
        const start = new Date(this.resBackend.data.startdate);
        const end = new Date(this.resBackend.data.enddate);
        const files = this.resBackend.data.banner;
        this.myImagePromo = true;
        this.dataImagePromoView = files;
        this.formPromo.get('id').setValue(this.resBackend.data.id);
        this.formPromo.get('name').setValue(this.resBackend.data.name);
        this.formPromo.get('desc').setValue(this.resBackend.data.desc);
        this.formPromo.get('banner').setValue(this.resBackend.data.banner);
        this.formPromo
          .get('startdate')
          .setValue(moment(start).format('YYYY-MM-DD'));
        this.formPromo
          .get('enddate')
          .setValue(moment(end).format('YYYY-MM-DD'));
        if (now > end) {
          // has been passed
          this.promoActive = true;
        } else if (start > now) {
          // on going promo
          this.promoActive = false;
        } else {
          // active promo
          this.promoActive = true;
          this.promoStart = moment(start).format('YYYY-MM-DD');
          this.promoEnd = moment(end).format('YYYY-MM-DD');
        }
        $('#modalPromo').modal('hide');
        // $('#modalAddPromo').modal('show');
        this.modalService
          .open(this.modalPromo, {
            size: 'lg',
            ariaLabelledBy: 'modal-promo',
          })
          .result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
        $('#modalAddPromoLabel').text('Update Promo');
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
  }

  closeModalPromo() {
    this.dataImagePromoView = null;
    this.myImagePromo = false;
    this.formData.delete('file');
    this.formPromo.get('banner').setValue(null);
    this.formPromo.reset();
    $('#modalAddPromo').modal('hide');
    $('#modalEditPromo').modal('hide');
    $('#modalPromo').modal('hide');
  }

  savePromo(id) {
    let promoUrl;
    let message;
    if (id != null) {
      promoUrl = `promo/${this.apiBackend.serviceAuth().tenant_id}/update/${id}`;
      message = `Promo Berhasil Diupdate !!`;
    } else {
      promoUrl = `promo/${this.apiBackend.serviceAuth().tenant_id}/add`;
      message = `Promo Berhasil Ditambah !!`;
    }

    this.apiBackend.Update(this.formPromo.value, promoUrl).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.modalService.dismissAll();
          this.notify.showSuccess(message);
          $('#modalAddPromo').modal('hide');
          this.dataPromo = [];
          this.config.currentPage = 1;
          this.getPromo();
        } else {
          this.notify.showError(this.resBackend.message);
        }
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }

  deletePromo(){
    const idPromo = $('[name="promo_id"]').val();
    const deletePromoUrl = `promo/${this.apiBackend.serviceAuth().tenant_id}/delete/${idPromo}`;
    Swal.fire({
      title: 'Hapus Promo Toko?',
      text: 'Apakah Anda yakin akan menghapus Promo ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Delete(deletePromoUrl).subscribe((data: {}) => {
          if (this.resBackend.status === 200) {
            this.modalService.dismissAll();
            this.notify.showSuccess('Promo Berhasil Dihapus')
            this.dataPromo = [];
            this.config.currentPage = 1;
            this.getPromo();
            this.closeModalPromo();
          } else {
            this.notify.showSuccess(this.resBackend.message)
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
