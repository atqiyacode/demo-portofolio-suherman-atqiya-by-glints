import { Component, OnInit} from '@angular/core';
import * as forms from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentServiceService } from '../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../library/service/sweetalert.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare let $: any;
declare let moment: any;
@Component({
    selector: 'app-discount-setting',
    templateUrl: 'discount-setting.component.html',
    styleUrls: ['../content-setting.css']
})

export class DiscountSettingComponent implements OnInit {

  constructor(
      public content: ContentServiceService,
      private apiBackend: ApiBackendService,
      public fb: forms.FormBuilder,
      private notify: SweetAlertService,
      private router:Router,
      private activated: ActivatedRoute,
  ) { }

  resBackend: any;
  dataDiscount: any = [];
  discountStatus: any;
  discountPageSizes: any = [3, 5, 10, 15, 25, 50];

  config = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: null
  };
  active: any;
  ngOnInit() {
    this.router.navigate(['/all-discount'])
    $('#discount-page').addClass('active');
    $('#landing-page').removeClass('active');
    $('#footer-page').removeClass('active');
    $('#promo-page').removeClass('active');
  }

}
