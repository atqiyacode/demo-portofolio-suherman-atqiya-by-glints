import { Component, OnInit, Input, SimpleChange, AfterViewInit, 
  AfterViewChecked, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

import { MenuDashboardService } from "../service/menu-dashboard.service";
@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css']
})
export class CardViewComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {

  @Input() iconBtnCreate: string
  @Input() dataApi:any = {}
  @Input() dataColumnTable: any[]
  @Input() urlCreate: string
  @ViewChild('movieSearchInput', { static: true }) movieSearchInput: ElementRef;
  apiResponse: any;
  isSearching: boolean;
  constructor(
    private _location: Location,
    public language:MenuDashboardService
    ) {
      this.isSearching = false;
      this.apiResponse = [];

      // console.log(this.movieSearchInput);
     }
  
  actionModalCreate = false
  actionRefresh = 0
  changeLog: string[] = [];

  ngOnInit(){
  //   console.log(this.movieSearchInput);



  //   fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(

  //     // get value
  //     map((event: any) => {
  //       return event.target.value;
  //     })
  //     // if character length greater then 2
  //     , filter(res => res.length > 2)

  //     // Time in milliseconds between key events
  //     , debounceTime(1000)

  //     // If previous query is diffent from current   
  //     , distinctUntilChanged()

  //     // subscription for response
  //   ).subscribe((text: string) => {

  //     this.isSearching = true;

  //     this.searchGetCall(text).subscribe((res) => {
  //       console.log('res', res);
  //       this.isSearching = false;
  //       this.apiResponse = res;
  //     }, (err) => {
  //       this.isSearching = false;
  //       console.log('error', err);
  //     });

  //   });
  // }
  // searchGetCall(term: string) {
  //   if (term === '') {
  //     return of([]);
  //   }
  //   // return this.httpClient.get('http://www.omdbapi.com/?s=' + term + '&apikey=' + APIKEY, { params: PARAMS.set('search', term) });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
    // console.log(this.changeLog)
  }
  ngAfterViewInit(){
  }
  ngAfterViewChecked() {
  }

  back() {
    this._location.back();
  }
  refresh() {
    this.actionRefresh = 1
  }
  openModalCreate() {
    this.actionModalCreate = true
  }
}
