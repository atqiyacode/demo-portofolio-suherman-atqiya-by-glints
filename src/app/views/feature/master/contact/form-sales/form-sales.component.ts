import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as _ from 'lodash';

import { MasterService } from "../../../../library/service/master.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { NotificationService } from "../../../../library/service/notification.service";

@Component({
  selector: 'app-form-sales',
  templateUrl: './form-sales.component.html',
  styleUrls: ['./form-sales.component.css']
})
export class FormSalesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private notify: NotificationService,
    public serviceConfig: MasterService,
    private router: Router,
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent

  dataApiSales: any = {}
  responseBackend: any = {}
  addresses: any = []
  idSales = 0
  btnSalesActive = 1
  tableSales = false

  /*FORM SALES */
  formSales = this.fb.group({
    tenant_id: [''],
    name: ['', Validators.required],
    code: [null, Validators.required],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]],
    phone: ['', Validators.required],
    is_active: [true],
    addresses: [''],
  })
  formAddress = this.fb.group({
    id: [0],
    address: [null, Validators.required],
    location: [null, Validators.required],
    postalcode: [null, Validators.required],
    location_id: [null, Validators.required],
    raw: [null, Validators.required],
  })
  /*END */

  ngOnInit() {
    this.getAllSales()
  }
  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.paginationSales(this.paginationAccount.type)
    }
  }

  /*MODAL */
  @ViewChild('modalSales') public modalSales: TemplateRef<any>;
  closeResult = ''
  openModalSales(id) {
    this.btnSalesActive = id
    if (this.btnSalesActive == 1) {
      this.formSales.reset()
      this.formAddress.reset()
      this.formSales.get('is_active').setValue(1)
    }
    if (this.btnSalesActive == 1 || this.btnSalesActive == 2) {
      this.formSales.enable()
      this.formAddress.enable()
    }
    if (this.btnSalesActive == 3 || this.btnSalesActive == 4) {
      this.formSales.disable()
      this.formAddress.disable()
    }
    this.modalService.open(this.modalSales,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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
  /*END MODAL */

  /*API LIST SALES */
  getAllSales() {
    this.apiBackend.Get("sales").subscribe((data: {}) => {
      this.dataApiSales = data
      if (this.dataApiSales.data.data.length > 0) {
        this.tableSales = true
      }
    },
      (err) => {

      });
  }
  /*CODE AND GENERATE CODE*/
  codeSales: any = {}
  setCodeSales(val) {
    if (this.btnSalesActive == 1) {
      if (val.target.value.charAt(0)) {
        this.genCodeSales(val.target.value)
      }
    }

  }
  genCodeSales(val) {
    this.apiBackend.GenerateCodeSales().subscribe((data: {}) => {
      this.codeSales = data
      this.formSales.get('code').setValue("SALES-" + val.charAt(0).toUpperCase() + '-' + this.codeSales.data)
    },
      (err) => {
      });
  }

  /*LOCATION */
  dropdownSelectSales = false
  dataSelectLocationSales: any = {}
  searchLocationSales(e) {
    if (e.target.value.length > 3) {
      this.apiBackend.SearchLocation(e.target.value).subscribe((data: {}) => {
        this.dataSelectLocationSales = data
        this.dropdownSelectSales = true
      },
        (err) => {
          console.log(err)
        });
    }
  }
  setLocationSales(e) {
    let codePos = e['value'].split("|")
    let addr = e['area_name'] + ', ' + e['suburb_name'] + ', ' + e['city_name'] + ', ' + e['province']
    this.formAddress.get('location').setValue(addr)
    this.formAddress.get('postalcode').setValue(codePos[0])
    this.formAddress.get('location_id').setValue(e['value'])
    this.formAddress.get('raw').setValue(JSON.stringify(e))
    this.dropdownSelectSales = false
  }

  /*CRUD */
  /*SAVE */
  saveSales() {
    this.formSales.markAllAsTouched()
    this.formAddress.markAllAsTouched()
    if (this.formSales.invalid || this.formAddress.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masih ada input yang kosong',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    this.formSales.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    this.formSales.get('addresses').setValue(this.formAddress.value)
    let url = 'store-sales'
    this.apiBackend.Create(this.formSales.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        if (this.responseBackend.notification == true) {
          Swal.fire({
            icon: 'success',
            text: 'Sukses kirim ke email customer dan tambah customer',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal kirim ke email customer',
            showConfirmButton: false,
            timer: 2000
          })
        }
        this.modalService.dismissAll()
        this.getAllSales()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal tambah sales',
          showConfirmButton: false,
          timer: 2000
        })
      }
    },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
          showConfirmButton: false,
          timer: 3000
        })
      });
  }

  /*SHOW BY ID */
  showByIdSales(type, id) {
    this.idSales = id
    this.apiBackend.Show("sales/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      let val = this.responseBackend['data']
      this.formSales.get('tenant_id').setValue(val['tenant_id'])
      this.formSales.get('name').setValue(val['name'])
      this.formSales.get('code').setValue(val['code'])
      this.formSales.get('email').setValue(val['email'])
      this.formSales.get('phone').setValue(val['phone'])
      this.formSales.get('is_active').setValue(val['is_active'])
      if (val['address'].length != 0) {
        let parse = JSON.parse(val['address'][0]['raw'])

        this.formAddress.get('id').setValue(val['address'][0]['id'])
        this.formAddress.get('address').setValue(val['address'][0]['address'])
        this.formAddress.get('location').setValue(parse['label'])
        this.formAddress.get('postalcode').setValue(val['address'][0]['postalcode'])
        this.formAddress.get('location_id').setValue(parse['value'])
        this.formAddress.get('raw').setValue(parse)
      }
      this.openModalSales(type)

    },
      (err) => {
      });
  }

  /*UPDATE */
  updateSales() {
    this.formSales.markAllAsTouched()
    this.formAddress.markAllAsTouched()
    if (this.formSales.invalid || this.formAddress.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masih ada input yang kosong',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }

    this.formSales.get('addresses').setValue(this.formAddress.value)
    let url = 'sales/' + this.apiBackend.serviceAuth()['tenant_id'] + '/update/' + this.idSales
    this.apiBackend.Create(this.formSales.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Sukses update sales',
          showConfirmButton: false,
          timer: 2000
        })
        this.modalService.dismissAll()
        this.getAllSales()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal update sales',
          showConfirmButton: false,
          timer: 2000
        })
      }
    },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
          showConfirmButton: false,
          timer: 3000
        })
      });
  }

  /*DELETE */
  deleteSales() {
    let url = 'delete-sales/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idSales
    this.apiBackend.Delete(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Sukses hapus sales',
          showConfirmButton: false,
          timer: 2000
        })
        this.modalService.dismissAll()
        this.getAllSales()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal hapus sales',
          showConfirmButton: false,
          timer: 2000
        })
      }
    },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
          showConfirmButton: false,
          timer: 2500
        })
      });
  }

  /*PAGINATION */
  paginationSales(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
    if (type == 1) {
      this.ngOnInit()
    } else if (type == 2) {
      urlPagination = this.dataApiSales.data.prev_page_url
    } else if (type == 3) {
      urlPagination = this.dataApiSales.data.next_page_url
    } else {
      urlPagination = this.dataApiSales.data.last_page_url
    }
    if (type > 1) {
      this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
        this.dataApiSales = data
      },
        (err) => {
          console.log(err)
        });
    }
  }
}
