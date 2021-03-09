import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { InventoryService } from "../../../library/service/inventory.service";
import { FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../library/service/notification.service";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from "../../../library/pagination/pagination.component";

@Component({
  selector: 'app-inventory-adjustment',
  templateUrl: './inventory-adjustment.component.html',
  styleUrls: ['./inventory-adjustment.component.css']
})
export class InventoryAdjustmentComponent implements OnInit {

  constructor(
  	private apiBackend: ApiBackendService,
    private router: Router,
    private modalService: NgbModal,
    private notify: NotificationService,
  	public menuService: MenuDashboardService,
  	public inventoryService: InventoryService,
  ) { }

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('modalDelete') public modalDelete: TemplateRef<any>;
  @ViewChild(PaginationComponent) paginationInventory: PaginationComponent

  /** CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url+'/create-inventory-adjustment'
  urlDetail = this.router.url+'/detail-inventory-adjustment'
  configAttribute = this.inventoryService.configInventoryAdjustment()
  configMenuDashboard = this.menuService.menu()
  menuBreadCrumb = this.configMenuDashboard['brd-adjustment']
  titleCardAccount = this.configAttribute['titleInformation']
  dataColumnTable = this.configAttribute['columnTable']

  defaultWarehouseId = 0
  alertError = false
  table = false
  errorMessage = ""

  closeResult: string = ''
  adjustmentNumber: string = ''
  adjustmentId: number = null
  inventoryName: string = ''
  warehouse = new FormControl()
  dataWarehouse:any = {}
  dataApi:any = {}
  responseBackend: any = {}

  ngOnInit(): void {
  	this.apiBackend.serviceAuth()
  	this.menuBreadCrumb[1]['color'] = '#1c100b'
    fromEvent(this.searchInput.nativeElement, 'change').pipe(
        map((event: any) => {
          return event.target.value
        })
      ).subscribe((text: string) => {
        let url = 'adjustment/'+this.apiBackend.serviceAuth()['tenant_id']+'/'+this.defaultWarehouseId+'/search/'+text
        this.apiBackend.GetSearch(url).subscribe((data: {}) => {
          this.table = true
          this.dataApi = data
        }, (err) => {
          this.table = false
          this.dataApi = {}
          console.log(err)
        });
      });

  	this.warehouseList()
  }

  ngAfterViewChecked() {
    if(this.paginationInventory.type != 0) {
      this.onPaginationInventory(this.paginationInventory.type)
    }
  }

  onPaginationInventory(type) {
    this.paginationInventory.type = 0
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

    if (type > 1) {
      this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
        this.dataApi = data
        // console.log(this.dataApi.data.data)
      }, (err) => {
        console.log(err)
      });
    }
  }

  changeWarehouse(e) {
  	if (e != null) {
  		this.defaultWarehouseId = e
      this.getAllAdjInventory()
  	} else {
      this.searchInput.nativeElement.value = ''
  		this.warehouseList()
  	}
  }

  warehouseList() {
  	this.apiBackend.Get('warehouse-list').subscribe((data: {}) => {
  		this.dataWarehouse = data
      // console.log(this.dataWarehouse)
  		for(let index = 0; index < this.dataWarehouse.data.length; index++) {
  			if(this.dataWarehouse.data[index].is_default == 1) {
  				this.defaultWarehouseId = this.dataWarehouse.data[index].id
  				this.getAllAdjInventory()
  				return false
  			}
  		}
  	}, (err) => {
  		console.log(err)
  		this.alertError = true
  		this.errorMessage = err
  	});
  }

  getAllAdjInventory() {
    let url = "adjustment/"+this.apiBackend.serviceAuth()['tenant_id']+'/list/'+this.defaultWarehouseId
    this.apiBackend.Show(url).subscribe((data: {}) => {
      this.dataApi = data
      // console.log(this.dataApi.data.data)
      if (this.dataApi.data.data.length > 0) {
        this.table = true
      }
    }, (err) => {
      this.table = false
      this.alertError = true
      this.errorMessage = err
    })
  }

  openDeleteModal(itemId, adjustmentNo, name) {
    this.adjustmentNumber = adjustmentNo
    this.inventoryName = name
    this.adjustmentId = itemId

    this.modalService.open(this.modalDelete, {ariaDescribedBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  getDismissReason(reason) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC'
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop'
    } else {
      return `with: ${reason}`
    }
  }

  deleteItem(itemId) {
    let url = `adjustment/${this.apiBackend.serviceAuth()['tenant_id']}/delete/${itemId}`
    this.apiBackend.Delete(url).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.status == 200) {
        this.modalService.dismissAll()
        this.notify.showSuccess("Data berhasil dihapus !!", "INVENTORY ADJUSTMENT")
        this.getAllAdjInventory()
      }
    }, (err) => {
      console.log(err)
    })
  }

}
