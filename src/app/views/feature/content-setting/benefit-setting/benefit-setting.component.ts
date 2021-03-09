import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
declare let $: any;
@Component({
    selector: 'app-benefit-setting',
    templateUrl: 'benefit-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class BenefitSettingComponent implements OnInit {
  dataProvit: any = [];
  resBackend: any;
  alertError = false;
  errorMessage = false;
  benefitAlert = false;

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      private modalService: NgbModal,
      private notify: SweetAlertService,
  ) { }

  ngOnInit() {
    this.getBenefit();
    $('#collapseExample').collapse('show');
    $('#collapseFooter').collapse('hide');
    $('#landing-page').addClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#discount-page').removeClass('active');
  }

  getBenefit() {
    this.dataProvit = [];
    const url = 'benefit/' + this.apiBackend.serviceAuth().tenant_id;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          let datas = this.resBackend.data;
          datas.forEach(value => this.dataProvit.push(value));
          if (datas.length < 3) {
            this.newBenefitForm();
          }
        }
      },
      (err) => {
        this.alertError = true;
        this.errorMessage = err;
      }
    );
  }

  newBenefitForm() {
    if (this.dataProvit.length === 0 || this.dataProvit.length <= 3) {
      this.dataProvit.push({
        id: null,
        benefit: null,
        desc: null,
      });
    }
  }

  removeBenefit(item, id) {
    const benefitId = id;
    if (id !== ''){
      this.deleteBenefit(benefitId);
    }
    this.dataProvit.splice(item, 1);
    this.newBenefitForm();
  }
  saveBenefit() {
    for (const data of this.dataProvit) {
      const id = data.id;
      const benefit = data.benefit;
      const desc = data.desc;
      if (id == null) {
        this.pushBenefit(benefit, desc);
      } else if (id != null && benefit != null && desc != null) {
        this.updateBenefit(id, benefit, desc);
      } else {
        this.benefitAlert = true;
      }
    }
    this.notify.showSuccess(
      this.resBackend.message
  );
    this.benefitAlert = false;
  }

  pushBenefit(benefit, desc) {
    const urlStoreBenefit =
      'benefit/' + this.apiBackend.serviceAuth().tenant_id + '/add';
    this.apiBackend
      .Update({
          benefit,
          desc,
        },
        urlStoreBenefit
      )
      .subscribe(
        (data: {}) => {
          this.resBackend = data;
        },
        (err) => {
          this.notify.showError(err);
        }
      );
  }

  updateBenefit(id, benefit, desc) {
    const urlUpdateBenefit =
      'benefit/' + this.apiBackend.serviceAuth().tenant_id + '/update/' + id;
    this.apiBackend
      .Update({
          benefit,
          desc,
        },
        urlUpdateBenefit
      )
      .subscribe(
        (data: {}) => {
          this.resBackend = data;
        },
        (err) => {
          this.alertError = true;
          this.errorMessage = err;
        }
      );
  }

  deleteBenefit(id) {
    if (id != null) {
      const urlDeleteBenefit =
        'benefit/' + this.apiBackend.serviceAuth().tenant_id + '/delete/' + id;
      this.apiBackend.Delete(urlDeleteBenefit).subscribe((data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.notify.showSuccess(
            this.resBackend.message
        );
        } else {
          this.notify.showError(
            this.resBackend.message
        );
        }
      });
    }
  }
}
