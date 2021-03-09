import { Component, OnInit, TemplateRef, ViewChild, AfterContentChecked } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import * as forms from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';

declare let $: any;
@Component({
    selector: 'app-testimonial-setting',
    templateUrl: 'testimonial-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class TestimonialSettingComponent implements OnInit, AfterContentChecked {

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
  ) { }

  @ViewChild('content') public templateref: TemplateRef < any > ;

  resBackend: any;
  btnAct: number;
  testimonyTitle: string;
  closeResult: string;

  dataTestimonial: any = [];

  formTestimonial = this.fb.group({
    name: ['', forms.Validators.required],
    email: ['', [forms.Validators.required, forms.Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    occupation: ['', forms.Validators.required],
    testimony: ['', forms.Validators.required],
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
    this.getTestimonial();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');
    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  action: boolean = false;
  ngAfterContentChecked() {
    if (this.formTestimonial.status !== 'INVALID'){
      this.action = true;
    } else {
      this.action = false;
    }
  }

  getTestimonial() {
    const testimonyUrl = `testimony/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}`;
    this.apiBackend.GetSearch(testimonyUrl).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.config.totalItems = this.resBackend.data.total;
        this.resBackend.data.testimony.forEach(value => this.dataTestimonial.push(value));
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.dataTestimonial = [];
    this.getTestimonial();
  }

  onPageSizeChange(e) {
    this.config.itemsPerPage = e.target.value;
    this.config.currentPage = 1;
    this.dataTestimonial = [];
    this.getTestimonial();
  }

  submitSaveTestimonial() {
    if (this.btnAct === 1) {
      const url = `testimony/${this.apiBackend.serviceAuth().tenant_id}/add`;
      this.apiBackend.Update(this.formTestimonial.value, url).subscribe(
        (data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            this.modalService.dismissAll();
            this.notify.showSuccess('Testimonial Berhasil Disimpan');
            this.dataTestimonial = [];
            this.getTestimonial();
          } else {
            this.notify.showError(this.resBackend.message)
          }
        },
        (err) => {
          this.notify.showError(err)
        }
      );
    }

    if (this.btnAct === 2) {
      const url = `testimony/${this.apiBackend.serviceAuth().tenant_id}/update/${this.formTestimonial.get('id').value}`;
      this.apiBackend.Update(this.formTestimonial.value, url).subscribe(
        (data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            this.modalService.dismissAll();
            this.dataTestimonial = [];
            this.getTestimonial();
            this.notify.showSuccess('Testimonial Berhasil Diupdate');
          } else {
            this.notify.showError(this.resBackend.message)
          }
        },
        (err) => {
          this.notify.showError(err)
        }
      );
    }
  }

  detailTestimony(id){
    this.btnAct = 2;
    this.testimonyTitle = `Detail Testimonial`;
    const url = `testimony/${this.apiBackend.serviceAuth().tenant_id}/detail/${id}`;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.formTestimonial.get('id').setValue(this.resBackend.data.id);
        this.formTestimonial.get('name').setValue(this.resBackend.data.name);
        this.formTestimonial.get('email').setValue(this.resBackend.data.email);
        this.formTestimonial.get('occupation').setValue(this.resBackend.data.occupation);
        this.formTestimonial.get('testimony').setValue(this.resBackend.data.testimony);
      },
      (err) => {
        this.notify.showError(err)
      }
    );
    this.modalService.open(this.templateref, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  newTestimonial() {
    this.btnAct = 1;
    this.formTestimonial.reset();
    this.testimonyTitle = `Tambah Testimonial`;
    this.modalService
      .open(this.templateref, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
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

  deleteTestimony(i,item){
    const url = `testimony/${this.apiBackend.serviceAuth().tenant_id}/delete/${item.id}`;
    Swal.fire({
      title: 'Hapus Testimonial?',
      text: 'Apakah Anda yakin akan menghapus Testimonial ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Show(url).subscribe(
          (data: {}) => {
            this.resBackend = data;
            if (this.resBackend.status === 200) {
              this.notify.showSuccess('Testimonial Berhasil Dihapus')
              this.dataTestimonial = [];
              this.getTestimonial();
            } else {
              this.notify.showError('Testimonial Gagal Dihapus')
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
