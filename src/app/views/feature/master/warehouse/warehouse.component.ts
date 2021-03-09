import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { SalesService } from "../../../library/service/sales.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { SweetAlertService } from "../../../library/service/sweetalert.service";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    public salesService: SalesService,
    private router: Router,
    private alert: SweetAlertService,
  ) { }

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent
  @ViewChild('modal') public templateref: TemplateRef<any>;

  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url + "/create-quotation"
  configMenuDashboard = this.menuService.menu()
  configAttribute = this.salesService.configSalesOrder()
  dataColumnTable = this.configAttribute['columnTableQuotation']
  languageAlertModalForm = this.configAttribute['alertModalForm']
  menuBreadcrumb = this.configMenuDashboard['brd-warehouse']
  /*END CONFIG */

  dataApi: any = {}
  responseBackend: any = {}
  closeResult = ''
  afterInit = 0
  errorMessage = ""
  alertError = false
  alertFormError = false
  btnActive = 1

  /*Lifecycle ANGULAR*/
  ngOnInit() {
    this.getAll()
    this.menuBreadcrumb[2]['color'] = "#1c100b"
  }
  ngAfterViewInit() {
    this.afterInit = 1
  }
  ngAfterViewChecked() {
    if (this.paginationComp.type != 0) {
      this.onPagination(this.paginationComp.type)
    }
  }

  /*END Lifecycle */

  /*MODAL, Function Names Cannot Be Changed  */
  openModal() {
    this.modalService.open(this.templateref,
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
  formLocation = new FormControl(null, Validators.required)
  dropdownSelect = false
  dataSelectLocation: any = {}
  searchLocation(e) {
    if (e.target.value.length > 3) {
      this.apiBackend.SearchLocation(e.target.value).subscribe((data: {}) => {

        this.dataSelectLocation = data
        this.dropdownSelect = true
      },
        (err) => {
          this.alert.showError(err)
        });
    } else {
      this.dropdownSelect = false
    }
  }
  setValLocation(e) {
    let codePos = e['value'].split("|")
    this.formLocation.setValue(e['label'])
    this.formCreate.get('postal_code').setValue(codePos[0])
    this.formCreate.get('location').setValue(e['label'])
    this.formCreate.get('location_id').setValue(e['value'])
    this.formCreate.get('raw').setValue(JSON.stringify(e))
    this.dropdownSelect = false
  }

  setActive(type, id) {
    this.btnActive = type
    if (type == 1) {
      this.formCreate.enable()
      this.formLocation.enable()
      this.formCreate.reset()
      this.formLocation.reset()
      this.formCreate.get('is_active').setValue(true)
    } else if (type == 2) {
      this.showById(id)
      this.formCreate.enable()
      this.formLocation.enable()
    } else {
      this.showById(id)
      this.formCreate.disable()
      this.formLocation.disable()
    }
  }
  /*END MODAL */
  /*CRUD, Function Names Cannot Be Changed */
  submittedForm = false
  formCreate = this.fb.group({
    tenant_id: [''],
    warehouse_name: ['', Validators.required],
    address: ['', Validators.required],
    postal_code: ['', Validators.required],
    is_active: [true],
    is_default: [0],
    location: [''],
    location_id: [''],
    raw: [''],
    code: ['', Validators.required]
  })
  table = false
  idDetail = 0
  getAll() {
    this.apiBackend.Get('warehouse').subscribe((data: {}) => {
      this.dataApi = data
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  /*CRUD */
  submitCreate() {
    this.submittedForm = true
    if (this.formCreate.invalid || this.formLocation.invalid) {
      return;
    }
    this.formCreate.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    this.apiBackend.Create(this.formCreate.value, 'store-warehouse').subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses tambah gudang')
        this.modalService.dismissAll()
        this.getAll()
      } else {
        this.alert.showError('Gagal tambah gudang')
      }
    },
      (err) => {
        this.alert.showError(err)
      });

  }
  submitUpdate() {
    this.submittedForm = true
    if (this.formCreate.invalid || this.formLocation.invalid) {
      return;
    }
    this.formCreate.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
    if (this.formCreate.get('is_active').value == true) {
      this.formCreate.get('is_active').setValue(1)
    } else {
      this.formCreate.get('is_active').setValue(0)
    }
    if (this.isDefault == 1) {
      if (this.formCreate.get('is_active').value == 0) {
        this.alert.showError('Gudang utama tidak boleh non active')
        this.formCreate.get('is_active').setValue(1)
        return;
      }
    }
    let url = 'update-warehouse/' + this.idDetail
    this.apiBackend.Update(this.formCreate.value, url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses edit gudang')
        this.modalService.dismissAll()
        this.getAll()
      } else {
        this.alert.showError('Gagal edit gudang')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  submitDelete() {
    let url = "delete-warehouse/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idDetail
    this.apiBackend.Delete(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses hapus gudang')
        this.modalService.dismissAll()
        this.getAll()
      } else {
        this.alert.showError('Gagal hapus gudang')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  submitSettingWarehouse(id) {
    let url = "/warehouse/" + this.apiBackend.serviceAuth()['tenant_id'] + "/default/" + id
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses update gudang utama')
        this.modalService.dismissAll()
        this.getAll()
      } else {
        this.alert.showError('Gagal update gudang utama')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }

  isDefault = 0
  showById(id) {
    this.apiBackend.Show('warehouse/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      let val = this.responseBackend.data[0]
      this.isDefault = val['is_default']
      this.idDetail = val['id']
      this.formCreate.get('warehouse_name').setValue(val['name'])
      this.formCreate.get('code').setValue(val['code'])
      this.formCreate.get('address').setValue(val['address'])
      this.formCreate.get('postal_code').setValue(val['postal_code'])
      this.formLocation.setValue(val['location'])
      this.formCreate.get('location').setValue(val['location'])
      let lci = JSON.parse(val['raw'])
      this.formCreate.get('location_id').setValue(lci['value'])
      this.formCreate.get('raw').setValue(val['raw'])
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*END CRUD */
  /*PAGINATION */
  onPagination(type) {
    this.paginationComp.type = 0
    let urlPagination = 1
    if (type == 1) {
      this.ngOnInit()
    }
    if (type == 2) {
      urlPagination = this.dataApi.data.prev_page_url
    } else if (type == 3) {
      urlPagination = this.dataApi.data.next_page_url
    } else {
      urlPagination = this.dataApi.data.last_page_url

    }
    if (type != 1) {
      this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
        this.dataApi = data
      },
        (err) => {
          this.alert.showError(err)
        });
    }

  }
}
