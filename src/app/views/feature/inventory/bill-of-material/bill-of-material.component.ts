import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, Validators, } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, of } from 'rxjs';

import { SalesService } from "../../../library/service/sales.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { NotificationService } from "../../../library/service/notification.service";


@Component({
  selector: 'app-bill-of-material',
  templateUrl: './bill-of-material.component.html',
  styleUrls: ['./bill-of-material.component.css']
})
export class BillOfMaterialComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    private notify: NotificationService,
    public salesService: SalesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent
  @ViewChild('contentModal') public contentModal: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url + "/create"
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-bom']
  /*END CONFIG */

  dataApi: any = {}
  responseBackend: any = {}
  closeResult = ''
  afterInit = 0
  errorMessage = ""
  alertError = false

  /*Lifecycle ANGULAR*/
  ngOnInit() {
    this.getAll()
    this.menuBreadcrumb[1]['color'] = "#1c100b"
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
        let url = 'quotation/' + this.apiBackend.serviceAuth()['tenant_id'] + '/search/' + text
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
    this.afterInit = 1
  }
  ngAfterViewChecked() {
    // if (this.paginationComp.type != 0) {
    //   this.onPagination(this.paginationComp.type)
    // }
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
  idDelete = null
  urlApiMaster = ""
  table = false
  dataName: any = []
  getAll() {
    this.urlApiMaster = "quotation"
    this.apiBackend.Get(this.urlApiMaster).subscribe((data: {}) => {
      this.dataApi = data
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    },
      (err) => {

      });
  }
  noQuotation = ""
  name = ""
  dataShow: any = {}
  loadingDelete = false
  alertDelete = false
  showById(id) {
    let url = "quotation/" + this.apiBackend.serviceAuth()['tenant_id'] + '/finish/' + id
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataShow = data
      this.idDelete = this.dataShow.data.quotation.id
      this.name = this.dataShow.data.origin.name
      this.noQuotation = this.dataShow.data.quotation.quotation_no
    },
      (err) => {

      });
  }
  formUpdate(id) {
    let urlUpdate = this.router.url + '/update-quotation/' + id
    this.router.navigate([urlUpdate]);
  }
  formDetail(id) {
    let urlUpdate = this.router.url + '/detail-quotation/' + id
    this.router.navigate([urlUpdate]);
  }
  onDelete() {
    this.loadingDelete = true
    let url = 'delete-quotation/' + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.idDelete
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
    this.paginationComp.type = 0
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
        // this.alertError = true
        // this.errorMessage = err
      });
  }
  /*END CRUD */

}
