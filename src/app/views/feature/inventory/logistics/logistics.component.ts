import { Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit, 
  AfterContentChecked, TemplateRef} from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from "../../../library/service/inventory.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { NotificationService } from "../../../library/service/notification.service";

@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.css']
})
export class LogisticsComponent implements OnInit, AfterViewInit, AfterViewChecked,
AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService:MenuDashboardService,
    private notify : NotificationService,
    public InventoryService: InventoryService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent
  @ViewChild('content') public templateref: TemplateRef<any>;

  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url+"/create-logistics"
  configAttribute = this.InventoryService.configLogistics()
  dataColumnTable = this.configAttribute['columnTable']
  iconBtnCreate = 'fa fa-user-plus'
  languageAlertModalForm = this.configAttribute['alertModalForm']
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-logistic']
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
    track:[false]
  })

  /*END FORM */

  dataApi:any = {}
  responseBackend:any = {}
  closeResult = ''
  afterInit = 0

  /*Lifecycle ANGULAR*/
  ngOnInit() {
    this.getAll()
    this.menuBreadcrumb[2]['color']="#1c100b"
  }
  ngAfterViewInit(){
    this.afterInit = 1
  }
  ngAfterViewChecked() {
    if (this.paginationAccount.type != 0) {
      this.onPagination(this.paginationAccount.type)
    }
  }
  ngAfterContentChecked() {
    // this.titleCardAccount = this.language.menu().menuMaster[this.noCard].name
    // let cf = this.attribute.InventoryService()
    // this.dataColumnTable = cf['column'] 
    // this.formModalTitle = cf['modal']
    
  }
  /*END Lifecycle */

  /*MODAL, Function Names Cannot Be Changed  */
  openModal(id) {
    this.showById(id)
    this.modalService.open(this.templateref,  
      {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  valDelete =""
  urlApiMaster = ""
  table = false
  idShowById = 0
  getAll() {
    this.urlApiMaster = "logistic"
    this.apiBackend.Get(this.urlApiMaster).subscribe((data: {}) => { 
      this.dataApi = data
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    },
    (err) => {
      // this.alert_error = true
      // this.response_error = err
      // this.table_load = false
      // this.table_data = true
    });
  }
  formLogistic = this.fb.group({
    nama_kurir: [null],
    jenis_pengiriman: [null],
  })
  showById(id) {
    this.idShowById = id
    this.urlApiMaster = "logistic/"+this.apiBackend.serviceAuth()['tenant_id']+'/'+id
    this.apiBackend.Show(this.urlApiMaster).subscribe((data: {}) => { 
      let del:any={}
      let dummyDel = []
      del = data
      this.valDelete = del.data[0].nama_kurir
      this.formLogistic.get('nama_kurir').setValue(del.data[0].nama_kurir)
      for (let index = 0; index < del.data[0].logistic_type.length; index++) {
        dummyDel.push(del.data[0].logistic_type[index]['jenis_pengiriman'])
      }
      this.formLogistic.get('jenis_pengiriman').setValue(dummyDel)
      console.log(this.formLogistic.value)
    },
    (err) => {
      // this.alert_error = true
      // this.response_error = err
      // this.table_load = false
      // this.table_data = true
    });
  }
  formUpdate(id) {
    let urlUpdate = this.router.url+'/update-logistics/'+id
    this.router.navigate([urlUpdate]);
  }
  onDelete() {
    let url = 'delete-logistic/'+this.apiBackend.serviceAuth()['tenant_id']+'/'+this.idShowById
    this.apiBackend.Delete(url).subscribe((rsp: {}) => { 
      this.responseBackend = rsp
      console.log(this.responseBackend)
      if (this.responseBackend.status == 200) {
        this.modalService.dismissAll()
        this.notify.showSuccess("Data Has been Delete !!", "ACCOUNTING SYSTEM")
        this.ngOnInit()
      } else {
        this.notify.showError("Data Failed To Delete !!", "ACCOUNTING SYSTEM")
      }
    },
    (err) => {
      // this.alert_error = true
      // this.response_error = err
      // this.table_load = false
      // this.table_data = true
    });
  }
  onPagination(type) {
    this.paginationAccount.type = 0
    let urlPagination = 1
    if (type == 1) {
      this.ngOnInit()
    } else if(type==2) {
      urlPagination = this.dataApi.data.prev_page_url
    } else if(type==3) {
      urlPagination = this.dataApi.data.next_page_url
    } else {
      urlPagination = this.dataApi.data.last_page_url
    }
    this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => { 
      this.dataApi = data
    },
    (err) => {
      // this.alert_error = true
      // this.response_error = err
      // this.table_load = false
      // this.table_data = true
    });  
  }
  /*END CRUD */

}
