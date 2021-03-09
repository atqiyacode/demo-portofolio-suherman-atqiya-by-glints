import { Component,  OnInit,  TemplateRef,  ViewChild, } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';


import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';

declare let $: any;
@Component({
    selector: 'app-logo-setting',
    templateUrl: 'logo-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class LogoSettingComponent implements OnInit {

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      private notify: SweetAlertService,
    private activatedRoute: ActivatedRoute,
  ) { }

  alertError: boolean;
  logo = false;
  companyLogo: any;
  previewLogo = false;
  resBackend: any;
  errorMessage: any;
  closeResult: string;
  selectedLogo: File;
  dataImageView: string | ArrayBuffer;
  logoUrl: any;


  @ViewChild('modalLogo') public modalLogo: TemplateRef < any > ;

  ngOnInit() {
    this.getLogo();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');
    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  getLogo() {
    const url = 'tenant/' + this.apiBackend.serviceAuth().tenant_id + '/get-logo';
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.logo = true;
          this.companyLogo = this.resBackend.data.logo_url;
        } else {
          this.logo = false;
        }
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
  }

  imageLogo(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }
    this.selectedLogo = files[0] as File;
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.previewLogo = true;
      this.dataImageView = reader.result;
    };
  }
  onUploadLogo() {
    const uploadImage: any = new FormData();
    uploadImage.append('file', this.selectedLogo, this.selectedLogo.name);
    uploadImage.append('path', 'logo');
    this.apiBackend.MasterProduct(uploadImage, 'upload').subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.logoUrl = this.resBackend.data.file;
        this.onSaveLogo();
      },
      (err) => {
        this.notify.showError(err);
      }
    );
  }
  onSaveLogo(){
    let uploadImage: any = new FormData();
    const logo = this.logoUrl;
    const updateurl = 'tenant/' + this.apiBackend.serviceAuth().tenant_id + '/update-logo';
    this.apiBackend
      .Update({logo_url: logo}, updateurl)
      .subscribe(
        (data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            uploadImage = null;
            this.previewLogo = false;
            this.modalService.dismissAll(this.modalLogo);
            this.getLogo();
            this.notify.showSuccess(this.resBackend.message);
          } else {
            this.notify.showError(
                this.resBackend.message
            );
          }
        },
        (err) => {
          this.notify.showError(err);
        }
      );
  }

  openModalLogo() {
    this.modalService.open(this.modalLogo, {
        size: 'md',
        ariaLabelledBy: 'modal-logo',
        })
        .result.then(
        (result) => {
            this.closeResult = `Closed with: ${result}`;
            this.previewLogo = false;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.previewLogo = false;
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

}
