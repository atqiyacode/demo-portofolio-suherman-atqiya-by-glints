import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import * as forms from '@angular/forms';
import * as xlsx from 'xlsx';

declare let moment: any;
declare let $: any;

@Component({
    selector: 'app-subscription',
    templateUrl: 'subscription.component.html',
    styleUrls: ['../content-setting.css']
})

export class SubscriptionComponent implements OnInit {
  closeResult: string;
  
  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    private modalService: NgbModal,
    public fb: forms.FormBuilder,
    private notify: SweetAlertService,
    ) { }
  
  @ViewChild('modalSubscription') public modalSubscription: TemplateRef < any > ;
  @ViewChild('modalDeleteSubscription') public modalDeleteSubscription: TemplateRef < any > ;
  @ViewChild('subscriptionTable', { static: false }) subscriptionTable: ElementRef < any >;
    
  selected: any;

  resBackend: any;
  dataSubscription: any = [];
  detailSubscriptionId: number;
  
  pageSizes: any = [3, 5, 10, 15, 25, 50];
  config = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: null
  };

  detailItem: any = {
    messageId: '',
    messageDate: '',
    messageName: '',
    messageEmail: '',
    messageContent: '',
  }


  ngOnInit() {
    this.getSubscription();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');
    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  ngAfterViewChecked(): void {
  }

  getSubscription() {
    let subscriptionUrl;
    if(this.startDate && this.endDate){
      subscriptionUrl = `subscription/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}&datefrom=${this.startDate}&dateto=${this.endDate}`;
    } else {
      subscriptionUrl = `subscription/${this.apiBackend.serviceAuth().tenant_id}?page=${this.config.currentPage}&limit=${this.config.itemsPerPage}`;
    }
    this.apiBackend.Show(subscriptionUrl).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.config.totalItems = this.resBackend.data.total;
        this.resBackend.data.subscriptions.forEach(value => {
          this.dataSubscription.push({
            id: value.id,
            name: value.name,
            message: value.message.substring(0, 20) + '...',
            content: value.message,
            email: value.email,
            date: `${moment(value.created_at).format('L')}`,
            created_at: value.created_at
          });
        });
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }

  start: any;
  end: any;
  startDate: any;
  endDate: any;
  onFilterDate(event){
    this.selected = event;
    this.start = this.selected['start'];
    this.end = this.selected['end'];
    this.startDate = moment(this.start._d.toISOString()).format('Y-MM-Do');
    this.endDate = moment(this.end._d.toISOString()).format('Y-MM-Do');
    this.config.currentPage = 1;
    this.dataSubscription = [];
    this.getSubscription();
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.dataSubscription = [];
    this.getSubscription();
  }

  onPageSizeChange(e) {
    this.config.itemsPerPage = e.target.value;
    this.config.currentPage = 1;
    this.dataSubscription = [];
    this.getSubscription();
  }

  detailSubscription(item) {
    this.modalService.open(this.modalSubscription, {
      centered: true,
      ariaLabelledBy: 'modal-subscription',
    })
    .result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  
    this.detailItem = {
      messageId: item.id,
      messageDate: `${moment(item.created_at).format('L')} ${moment(item.created_at).format('LT')} WIB`,
      messageName: item.name,
      messageEmail: item.email,
      messageContent: item.content,
    }
  }

  confirmDeleteSubscription(id) {
    this.detailSubscriptionId = id;
    this.modalService
      .open(this.modalDeleteSubscription, {
        centered: true,
        size: 'lg',
        ariaLabelledBy: 'modal-subscription',
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

  deleteSubscription(id) {
    const url = `subscription/${this.apiBackend.serviceAuth().tenant_id}/delete/${id}`;
    Swal.fire({
      title: 'Hapus Pesan?',
      text: 'Apakah Anda yakin akan menghapus Pesan ini?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FF785B',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.value) {
        this.apiBackend.Delete(url).subscribe(
          (data: {}) => {
            this.resBackend = data;
            if (this.resBackend.status === 200) {
              this.notify.showSuccess('Pesan Berhasil Dihapus');
              this.dataSubscription = [];
              this.getSubscription();
              this.modalService.dismissAll();
            } else {
              this.notify.showError(this.resBackend.message);
            }
          },
          (err) => {
            this.notify.showError(err);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('cancelled');
      }
    });
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
    xlsx.utils.table_to_sheet(this.subscriptionTable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'subscriptionTable.xlsx');
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
