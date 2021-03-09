import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
@Component({
  selector: 'app-detail-retur-order',
  templateUrl: './detail-retur-order.component.html',
  styleUrls: ['./detail-retur-order.component.css']
})
export class DetailReturOrderComponent implements OnInit {

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
  noOrder = ""
  noReturn = ""
  date = ""
  dateReturn = ""
  subTotal = ""
  priceLogistic = ""
  serviceFee = ""
  tax = ""
  total = ""
  payment = ""
  status = 0

  showDetail() {
    let idDetail = this.activeRoute.snapshot.paramMap.get("id")
    let url = "return/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + idDetail
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataDetail = data
      this.name = this.dataDetail.data.member.name
      this.addressDelivery = this.dataDetail.data.address.address
      this.noOrder = this.dataDetail.data.order_no
      this.noReturn = this.dataDetail.data.order_return.order_return_no
      this.date = this.dataDetail.data.order_return.accepted_at
      this.dateReturn = this.dataDetail.data.delivery_date
      // this.subTotal = this.dataDetail.data.order.price_product
      // this.priceLogistic = this.dataDetail.data.order.price_logistic
      // this.serviceFee = this.dataDetail.data.order.service_fee
      // this.tax = this.dataDetail.data.order.tax
      // this.total = this.dataDetail.data.order.total
      this.detailsOrder = this.dataDetail.data.detail
      this.status = this.dataDetail.data.order_return.status
    },
      (err) => {
      });
  }

}
