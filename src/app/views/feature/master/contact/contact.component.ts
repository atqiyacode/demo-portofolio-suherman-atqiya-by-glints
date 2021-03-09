import { Component, AfterViewInit, AfterViewChecked, ViewChild, OnInit, 
  AfterContentChecked, TemplateRef, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { MasterService } from "../../../library/service/master.service";
import { ApiBackendService } from "../../../../auth/api-backend.service";
import { MenuDashboardService } from "../../../library/service/menu-dashboard.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(
    private apiBackend: ApiBackendService,
    public fb: FormBuilder,
    public menuService:MenuDashboardService,
    public serviceConfig: MasterService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) { }
  
  /*CONFIG ATTRIBUTE IN SERVICE */
  urlCustomer = 'customer'
  urlSupplier = 'supplier'
  urlSales = 'sales'
  configMenuDashboard = this.menuService.menu()
  menuBreadcrumbContact = this.configMenuDashboard['brd-customer']
  /*END CONFIG */
  /*Lifecycle ANGULAR*/
  ngOnInit() {
    // console.log('masuk');
    
    // this.router.events.pipe(
    // filter(event => event instanceof NavigationEnd),)
    // .subscribe((event) => {
    //   console.log(event);
      
    //   var rt = this.getChild(this.activatedRoute)
    //   rt.data.subscribe(data => {
    //     console.log(data);
    //     this.titleService.setTitle(data.title)})
    // })
  }
  ngAfterViewInit(){
  }
  ngAfterViewChecked() {
  }

  /*CHILD ROUTE */
  getChild(activatedRoute: ActivatedRoute) {
    // console.log(activatedRoute);
    
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
 
  }
}
