import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { SalesService } from "../../../library/service/sales.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { NotificationService } from "../../../library/service/notification.service";
import { SweetAlertService } from "../../../library/service/sweetalert.service";


@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private notify: NotificationService,
    public salesService: SalesService,
    private router: Router,
    private alert: SweetAlertService,
  ) { }

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent
  @ViewChild('modal') public templateref: TemplateRef<any>;

  /*CONFIG ATTRIBUTE IN SERVICE */
  configMenuDashboard = this.menuService.menu()
  configAttribute = this.salesService.configSalesOrder()
  dataColumnTable = this.configAttribute['columnTableQuotation']
  languageAlertModalForm = this.configAttribute['alertModalForm']
  menuBreadcrumb = this.configMenuDashboard['brd-brand']
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
    this.menuBreadcrumb[1]['color'] = "#1c100b"
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
  openModal(id, type) {
    this.valid = 0
    if (id != 0) {
      this.showById(id)
      this.formCreate.get('id').setValue(id)
    }
    if (type == 1) {
      this.formCreate.reset()
      this.dataImageBrand = null
      this.formCreate.get('is_active').setValue(true)
    }
    if (type != 3) {
      this.formCreate.enable()
    }
    if (type == 3) {
      this.formCreate.disable()
    }
    this.btnActive = type
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
  /*END MODAL */
  /*CRUD, Function Names Cannot Be Changed */
  formData: any = new FormData()
  dataImageBrand: any = null
  dummyImage: any
  imageBrand(files) {
    var reader = new FileReader();
    if (files.length === 0)
      return;
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      this.dummyImage = files[0]
      this.formData.append("file", files[0])
      this.formData.append("path", "brand")
      this.dataImageBrand = reader.result
      this.uploadImage()
    }
  }
  removeImageBrand() {
    this.dataImageBrand = null
    this.formData.delete('file')
    this.formCreate.get('logo').setValue(null)
  }
  formCreate = this.fb.group({
    id: [''],
    name: [''],
    logo: [''],
    is_active: [true]
  })
  table = false
  getAll() {
    this.apiBackend.Show('brand/' + this.apiBackend.serviceAuth()['tenant_id'] + '/list').subscribe((data: {}) => {
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
  uploadImage() {
    let resUploap: any = {}
    this.apiBackend.GeneralUpload(this.formData).subscribe((data: {}) => {
      resUploap = data
      this.formCreate.get('logo').setValue(resUploap.data.file)
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  valid = 0
  msgValid = ""
  validFormSales() {
    if (this.formCreate.get('name').value == null || this.formCreate.get('name').value == "") {
      this.msgValid = "Nama brand harus diisi"
      this.valid = 1
      return this.valid
    }
    if (this.formCreate.get('logo').value == null) {
      this.msgValid = "Image harus diisi"
      this.valid = 1
      return this.valid
    }
  }
  stopValid() {
    this.valid = 0
  }

  submit() {
    this.validFormSales()
    if (this.valid == 0) {
      if (this.btnActive == 1) {
        this.apiBackend.Update(this.formCreate.value, 'brand/' + this.apiBackend.serviceAuth()['tenant_id'] + '/add').subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.alert.showSuccess('Sukses tambah brand')
            this.modalService.dismissAll()
            this.getAll()
          } else {
            this.alert.showError('Gagal tambah brand')
          }
        },
          (err) => {
            this.alert.showError(err)
          });
      } else if (this.btnActive == 2) {
        let url = 'brand/' + this.apiBackend.serviceAuth()['tenant_id'] + '/update/' + this.formCreate.get('id').value
        this.apiBackend.Update(this.formCreate.value, url).subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.alert.showSuccess('Sukses edit brand')
            this.modalService.dismissAll()
            this.getAll()
          } else {
            this.alert.showError('Gagal edit brand')
          }
        },
          (err) => {
            this.alert.showError(err)
          });
      } else {
        let url = 'brand/' + this.apiBackend.serviceAuth()['tenant_id'] + '/delete/' + this.formCreate.get('id').value
        this.apiBackend.Delete(url).subscribe((data: {}) => {
          this.responseBackend = data
          if (this.responseBackend.status == 200) {
            this.alert.showSuccess('Sukses hapus brand')
            this.modalService.dismissAll()
            this.getAll()
          } else {
            this.alert.showError('Gagal hapus brand')
          }
        },
          (err) => {
            this.alert.showError(err)
          });
      }
    }

  }
  showById(id) {
    this.apiBackend.Show('brand/' + this.apiBackend.serviceAuth()['tenant_id'] + '/detail/' + id).subscribe((data: {}) => {
      this.responseBackend = data
      this.dataImageBrand = this.responseBackend['data']['logo']
      this.formCreate.get('name').setValue(this.responseBackend['data']['name'])
      this.formCreate.get('logo').setValue(this.responseBackend['data']['logo'])
      this.formCreate.get('is_active').setValue(this.responseBackend['data']['is_active'])
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*END CRUD */
  /*PAGINATION */
  onPagination(type) {
    let urlPagination = ""
    if (type == 1) {
      this.ngOnInit()
    } else if (type == 2) {
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
