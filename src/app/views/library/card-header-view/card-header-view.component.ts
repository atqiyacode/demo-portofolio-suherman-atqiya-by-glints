import { Component, OnInit, Input, SimpleChange, AfterViewInit, 
  AfterViewChecked, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-card-header-view',
  templateUrl: './card-header-view.component.html',
  styleUrls: ['./card-header-view.component.css']
})
export class CardHeaderViewComponent implements OnInit {

  @Input() iconBtnCreate: string
  @Input() urlForm: string
  constructor(
    public _location: Location,
  ) { }
  actionRefresh = 0
  changeLog: string[] = [];
  ngOnInit() {
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

}
