import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, of } from 'rxjs';

import { InventoryService } from "../../../library/service/inventory.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { SweetAlertService } from "../../../library/service/sweetalert.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private alert: SweetAlertService,
    public InventoryService: InventoryService,
    private router: Router,
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent
  @ViewChild('content') public templateref: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  noCard = 2
  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = "create-product"
  urlShowById = "master-data-product/" + this.apiBackend.serviceAuth()['tenant_id']
  urlDelete = "delete-product/" + this.apiBackend.serviceAuth()['tenant_id']

  configAttribute = this.InventoryService.configInventoryProduct()
  dataColumnTable = this.configAttribute['columnTable']
  iconBtnCreate = 'fa fa-user-plus'
  languageAlertModalForm = this.configAttribute['alertModalForm']
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-product']
  /*END CONFIG */
  alertModalForm = this.languageAlertModalForm
  titleCardAccount = this.configAttribute['titleInformation']
  activeTitleModal = ""

  /*FORM AND VALIDATION */
  formCreate = this.fb.group({
    product_code: ['', Validators.required],
    product_name: ['', Validators.required],
    base_unit: ['', Validators.required],
    product_category: ['', Validators.required],
    selling_price: ['', Validators.required],
    unit_cost: ['', Validators.required],
    supplier: ['', Validators.required],
    id: [''],
    track: [false]
  })

  /*END FORM */

  dataApi: any = {}
  responseBackend: any = {}
  closeResult = ''
  afterInit = 0
  errorMessage = ""
  alertError = false

  /*Lifecycle ANGULAR*/
  ngOnInit() {
    this.apiBackend.serviceAuth()
    this.menuBreadcrumb[2]['color'] = "#1c100b"
    this.WarehouseList()
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }), filter(res => {
        if (res.length > 2 || res.length == 0) {
          return true;
        }
      }),
      debounceTime(1000), distinctUntilChanged()
    ).subscribe((text: string) => {
      if (text == null || text == "") {
        this.getAll()
      } else {
        let url = 'product/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idDefault + '/search-main/' + text
        this.apiBackend.GetSearch(url).subscribe((data: {}) => {
          this.dataApi = data
        },
          (err) => {
            this.alert.showError(err)
          });
      }
    });
  }
  ngAfterViewInit() {
    this.afterInit = 1
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.onPagination(this.paginationAccount.type)
    }
  }
  /*END Lifecycle */
  warehouse = new FormControl()
  dataWarehouse: any = {}
  idDefault = 0
  WarehouseList() {
    this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
      this.dataWarehouse = data
      for (let index = 0; index < this.dataWarehouse.data.length; index++) {
        if (this.dataWarehouse.data[index].is_default == 1) {
          this.idDefault = this.dataWarehouse.data[index].id
          this.getAll()
          return false
        }
      }

    },
      (err) => {
        this.alert.showError(err)
      });
  }
  changeWarehouse(e) {
    if (e != null) {
      this.idDefault = e
      this.getAll()
    } else {
      this.WarehouseList()
    }

  }

  /*MODAL, Function Names Cannot Be Changed  */
  openModal(id) {
    this.showById(id)
    this.modalService.open(this.templateref,
      { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  valDelete = ""
  idDelete = null
  table = false
  getAll() {
    let url = "master-data-product/" + this.apiBackend.serviceAuth()['tenant_id'] + '/warehouse/' + this.idDefault
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataApi = data
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  showById(id) {
    this.idDelete = id
    this.apiBackend.Show(this.urlShowById + '/' + id).subscribe((data: {}) => {
      let del: any = {}
      del = data
      this.valDelete = del.data[0].product_name
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  formUpdate(id) {
    let urlUpdate = this.router.url + '/update-product/' + id
    this.router.navigate([urlUpdate]);
  }
  onDelete() {
    this.apiBackend.Delete(this.urlDelete + '/' + this.idDelete).subscribe((rsp: {}) => {
      this.responseBackend = rsp
      if (this.responseBackend.status == 200) {
        this.alert.showSuccess('Sukses hapus produk')
        this.modalService.dismissAll()
        this.getAll()
      } else {
        this.alert.showError('Gagal hapus produk')
      }
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  onPagination(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
    if (type == 1) {
      urlPagination = this.dataApi.data.first_page_url
    } else if (type == 2) {
      urlPagination = this.dataApi.data.prev_page_url
    } else if (type == 3) {
      urlPagination = this.dataApi.data.next_page_url
    } else {
      urlPagination = this.dataApi.data.last_page_url
    }
    this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
      this.dataApi = data
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*END CRUD */

}
