import { Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit, 
  AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { InventoryService } from "../../../../library/service/inventory.service";
import { NotificationService } from "../../../../library/service/notification.service";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { Route } from '@angular/compiler/src/core';
@Component({
  selector: 'app-form-logistics',
  templateUrl: './form-logistics.component.html',
  styleUrls: ['./form-logistics.component.css']
})
export class FormLogisticsComponent implements OnInit, AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    public notify : NotificationService,
    public attribute: InventoryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public menuService:MenuDashboardService,
  ) { }

  formLogistic = this.fb.group({
    nama_kurir: [null],
    jenis_pengiriman: [null],
    tenant_id:['']
  })
  master_logistic_id = new FormControl()
  attributeProduct = this.attribute.configLogistics()
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-logistic']
  response_backend:any={}
  dataCourier:any={}
  dataDelivery:any={}
  titleCreate = true
  titleUpdate = false
  btnCreate = true
  btnUpdate = false
  urlApiMaster = ""

  errorMessage = ""
  alertError = false

  ngOnInit(){
    if (this.activeRoute.snapshot.paramMap.get("id") != null) {
      this.showById(this.activeRoute.snapshot.paramMap.get("id"))
      this.titleCreate = false
      this.titleUpdate = true
      this.btnCreate = false
      this.btnUpdate = true
    }
    this.courier()
  }
  ngAfterContentChecked() {
    this.menuBreadcrumb[2]['img']="true"
    this.menuBreadcrumb[2]['color']="#696969"
    this.menuBreadcrumb[3]['active']="true"
    this.menuBreadcrumb[3]['color']="#1c100b"
  }
  courier() {
    this.urlApiMaster = "courier"
    this.apiBackend.Show(this.urlApiMaster).subscribe((data: {}) => { 
      this.dataCourier = data
      // console.log(this.dataCourier)
    },
    (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    });
  }
  changeCourier(e) {
    if (e == null) {
      this.dataDelivery = {}
    }
    for (let index = 0; index < this.dataCourier.data.length; index++) {
      if (this.dataCourier.data[index]['name'] == e) {
        this.urlApiMaster = "courier/"+this.dataCourier.data[index]['id']
        this.apiBackend.Show(this.urlApiMaster).subscribe((data: {}) => { 
          this.dataDelivery = data
          console.log(this.dataDelivery)
        },
        (err) => {
          console.log(err)
      this.alertError = true
      this.errorMessage = err
        });
      }
    }
  }
  submitSave(){
    this.formLogistic.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    this.urlApiMaster = "store-logistic"
    this.apiBackend.Create(this.formLogistic.value,this.urlApiMaster).subscribe((data: {}) => { 
      this.response_backend = data
      if (this.response_backend.status == 200) {
        this.notify.showSuccess("Data Has been Insert !!", "ACCOUNTING SYSTEM")
        this.router.navigate(['/dashboard-inventory/logistics-data'])
      } else {
        this.notify.showError("Data Failed To Save !!", "ACCOUNTING SYSTEM")
      }
      console.log(this.response_backend)
    },
    (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    });
  }
  showById(id) {
    this.urlApiMaster = "logistic/"+this.apiBackend.serviceAuth()['tenant_id']+'/'+id
    this.apiBackend.Show(this.urlApiMaster).subscribe((data: {}) => { 
      this.response_backend = data
      let dummy =[]
      for (let index = 0; index < this.response_backend.data[0]['logistic_type'].length; index++) {
        dummy.push(this.response_backend.data[0]['logistic_type'][index]['jenis_pengiriman'])
      }
      this.formLogistic.get('nama_kurir').setValue(this.response_backend.data[0]['nama_kurir'])
      this.formLogistic.get('jenis_pengiriman').setValue(dummy)
    },
    (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    });
  }
  submitUpdate(){
    this.formLogistic.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    this.urlApiMaster = "update-logistic/"+this.activeRoute.snapshot.paramMap.get("id")
    console.log(this.formLogistic.value)
    this.apiBackend.Update(this.formLogistic.value,this.urlApiMaster).subscribe((data: {}) => { 
      this.response_backend = data
      if (this.response_backend.status == 200) {
        this.notify.showSuccess("Data Has been Update !!", "ACCOUNTING SYSTEM")
        this.router.navigate(['/dashboard-inventory/logistics-data'])
      } else {
        this.notify.showError("Data Failed To Update !!", "ACCOUNTING SYSTEM")
      }
      console.log(this.response_backend)
    },
    (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
    });
  }

}
