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
  selector: 'app-form-supplier',
  templateUrl: './form-supplier.component.html',
  styleUrls: ['./form-supplier.component.css']
})
export class FormSupplierComponent implements OnInit, AfterViewInit, AfterViewChecked {

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

  dataApiSupplier: any = {}
  responseBackend: any = {}
  idSupplier = 0
  btnSupplierActive = 1
  tableSupplier = false

  /*FORM SUPPLIER */
  formSupplier = this.fb.group({
    tenant_id: [''],
    code: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]],
    phone: ['', Validators.required],
    location: ['', Validators.required],
    address: ['', Validators.required],
    postalcode: ['', Validators.required],
    is_active: [1],
    bank: [null],
  })
  formBank = this.fb.group({
    id: 0,
    master_bank_id: [null],
    accountno: [null],
    accountname: [null]
  })
  /*END FORM */

  ngOnInit() {
    this.getAllSupplier()
  }
  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.paginationSupplier(this.paginationAccount.type)
    }
  }

  /*MODAL */
  @ViewChild('modalSupplier') public modalSupplier: TemplateRef<any>;
  closeResult = ''
  openModalSupplier(id) {
    this.btnSupplierActive = id
    this.getBank()
    if (this.btnSupplierActive == 1) {
      this.formSupplier.reset()
      this.formBank.reset()
      this.formSupplier.get('is_active').setValue(1)
    }
    if (this.btnSupplierActive == 1 || this.btnSupplierActive == 2) {
      this.formSupplier.enable()
      this.formBank.enable()
    }
    if (this.btnSupplierActive == 3) {
      this.formSupplier.disable()
      this.formBank.disable()
    }
    this.modalService.open(this.modalSupplier,
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

  /*API LIST  */
  getAllSupplier() {
    this.apiBackend.Get("supplier").subscribe((data: {}) => {
      this.dataApiSupplier = data
      if (this.dataApiSupplier.data.data.length > 0) {
        this.tableSupplier = true
      }
    },
      (err) => {
        console.log(err)
      });
  }
  /*API BANK */
  dataBank: any = {}
  getBank() {
    this.apiBackend.GetSearch("bank").subscribe((data: {}) => {
      this.dataBank = data
    },
      (err) => {
      });
  }
  /*CODE AND GENERATE CODE*/
  codeSupplier: any = {}
  setCodeSupplier(val) {
    if (this.btnSupplierActive == 1) {
      if (val.target.value.charAt(0)) {
        this.genCodeSupplier(val.target.value)
      }
    }

  }
  genCodeSupplier(val) {
    this.apiBackend.GenerateCodeSupplier().subscribe((data: {}) => {
      this.codeSupplier = data
      this.formSupplier.get('code').setValue("SUPPLIER-" + val.charAt(0).toUpperCase() + '-' + this.codeSupplier.data)
    },
      (err) => {
        console.log(err)
      });
  }

  /*CRUD */
  /*CREATE */
  saveSupplier() {
    this.formSupplier.markAllAsTouched()
    if (this.formSupplier.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masih ada input yang kosong',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    if (_.isNull(this.formBank.get('master_bank_id').value) && _.isNull(this.formBank.get('accountno').value)
      && _.isNull(this.formBank.get('accountname').value)) {
      this.formSupplier.get('bank').setValue({})
    } else {
      this.formSupplier.get('bank').setValue(this.formBank.value)
    }

    this.formSupplier.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    let url = 'store-supplier'
    this.apiBackend.Create(this.formSupplier.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Sukses tambah supplier',
          showConfirmButton: false,
          timer: 2000
        })
        this.modalService.dismissAll()
        this.getAllSupplier()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal tambah supplier',
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
          timer: 2000
        })
      });
  }

  /*SHOW BY ID */
  showByIdSupplier(type, id) {
    this.idSupplier = id
    this.apiBackend.Show("supplier/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      let val = this.responseBackend['data']
      this.formSupplier.get('tenant_id').setValue(val['tenant_id'])
      this.formSupplier.get('name').setValue(val['name'])
      this.formSupplier.get('email').setValue(val['email'])
      this.formSupplier.get('phone').setValue(val['phone'])
      this.formSupplier.get('address').setValue(val['address'])
      this.formSupplier.get('postalcode').setValue(val['postalcode'])
      this.formSupplier.get('is_active').setValue(val['is_active'])
      this.formSupplier.get('code').setValue(val['code'])
      this.formSupplier.get('location').setValue(val['location'])
      if (val['bank'].length > 0) {
        this.formBank.get('id').setValue(val['bank'][0]['id'])
        this.formBank.get('master_bank_id').setValue(val['bank'][0]['master_bank_id'])
        this.formBank.get('accountno').setValue(val['bank'][0]['accountno'])
        this.formBank.get('accountname').setValue(val['bank'][0]['accountname'])
      }
      this.openModalSupplier(type)
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
  /*UPDATE */
  updateSupplier() {
    this.formSupplier.markAllAsTouched()
    if (this.formSupplier.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Masih ada input yang kosong',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    if (_.isNull(this.formBank.get('master_bank_id').value) && _.isNull(this.formBank.get('accountno').value)
      && _.isNull(this.formBank.get('accountname').value)) {
      this.formSupplier.get('bank').setValue({})
    } else {
      this.formSupplier.get('bank').setValue(this.formBank.value)
    }

    let url = 'update-supplier/' + this.idSupplier
    this.apiBackend.Create(this.formSupplier.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Sukses edit supplier',
          showConfirmButton: false,
          timer: 2000
        })
        this.modalService.dismissAll()
        this.getAllSupplier()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal edit supplier',
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
          timer: 2000
        })
      });
  }
  deleteSupplier() {
    this.apiBackend.Delete('delete-supplier/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idSupplier).subscribe((rsp: {}) => {
      this.responseBackend = rsp
      if (this.responseBackend.status == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Sukses hapus supplier',
          showConfirmButton: false,
          timer: 2000
        })
        this.modalService.dismissAll()
        this.getAllSupplier()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal hapus supplier',
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
          timer: 2000
        })
      });
  }

  /*PAGINATION */
  paginationSupplier(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
    if (type == 1) {
      this.ngOnInit()
    } else if (type == 2) {
      urlPagination = this.dataApiSupplier.data.prev_page_url
    } else if (type == 3) {
      urlPagination = this.dataApiSupplier.data.next_page_url
    } else {
      urlPagination = this.dataApiSupplier.data.last_page_url
    }
    if (type > 1) {
      this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
        this.dataApiSupplier = data
      },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
            showConfirmButton: false,
            timer: 2000
          })
        });
    }
  }
}
