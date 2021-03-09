import { Injectable } from '@angular/core';
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  today = new Date()
  format = formatDate(this.today, 'yyyy-MM-dd', 'en-ID')
  formatCode = formatDate(this.today, 'yyyyMMdd', 'en-ID')
  public date() {
    return this.format
  }
  public dateCode() {
    return this.formatCode
  }
}
