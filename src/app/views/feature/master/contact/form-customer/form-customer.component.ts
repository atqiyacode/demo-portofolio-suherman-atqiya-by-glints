import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { MasterService } from "../../../../library/service/master.service";
import { ApiBackendService } from "../../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../../library/service/menu-dashboard.service";
import { SweetAlertService } from "../../../../library/service/sweetalert.service";

@Component({
  selector: 'app-form-customer',
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.css']
})
export class FormCustomerComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private alert: SweetAlertService,
    public serviceConfig: MasterService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent

  dataApiCustomer: any = {}
  responseBackend: any = {}
  addresses: any = []
  idCustomer = 0
  btnCustomerActive = 1
  tableCustomer = false
  quosioner: any = {}

  /*FORM CUSTOMER */
  formCreateCustomer = this.fb.group({
    tenant_id: [''],
    pic_name: ['', Validators.required],
    pic_phone: ['', Validators.required],
    name: ['', Validators.required],
    company_name: [''],
    code: new FormControl('', Validators.required),
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]],
    phone: ['', Validators.required],
    has_npwp: ['', Validators.required],
    npwp_no: [''],
    established: [''],
    is_customer: ['', Validators.required],
    master_sales_id: [null],
    bank: [null],
    addresses: [null],
    is_active: [1],
    cicilan_by_tenant: [0],
  })
  formSetStatusCustomer = this.fb.group({
    is_approved: [null],
  })
  formAddressCompany = this.fb.group({
    id: 0,
    location: [null],
    location_id: [null],
    recipient_name: [null],
    raw: [null],
    notes: [null],
    phone: [null],
    address: [null],
    street: [null, Validators.required],
    place_name: [null, Validators.required],
    rt: [null, Validators.required],
    rw: [null, Validators.required],
    kelurahan: [null, Validators.required],
    kecamatan: [null, Validators.required],
    city: [null, Validators.required],
    province: [null, Validators.required],
    postalcode: [null, Validators.required],
    is_delivery_address: [0],
  })
  formAddressDelivery = this.fb.group({
    id: 0,
    location: [null, Validators.required],
    location_id: [null, Validators.required],
    recipient_name: [null, Validators.required],
    address: [null, Validators.required],
    phone: [null, Validators.required],
    postalcode: [null, Validators.required],
    raw: [null, Validators.required],
    notes: [null],
    is_delivery_address: [1],
  })
  formBank = this.fb.group({
    id: 0,
    master_bank_id: [null],
    accountno: [null],
    accountname: [null]
  })
  /*END FORM */

  ngOnInit() {
    this.getAllCustomer()
    for (let index = 0; index < 2; index++) {
      this.addresses.push({
        location: null, location_id: null, recipient_name: null, address: null, phone: null, postalcode: null,
        raw: null, notes: null, is_delivery_address: null
      })
    }
    this.quosioner['data'] = [{ id: 1, name: 'Ya' }, { id: 0, name: 'Tidak' }]
    this.formCreateCustomer.get('has_npwp').valueChanges.subscribe(change => {
      if (change == 1) {
        this.formCreateCustomer.get('npwp_no').setValidators(Validators.required)
      } else {
        this.formCreateCustomer.get('npwp_no').setValidators(null)
      }
      this.formCreateCustomer.get('npwp_no').updateValueAndValidity()
    })

    // this.router.events.pipe(
    // filter(event => event instanceof NavigationEnd),)
    // .subscribe(() => {
    //   var rt = this.getChild(this.activatedRoute)
    //   rt.data.subscribe(data => {
    //     console.log(data);
    //     this.titleService.setTitle(data.title)})
    // })
  }
  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.onPaginationCustomer(this.paginationAccount.type)
    }
  }

  /*CHILD ROUTE */
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

  /*MODAL */
  @ViewChild('modalCustomer') public modalCustomer: TemplateRef<any>;
  closeResult = ''
  openModalCustomer(id) {
    this.btnCustomerActive = id
    this.getSales()
    this.getBank()
    if (this.btnCustomerActive == 1) {
      this.formCreateCustomer.reset()
      this.formAddressCompany.reset()
      this.formAddressDelivery.reset()
      this.formBank.reset()
      this.formCreateCustomer.get('is_active').setValue(1)
    }
    if (this.btnCustomerActive == 1 || this.btnCustomerActive == 2) {
      this.formCreateCustomer.enable()
      this.formAddressCompany.enable()
      this.formAddressDelivery.enable()
      this.formBank.enable()
    }
    if (this.btnCustomerActive == 3 || this.btnCustomerActive == 4) {
      this.formCreateCustomer.disable()
      this.formAddressCompany.disable()
      this.formAddressDelivery.disable()
      this.formBank.disable()
    }
    this.modalService.open(this.modalCustomer,
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

  /*API LIST CUSTOMER */
  getAllCustomer() {
    this.apiBackend.Get("member").subscribe((data: {}) => {
      this.dataApiCustomer = data
      if (this.dataApiCustomer.data.data.length > 0) {
        this.tableCustomer = true
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
  /*API SALES */
  dataSales: any = {}
  getSales() {
    this.apiBackend.Get("sales-list").subscribe((data: {}) => {
      this.dataSales = data
    },
      (err) => {
        console.log(err)
      });
  }
  /*CODE AND GENERATE CODE*/
  codeCustomer: any = {}
  setCodeCust(val) {
    if (this.btnCustomerActive == 1) {
      if (val.target.value.charAt(0)) {
        this.genCodeCustomer(val.target.value)
      }
    }

  }
  genCodeCustomer(val) {
    this.apiBackend.GenerateCodeMember().subscribe((data: {}) => {
      this.codeCustomer = data
      this.formCreateCustomer.get('code').setValue("CUST-" + val.charAt(0).toUpperCase() + '-' + this.codeCustomer.data)
    },
      (err) => {
        console.log(err)
      });
  }

  /*LOCATION */
  dropdownSelect = false
  dropdownSelect2 = false
  dataSelectLocation: any = {}
  dataSelectLocationDlv: any = {}
  searchLocation(type, e) {
    if (e.target.value.length > 3) {
      this.apiBackend.SearchLocation(e.target.value).subscribe((data: {}) => {

        if (type == 1) {
          this.dataSelectLocation = data
          this.dropdownSelect = true
        } else {
          this.dataSelectLocationDlv = data
          this.dropdownSelect2 = true
        }

      },
        (err) => {
          console.log(err)
        });
    } else {
      if (type == 1) {
        this.dropdownSelect = false
      } else {
        this.dropdownSelect2 = false
      }
    }
  }
  setValLocationCust(e) {
    let codePos = e['value'].split("|")
    let addr = e['area_name'] + ', ' + e['suburb_name'] + ', ' + e['city_name'] + ', ' + e['province']

    this.addresses[1]['location'] = addr
    this.addresses[1]['location_id'] = e['value']
    this.addresses[1]['postalcode'] = codePos[0]
    this.addresses[1]['raw'] = JSON.stringify(e)
    this.dropdownSelect = false
  }
  setValLocationCustDlv(e) {
    let codePos = e['value'].split("|")
    let addr = e['area_name'] + ', ' + e['suburb_name'] + ', ' + e['city_name'] + ', ' + e['province']
    this.formAddressDelivery.get('location').setValue(addr)
    this.formAddressDelivery.get('location_id').setValue(e['value'])
    this.formAddressDelivery.get('raw').setValue(JSON.stringify(e))
    this.formAddressDelivery.get('postalcode').setValue(codePos[0])
    this.dropdownSelect2 = false
  }

  /*CRUD CUSTOMER */
  /*SAVE */
  saveCustomer() {
    this.formCreateCustomer.markAllAsTouched()
    this.formAddressCompany.markAllAsTouched()
    this.formAddressDelivery.markAllAsTouched()
    if (this.formCreateCustomer.invalid || this.formAddressCompany.invalid || this.formAddressDelivery.invalid) {
      this.alert.showError('Masih ada input yang kosong')
      return;
    }
    if (_.isNull(this.formBank.get('master_bank_id').value) && _.isNull(this.formBank.get('accountno').value)
      && _.isNull(this.formBank.get('accountname').value)) {
      this.formCreateCustomer.get('bank').setValue({})
    } else {
      this.formCreateCustomer.get('bank').setValue(this.formBank.value)
    }

    let addr = []
    addr.push(this.formAddressDelivery.value)
    addr.push(this.formAddressCompany.value)

    this.formCreateCustomer.get('addresses').setValue(addr)
    this.formCreateCustomer.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    let url = 'store-member'
    this.apiBackend.Create(this.formCreateCustomer.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        if (this.responseBackend.notification == true) {
          this.alert.showSuccess('Sukses kirim ke email customer dan tambah customer')
        } else {
          this.alert.showError('Gagal kirim ke email customer')
        }
        this.modalService.dismissAll()
        this.getAllCustomer()
      } else {
        this.alert.showError('Gagal tambah customer')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*SHOW BY ID */
  typeData = 2
  showByIdCustomer(type, id) {
    this.idCustomer = id

    this.apiBackend.Show("member/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      let val = this.responseBackend['data']
      this.typeData = val.register_from
      this.formCreateCustomer.patchValue({
        tenant_id: val.tenant_id,
        pic_name: val.pic_name,
        pic_phone: val.pic_phone,
        name: val.name,
        company_name: val.company_name,
        code: val.code,
        email: val.email,
        phone: val.phone,
        has_npwp: val.has_npwp,
        npwp_no: val.npwp_no,
        established: val.established,
        is_customer: val.is_customer,
        master_sales_id: val.master_sales_id,
        is_active: val.is_active,
        cicilan_by_tenant: val.cicilan_by_tenant,
      })

      this.formAddressCompany.patchValue({
        id: val.address[1].id,
        notes: val.address[1].notes,
        street: val.address[1].street,
        place_name: val.address[1].place_name,
        rt: val.address[1].rt,
        rw: val.address[1].rw,
        kelurahan: val.address[1].kelurahan,
        kecamatan: val.address[1].kecamatan,
        city: val.address[1].city,
        province: val.address[1].province,
        postalcode: val.address[1].postalcode,
        is_delivery_address: [0],
      })

      this.formAddressDelivery.patchValue({
        id: val.address[0].id,
        location: val.address[0].location,
        location_id: val.address[0].location_id,
        recipient_name: val.address[0].recipient_name,
        address: val.address[0].address,
        phone: val.address[0].phone,
        postalcode: val.address[0].postalcode,
        raw: val.address[0].raw,
        notes: val.address[0].notes,
        is_delivery_address: [1],
      })

      if (val['bank'].length > 0) {
        this.formBank.setValue({
          id: val['bank'][0]['id'],
          master_bank_id: val['bank'][0]['master_bank_id'],
          accountno: val['bank'][0]['accountno'],
          accountname: val['bank'][0]['accountname'],
        })
      }

      let idAct = type
      if (val['is_approved'] == 0) {
        if (type != 3) {
          idAct = 4
        }
      }
      this.openModalCustomer(idAct)
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*UPADATE */
  updateCustomer() {
    this.formCreateCustomer.markAllAsTouched()
    this.formAddressCompany.markAllAsTouched()
    this.formAddressDelivery.markAllAsTouched()
    if (this.formCreateCustomer.invalid || this.formAddressCompany.invalid || this.formAddressDelivery.invalid) {
      this.alert.showError('Masih ada input yang kosong')
      return;
    }
    if (_.isNull(this.formBank.get('master_bank_id').value) && _.isNull(this.formBank.get('accountno').value)
      && _.isNull(this.formBank.get('accountname').value)) {
      this.formCreateCustomer.get('bank').setValue({})
    } else {
      this.formCreateCustomer.get('bank').setValue(this.formBank.value)
    }

    let addr = []
    addr.push(this.formAddressDelivery.value)
    addr.push(this.formAddressCompany.value)
    this.formCreateCustomer.get('addresses').setValue(addr)

    let url = 'member/' + this.apiBackend.serviceAuth()['tenant_id'] + '/update/' + this.idCustomer
    this.apiBackend.Create(this.formCreateCustomer.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses update customer')
        this.modalService.dismissAll()
        this.getAllCustomer()
      } else {
        this.alert.showError('Gagal update customer')
      }

    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*DELETE */
  deleteCustomer() {
    this.btnCustomerActive = 1
    let url = 'delete-member/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idCustomer
    this.apiBackend.Delete(url).subscribe((rsp: {}) => {
      this.responseBackend = rsp
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses Delete Customer')
        this.modalService.dismissAll()
        this.getAllCustomer()
      } else {
        this.alert.showError('Gagal Delete Customer')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*APPROVED REJECTED */
  setStatusCustomer(type) {
    let id = this.idCustomer
    this.formSetStatusCustomer.get('is_approved').setValue(type)
    this.apiBackend.MemberByEc(id, this.formSetStatusCustomer.value).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses update status customer')
        this.modalService.dismissAll()
        this.getAllCustomer()
      } else {
        this.alert.showError('Gagal update status customer')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*PAGINATION */
  onPaginationCustomer(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
    if (type == 1) {
      this.ngOnInit()
    } else if (type == 2) {
      urlPagination = this.dataApiCustomer.data.prev_page_url
    } else if (type == 3) {
      urlPagination = this.dataApiCustomer.data.next_page_url
    } else {
      urlPagination = this.dataApiCustomer.data.last_page_url
    }
    if (type > 1) {
      this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
        this.dataApiCustomer = data
      },
        (err) => {
          this.alert.showError(err)
        });
    }
  }
}
