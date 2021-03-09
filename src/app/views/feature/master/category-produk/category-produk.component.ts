import {
  Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit,
  AfterContentChecked, TemplateRef, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, of } from 'rxjs';
import * as _ from 'lodash';

import { InventoryService } from "../../../library/service/inventory.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { PaginationComponent } from "../../../library/pagination/pagination.component";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";
import { SweetAlertService } from "../../../library/service/sweetalert.service";


@Component({
  selector: 'app-category-produk',
  templateUrl: './category-produk.component.html',
  styleUrls: ['./category-produk.component.css']
})
export class CategoryProdukComponent implements OnInit, AfterViewInit, AfterViewChecked,
  AfterContentChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public menuService: MenuDashboardService,
    public InventoryService: InventoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alert: SweetAlertService,
  ) { }

  @ViewChild(PaginationComponent) paginationAccount: PaginationComponent
  @ViewChild('content') public templateref: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  noCard = 0
  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCreate = this.router.url + "/create-category-product"
  configAttribute = this.InventoryService.configCategoryProduct()
  dataColumnTable = this.configAttribute['columnTable']
  iconBtnCreate = 'fa fa-user-plus'
  languageAlertModalForm = this.configAttribute['alertModalForm']
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumb = this.configMenuDashboard['brd-category-product']
  /*END CONFIG */
  alertModalForm = this.languageAlertModalForm
  titleCardAccount = this.configAttribute['titleInformation'];
  activeTitleModal = ""

  errorMessage = ""
  alertError = false
  dataApi: any = {}
  responseBackend: any = {}
  closeResult = ''
  afterInit = 0
  btnActive = 1
  subCategoryName = ""

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
        let url = 'category/' + this.apiBackend.serviceAuth()['tenant_id'] + '/search/' + text
        this.apiBackend.GetSearch(url).subscribe((data: {}) => {
          this.dataApi = data
          this.loopData()
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
  }
  ngAfterContentChecked() {

  }
  /*END Lifecycle */

  /*MODAL, Function Names Cannot Be Changed  */
  openModal(id) {
    this.btnActive = id
    // this.showById(id,type)
    this.formCreate.reset()
    this.subCategory = 0
    this.valSub = 0
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
  valDelete = ""
  urlApiMaster = ""
  table = false
  idUpdate = 0
  subCategory = 0
  valSub = 0
  formCreate = this.fb.group({
    id: [null],
    tenant_id: [''],
    product_category_name: [null],
    is_active: [1],
    is_category: [0],
    parent: [null],
    child: [null]
  })
  dataSubProduct: any = {}
  checkboxCategory() {
    this.formCreate.get('parent').setValue(null)
    if (this.formCreate.get('is_category').value == true) {
      this.subCategory = 1
      this.apiBackend.Get('master-data-product-category').subscribe((data: {}) => {
        this.dataSubProduct = data
      },
        (err) => {
          this.alert.showError(err)
        });
    } else {
      this.subCategory = 0
    }
  }
  dataSelectChild: any = {}
  selectSubCategory(e) {

    if (e == null) {
      this.dataSelectChild = {}
      this.valSub = 0
    } else {
      this.valSub = 1
    }

    this.subCategoryName = e['product_category_name']
    let id = e['id']
    for (let index = 0; index < this.dataSubProduct.data.length; index++) {
      if (this.dataSubProduct.data[index]['id'] == id) {
        this.dataSelectChild = this.dataSubProduct.data[index]['children']
      }
    }
  }
  dummyData: any = []
  dataPage: any = []
  getAll() {
    this.dummyData = []
    this.apiBackend.Get('list-product-category').subscribe((data: {}) => {
      this.dataApi = data
      if (this.dataApi.status == 200) {
        this.loopData()
        this.table = true
      }

    },
      (err) => {
        this.alert.showError(err)
      });
  }
  loopData() {
    this.dummyData = []
    let category: any = []
    category = this.dataApi.data
    for (let index = 0; index < category.length; index++) {
      if (category[index]['children'].length != 0) {
        for (let index2 = 0; index2 < category[index]['children'].length; index2++) {
          if (category[index]['children'][index2]['children'].length != 0) {
            for (let index3 = 0; index3 < category[index]['children'][index2]['children'].length; index3++) {
              this.dummyData.push({
                id: category[index]['children'][index2]['children'][index3]['id'],
                product_category_name: category[index]['children'][index2]['children'][index3]['product_category_name'],
                is_active: category[index]['children'][index2]['children'][index3]['is_active'],
                sub_category: {
                  parent2: category[index]['children'][index2]['product_category_name'],
                  image: true, parent1: category[index]['product_category_name']
                }
              })
            }
          }
          this.dummyData.push({
            id: category[index]['children'][index2]['id'],
            product_category_name: category[index]['children'][index2]['product_category_name'],
            is_active: category[index]['children'][index2]['is_active'],
            sub_category: {
              parent2: category[index]['product_category_name'], image: false, parent1: null
            }
          })
        }
      }
      this.dummyData.push({
        id: category[index]['id'],
        product_category_name: category[index]['product_category_name'],
        is_active: category[index]['is_active'],
        sub_category: {
          parent2: null, image: false, parent1: null
        }
      })
    }
    setTimeout(() => {
      for (let index = 0; index < 10; index++) {
        this.dataPage.push(this.dummyData[index])
      }
    }, 2000)
    this.dummyData = _.uniqWith(this.dummyData, _.isEqual)
  }
  showSubCategory(id) {
    console.log(id)
  }

  submitSave(id) {
    this.formCreate.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])

    if (id == 1) {
      if (this.subCategory == 0) {
        this.formCreate.get('parent').setValue(0)
      }
      if (this.formCreate.get('parent').value == null) {
        this.formCreate.get('parent').setValue(this.formCreate.get('child').value)
      }
      this.apiBackend.Create(this.formCreate.value, 'store-product-category').subscribe((data: {}) => {
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          this.alert.showSuccess('Sukses tambah kategori')
          this.modalService.dismissAll()
          this.getAll()
        } else {
          this.alert.showError('Gagal tambah kategori')
        }
      },
        (err) => {
          this.alert.showError(err)
        });
    }
    if (id == 2) {
      // this.formCreate.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
      if (this.formCreate.get('is_active').value == true) {
        this.formCreate.get('is_active').setValue(1)
      } else {
        this.formCreate.get('is_active').setValue(0)
      }
      let url = "update-product-category/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.formCreate.get('id').value
      this.apiBackend.Update(this.formCreate.value, url).subscribe((data: {}) => {
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          this.alert.showSuccess('Sukses edit kategori')
          this.modalService.dismissAll()
          this.getAll()
        } else {
          this.alert.showError('Gagal edit, kategori masih di gunakan produk')
        }
      },
        (err) => {
          this.alert.showError(err)
        });
    }
    if (id == 3) {
      // this.formCreate.get('tenant_id').setValue(this.apiBackend.serviceAuth()['tenant_id'])
      if (this.formCreate.get('is_active').value == true) {
        this.formCreate.get('is_active').setValue(1)
      } else {
        this.formCreate.get('is_active').setValue(0)
      }
      let url = "delete-product-category/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + this.formCreate.get('id').value
      this.apiBackend.Delete(url).subscribe((data: {}) => {
        this.responseBackend = data
        if (this.responseBackend.status == 200) {
          this.alert.showSuccess('Sukses hapus kategori')
          this.modalService.dismissAll()
          this.getAll()
        } else {
          this.alert.showError('Gagal hapus kategori')
        }
      },
        (err) => {
          this.alert.showError(err)
        });
    }
  }


  showById(id, type) {
    this.btnActive = type
    this.openModal(type)
    this.idUpdate = id
    this.urlApiMaster = "master-data-product-category/" + this.apiBackend.serviceAuth()['tenant_id'] + '/' + id
    this.apiBackend.Show(this.urlApiMaster).subscribe((data: {}) => {
      this.responseBackend = data
      if (this.responseBackend.data.length != 0) {
        this.formCreate.get('id').setValue(this.responseBackend.data[0].id)
        this.formCreate.get('product_category_name').setValue(this.responseBackend.data[0].product_category_name)
        this.formCreate.get('is_active').setValue(this.responseBackend.data[0].is_active)
        this.formCreate.get('parent').setValue(this.responseBackend.data[0].parent)
      }

    },
      (err) => {
        this.alert.showError(err)
      });
  }
  formUpdate(id) {

    let urlUpdate = this.router.url + '/update-category-product/' + id
    this.router.navigate([urlUpdate]);
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
    this.apiBackend.Pagination(urlPagination).subscribe((data: {}) => {
      this.dataApi = data
    },
      (err) => {
        this.alert.showError(err)
      });
  }
  /*END CRUD */
}
