import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
@Component({
  selector: 'app-detail-sales-quotation',
  templateUrl: './detail-sales-quotation.component.html',
  styleUrls: ['./detail-sales-quotation.component.css']
})
export class DetailSalesQuotationComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.showDetail()
  }
  dataDetail: any = {}
  detailsQuotation: any = []
  name = ""
  addressDelivery = ""
  noQuotation = ""
  noOrder = ""
  date = ""
  subTotal = ""
  priceLogistic = ""
  serviceFee = ""
  tax = ""
  total = ""
  payment = ""
  status = 0

  showDetail() {
    let idDetail = this.activeRoute.snapshot.paramMap.get("id")
    let url = "quotation/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + idDetail
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataDetail = data
      this.name = this.dataDetail.data.origin.name
      this.addressDelivery = this.dataDetail.data.destination.address + ' ' + this.dataDetail.data.destination.location
      this.noQuotation = this.dataDetail.data.quotation.quotation_no
      this.date = this.dataDetail.data.quotation.quotation_date
      this.subTotal = this.dataDetail.data.quotation.price_product
      this.priceLogistic = this.dataDetail.data.quotation.price_logistic
      this.serviceFee = this.dataDetail.data.quotation.service_fee
      this.tax = this.dataDetail.data.quotation.tax
      this.total = this.dataDetail.data.quotation.total
      this.detailsQuotation = this.dataDetail.data.detail
      this.status = this.dataDetail.data.quotation.is_approved
    },
      (err) => {
        console.log(err)
      });
  }

}
