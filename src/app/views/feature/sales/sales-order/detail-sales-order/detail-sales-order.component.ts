import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
@Component({
  selector: 'app-detail-sales-order',
  templateUrl: './detail-sales-order.component.html',
  styleUrls: ['./detail-sales-order.component.css']
})
export class DetailSalesOrderComponent implements OnInit {

  constructor(
    private apiBackend: ApiBackendService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.showDetail()
  }
  dataDetail: any = {}
  detailsOrder: any = []
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
  master_bank_id = 0

  showDetail() {
    let idDetail = this.activeRoute.snapshot.paramMap.get("id")
    let url = "order/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + idDetail
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataDetail = data
      this.name = this.dataDetail.data.origin.name
      this.addressDelivery = this.dataDetail.data.order.delivery_destination
      this.noOrder = this.dataDetail.data.order.order_no
      this.date = this.dataDetail.data.order.created_at
      this.subTotal = this.dataDetail.data.order.price_product
      this.priceLogistic = this.dataDetail.data.order.price_logistic
      this.serviceFee = this.dataDetail.data.order.service_fee
      this.tax = this.dataDetail.data.order.tax
      this.total = this.dataDetail.data.order.total
      this.detailsOrder = this.dataDetail.data.detail
      this.status = this.dataDetail.data.order.status
      this.master_bank_id = this.dataDetail.data.order.master_bank_id
      this.noQuotation = this.dataDetail.data.order.quotation_no
      // 1. VA 2. Kredit 3. Debit 4. Cicilan By Tenant
      if (this.dataDetail.data.payment.payment_type == 4) {
        this.payment = "Cicilan By Tenant"
      }
      if (this.dataDetail.data.payment.payment_type == 3) {
        this.payment = 'Debit Card'
      }
      if (this.dataDetail.data.payment.payment_type == 2) {
        this.payment = 'Credit Card'
      }
      if (this.dataDetail.data.payment.payment_type == 1) {
        this.payment = this.dataDetail.data.payment.bank_name + ' Virtual Account'
      }
    },
      (err) => {
        console.log(err)
      });
  }

}
