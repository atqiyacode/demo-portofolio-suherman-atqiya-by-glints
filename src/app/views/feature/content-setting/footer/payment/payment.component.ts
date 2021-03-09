import { Component,  OnInit,} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContentServiceService } from '../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../library/service/sweetalert.service';

declare let $: any;
@Component({
  selector: 'app-payment-setting',
  templateUrl: './payment.component.html',
  styleUrls: ['../../content-setting.css']
})
export class PaymentSettingComponent implements OnInit {

  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private notify: SweetAlertService,
  ) { }

  resBackend: any;
  dataBank: any = [];

  ngOnInit(): void {
    this.getBank();
    $('#collapseExample').collapse('hide');
    $('#collapseFooter').collapse('show');
    $('#landing-page').removeClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').addClass('active');
    $('#discount-page').removeClass('active');
  }

  ngAfterContentChecked() {
    
  }

  getBank() {
    const urlBank = `tenant/${this.apiBackend.serviceAuth().tenant_id}/list-bank?type=1`;
    this.apiBackend.Show(urlBank).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.resBackend.data.forEach(value => this.dataBank.push(value));
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  onBankChange(item) {
    const urlUpdateBank = `tenant/${this.apiBackend.serviceAuth().tenant_id}/update-bank`;
    this.apiBackend
      .Update({
        bank_id: item.bank_id,
        is_active: (item.is_active === true) ? 1 : 0,
      }, urlUpdateBank)
      .subscribe(
        (data: {}) => {
          this.resBackend = data;
          if (this.resBackend.status === 200) {
            this.notify.showSuccess(this.resBackend.message)
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
