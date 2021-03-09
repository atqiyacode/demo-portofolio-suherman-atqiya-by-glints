import { Component, Input, SimpleChange, ViewChild, ElementRef, AfterViewInit, 
  OnChanges, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges, AfterViewInit, AfterViewChecked {

  constructor() { }

  @ViewChild("column") column: ElementRef;
  @Input() dataApi:any = {}
  data:any={}
  pagination = false
  type = 0

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      // const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        // log.push('Initial value of ${propName} set to ${to}');
        // console.log(to)
      } else {
        this.data = changedProp.currentValue.data
        if (this.data != null) {
          this.pagination = true
        }
        // console.log(to)
        // const from = JSON.stringify(changedProp.previousValue);
        // log.push(`${propName} changed from ${from} to ${to}`);
      }
      
    }
  }
  ngAfterViewInit(){
    
  }
  ngAfterViewChecked() {

  }
  paginationType(val) {
    this.type = val
  }
}
