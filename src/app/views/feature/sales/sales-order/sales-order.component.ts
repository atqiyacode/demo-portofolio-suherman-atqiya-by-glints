import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, of } from 'rxjs';

import { SalesService } from "../../../library/service/sales.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { NotificationService } from "../../../library/service/notification.service";


@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private notify: NotificationService,
    public salesService: SalesService,
    private router: Router,
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent
  @ViewChild('contentModal') public contentModal: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url + "/create-order"
  configAttribute = this.salesService.configSalesOrder()
  dataColumnTable = this.configAttribute['columnTable']
  languageAlertModalForm = this.configAttribute['alertModalForm']
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-order']
  /*END CONFIG */

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
  errorMessage = ""
  alertError = false
  searchActive = 0

  /*Lifecycle ANGULAR*/
  ngOnInit() {
    this.getAll()
    this.menuBreadcrumb[2]['color'] = "#1c100b"
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
        this.ngOnInit()
      } else {
        let url = 'order/' + this.apiBackend.serviceAuth()['tenant_id'] + '/search/' + text
        this.apiBackend.GetSearch(url).subscribe((data: {}) => {
          this.dataApi = data
        },
          (err) => {
            console.log(err)
          });
      }
    });
  }
  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.onPagination(this.paginationAccount.type)
    }
  }
  /*END Lifecycle */

  /*MODAL, Function Names Cannot Be Changed  */
  openModal(id) {
    this.showById(id)
    this.modalService.open(this.contentModal,
      { size: 'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  urlApiMaster = ""
  table = false
  getAll() {
    this.urlApiMaster = "order"
    this.apiBackend.Get(this.urlApiMaster).subscribe((data: {}) => {

      this.dataApi = data
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    },
      (err) => {
        console.log(err)
        this.alertError = true
        this.errorMessage = err
      });
  }
  noOrder = ""
  name = ""
  dataShow: any = {}
  loadingDelete = false
  alertDelete = false
  showById(id) {
    let url = "order/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + id
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataShow = data
      this.idDelete = this.dataShow.data.order.id
      this.name = this.dataShow.data.origin.name
      this.noOrder = this.dataShow.data.order.order_no
    },
      (err) => {

      });
  }
  formUpdate(id) {
    let urlUpdate = this.router.url + '/update-order/' + id
    this.router.navigate([urlUpdate]);
  }
  formDetail(id) {
    let urlUpdate = this.router.url + '/detail-order/' + id
    this.router.navigate([urlUpdate]);
  }
  formInvoice(id) {
    let urlUpdate = this.router.url + '/invoice-order/' + id
    this.router.navigate([urlUpdate]);
  }
  onDelete() {
    this.loadingDelete = true
    let url = 'order/' + this.apiBackend.serviceAuth()['tenant_id'] + '/delete/' + this.idDelete
    this.apiBackend.Delete(url).subscribe((rsp: {}) => {
      this.responseBackend = rsp
      if (this.responseBackend.status == 200) {
        this.modalService.dismissAll()
        this.notify.showSuccess("Data Has been Delete !!", "ACCOUNTING SYSTEM")
        this.ngOnInit()
      } else {
        this.notify.showError("Data Failed To Delete !!", "ACCOUNTING SYSTEM")
      }
      this.loadingDelete = false
    },
      (err) => {
        this.loadingDelete = false
        setTimeout(() => {
          this.alertDelete = true
          this.errorMessage = err
        }, 4000)
      });
  }
  onPagination(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
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
          console.log(err)
          this.alertError = true
          this.errorMessage = err
        });
    }

  }
  /*END CRUD */
}
