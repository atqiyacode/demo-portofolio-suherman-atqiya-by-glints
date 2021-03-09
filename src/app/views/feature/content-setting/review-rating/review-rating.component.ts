import { Component, OnInit, AfterViewChecked} from '@angular/core';
import * as forms from '@angular/forms';
import * as router from '@angular/router';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';

declare let $: any;
declare let moment: any;
@Component({
  selector: 'app-review-rating',
  templateUrl: 'review-rating.component.html',
  styleUrls: ['../content-setting.css'],
  providers: [NgbRatingConfig]
})

export class ReviewRatingComponent implements OnInit, AfterViewChecked {
  
  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    public fb: forms.FormBuilder,
    private notify: SweetAlertService,
    private router:router.Router,
    private rating:NgbRatingConfig,
    ) { }
    
    resBackend: any;
    dataReview: any = [];
    discountStatus: any;
    discountPageSizes: any = [5, 10, 15, 25, 50];
    selected: any;
    
    config = {
      id: 'custom',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: null
    };
    
    ngOnInit() {
      this.getReview();
      $('#collapseExample').collapse('hide');
      $('#collapseFooter').collapse('hide');
      $('#review-page').addClass('active');
      $('#discount-page').removeClass('active');
      $('#promo-page').removeClass('active');
      $('#footer-page').removeClass('active');
      $('#landing-page').removeClass('active');
    }
    
    ngAfterViewChecked(): void {
    }
    
    
    keyword: any = '';
    findData: boolean = true;
    getReview() {
      let url;
      if(this.startDate && this.endDate && this.keyword != ''){
        url = `review/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&keyword=${this.keyword}&datefrom=${this.startDate}&dateto=${this.endDate}`;
      } else if(this.startDate && this.endDate && this.keyword == '') {
        url = `review/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&datefrom=${this.startDate}&dateto=${this.endDate}`;
      } else {
        url = `review/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&keyword=${this.keyword}`;
      }
      this.apiBackend.Show(url).subscribe(
        (data: {}) => {
          this.resBackend = data;
          this.config.totalItems = this.resBackend.data.total;
          this.resBackend.data.reviews.forEach(value => {
            this.dataReview.push({
              code: value.code,
              product_name: value.product_name,
              date: moment(value.created_at).format('Do MMM YYYY'),
              created_at: value.created_at,
              customer: value.name,
              vote: value.vote,
              review: value.review,
              order_id: value.order_id,
              product_id: value.master_product_id,
            });
          });
          this.findData = true;
        },
        (err) => {
          this.findData = false;
          this.notify.showError(err);
          this.selected;
        }
        );
      }
      
      onPageChange(event) {
        this.config.currentPage = event;
        this.dataReview = [];
        this.getReview();
      }
      
      onPageSizeChange(e) {
        this.config.itemsPerPage = e.target.value;
        this.config.currentPage = 1;
        this.dataReview = [];
        this.getReview();
      }
      
      search(){
        this.dataReview = [];
        this.getReview();
      }
      
      start: any;
      end: any;
      startDate: any;
      endDate: any;
      onFilterDate(event){
        this.selected = event;
        this.start = this.selected['start'];
        this.end = this.selected['end'];
        if(this.start != null && this.end != null){
          this.startDate = moment(this.start._d.toISOString()).format('Y-MM-DD');
          this.endDate = moment(this.end._d.toISOString()).format('Y-MM-DD');
        } else {
          this.startDate = null;
          this.endDate = null;
        }
        this.config.currentPage = 1;
        this.dataReview = [];
        this.getReview();
      }
      
      deleteReview(orderId,productId){
        const deleteUrl = `review/${this.apiBackend.serviceAuth().tenant_id}/delete/${orderId}/${productId}`;
        Swal.fire({
          title: 'Hapus Review & Rating?',
          text: 'Apakah Anda yakin akan menghapus Review ini?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#FF785B',
          confirmButtonText: 'Ya, Hapus',
          cancelButtonText: 'Tidak',
        }).then((result) => {
          if (result.value) {
            this.apiBackend.Delete(deleteUrl).subscribe((data: {}) => {
              this.resBackend = data;
              if (this.resBackend.status === 200) {
                this.notify.showSuccess('Review & Rating Berhasil Dihapus')
                this.dataReview = [];
                this.config.currentPage = 1;
                this.getReview();
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
    