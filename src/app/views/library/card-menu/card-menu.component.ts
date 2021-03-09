import { Component, OnInit, Input, inject } from '@angular/core';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent implements OnInit {
  @Input() title: string;
  @Input() urlPage: string;
  @Input() icon: string;
  @Input() color: string;
  @Input() desc: string;
  constructor() { }

  ngOnInit() {
  }

}
