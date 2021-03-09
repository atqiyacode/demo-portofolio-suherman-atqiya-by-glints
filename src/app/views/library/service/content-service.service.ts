import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentServiceService {

  constructor() { }
  data: any = {};
  landingPage: any = [];

  configMenu() {
    this.data.menu = [
      {id: 1, active: ''},
      {id: 2, active: ''},
      {id: 3, active: ''},
      {id: 4, active: ''},
      {id: 5, active: ''},
    ];
    return this.data;
  }
}
