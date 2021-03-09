import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
@Component({
  selector: 'app-detail-return-goods-delivery',
  templateUrl: './detail-return-goods-delivery.component.html',
  styleUrls: ['./detail-return-goods-delivery.component.css']
})
export class DetailReturnGoodsDeliveryComponent implements OnInit {

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
  noDo = ""
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
    let url = "do-return/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + idDetail
    this.apiBackend.GetSearch(url).subscribe((data: {}) => {
      this.dataDetail = data
      let addr = this.dataDetail.data.destination.address + ' ' + this.dataDetail.data.destination.location
      this.name = this.dataDetail.data.origin.name
      this.addressDelivery = addr
      this.noDo = this.dataDetail.data.order.no_do
      this.noOrder = this.dataDetail.data.order.order_return_no
      this.date = this.dataDetail.data.order.accepted_at
      this.dateReturn = this.dataDetail.data.order.delivery_date
      this.subTotal = this.dataDetail.data.order.price_product
      this.priceLogistic = this.dataDetail.data.order.price_logistic
      this.serviceFee = this.dataDetail.data.order.service_fee
      this.tax = this.dataDetail.data.order.tax
      this.total = this.dataDetail.data.order.total
      this.detailsOrder = this.dataDetail.data.detail
      this.status = this.dataDetail.data.order.status

    },
      (err) => {
      });
  }

}
