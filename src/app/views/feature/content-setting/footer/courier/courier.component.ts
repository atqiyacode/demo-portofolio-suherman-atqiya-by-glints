import { Component,  OnInit,} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContentServiceService } from '../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../library/service/sweetalert.service';

declare let $: any;
@Component({
  selector: 'app-courier-setting',
  templateUrl: './courier.component.html',
  styleUrls: ['../../content-setting.css']
})
export class CourierSettingComponent implements OnInit {

  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private notify: SweetAlertService,
  ) { }

  resBackend: any;
  dataCourier: any = [];

  ngOnInit(): void {
    this.getCourier();
    $('#collapseExample').collapse('hide');
    $('#collapseFooter').collapse('show');
    $('#landing-page').removeClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').addClass('active');
    $('#discount-page').removeClass('active');
  }

  ngAfterContentChecked() {
    
  }

  getCourier() {
    const urlCourier = `tenant/${
      this.apiBackend.serviceAuth().tenant_id
    }/list-logistic?type=1`;
    this.apiBackend.Show(urlCourier).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.resBackend.data.forEach(value => this.dataCourier.push(value));
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  onCourierChange(item) {
    if(item.master_logistic_id != 99){
      const urlUpdateCourier = `tenant/${this.apiBackend.serviceAuth().tenant_id}/update-logistic?type=1`;
      this.apiBackend
        .Update({
          master_logistic_id: item.master_logistic_id,
          is_active: (item.is_active === true) ? 1 : 0,
        }, urlUpdateCourier)
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
    } else {
      this.dataCourier = [];
      this.notify.showError('Jasa Tenant Harus Aktif');
      this.getCourier();
    }
  }

}
