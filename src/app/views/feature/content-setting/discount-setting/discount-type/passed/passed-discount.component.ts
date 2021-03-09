import { Component, OnInit} from '@angular/core';
import * as forms from '@angular/forms';
import * as router from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ContentServiceService } from '../../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../../library/service/sweetalert.service';

declare let $: any;
declare let moment: any;
@Component({
    selector: 'app-passed-discount',
    templateUrl: 'passed-discount.component.html',
    styleUrls: ['../../../content-setting.css']
})

export class PassedDiscountComponent implements OnInit {

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
      private router:router.Router,
  ) { }

  resBackend: any;
  dataDiscount: any = [];
  discountStatus: any = 3;
  discountPageSizes: any = [3, 5, 10, 15, 25, 50];

  config = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: null
  };

  ngOnInit() {
    this.getDiscount();
    $('.passed-discount').addClass('active');
    $('.all-discount').removeClass('active');
    $('.active-discount').removeClass('active');
    $('.next-discount').removeClass('active');
    $('#nav-disc-passed').show();
  }

  getDiscount() {
    const urlDiscount = `discount/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&status=${this.discountStatus}`;
    this.apiBackend.Show(urlDiscount).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.config.totalItems = this.resBackend.data.total;
        this.resBackend.data.discount.forEach(value => {
          let statusDiscount;
          let colorStatusDiscount;
          let idStatusDiscount;
          const now = new Date();
          const start = new Date(value.startdate);
          const end = new Date(value.enddate);
          if (now > end) {
            statusDiscount = 'Telah berakhir';
            colorStatusDiscount = 'text-secondary';
            idStatusDiscount = 1;
          } else if (now > start && now < end) {
            statusDiscount = 'Sedang Berjalan';
            colorStatusDiscount = 'text-success';
            idStatusDiscount = 2;
          } else if (now < start) {
            statusDiscount = 'Akan Datang';
            colorStatusDiscount = 'text-primary';
            idStatusDiscount = 3;
          }
          this.dataDiscount.push({
            id: value.id,
            name: value.name,
            banner: value.banner,
            startdate: moment(start).format('DD-MM-YYYY') + ' ' + moment(start).format('LT'),
            enddate: moment(end).format('DD-MM-YYYY') + ' ' + moment(end).format('LT'),
            is_active: value.is_active,
            is_published: value.is_published,
            statusDiscount,
            colorStatusDiscount,
            idStatusDiscount,
          });
        });
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.dataDiscount = [];
    this.getDiscount();
  }

  onPageSizeChange(e) {
    this.config.itemsPerPage = e.target.value;
    this.config.currentPage = 1;
    this.dataDiscount = [];
    this.getDiscount();
  }

  addNewDiscount(){
    this.router.navigate(['manage-discount/new-discount'])
  }

  updateDiscount(id) {
    const urlUpdate = `manage-discount/update-discount/${id}`;
    this.router.navigate([urlUpdate]);
  }

  detailDiscount(id){
    const urlDetail = `manage-discount/detail-discount/${id}`;
    this.router.navigate([urlDetail]);
  }

  endDiscount(id) {
    const url = `discount/${this.apiBackend.serviceAuth().tenant_id}/ended/${id}`;
    Swal.fire({
      title: 'Akhiri Promo Toko?',
      text: 'Apakah Anda yakin akan mengakhiri Promo Toko ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Akhiri',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Show(url).subscribe((data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            this.notify.showSuccess('Promo Berhasil Diakhiri')
            this.config.currentPage = 1;
            this.dataDiscount = [];
            this.getDiscount();
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
      icon: 'error',
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
              this.notify.showSuccess('Promo Berhasil Dihapus')
              this.config.currentPage = 1;
              this.dataDiscount = [];
              this.getDiscount();
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
