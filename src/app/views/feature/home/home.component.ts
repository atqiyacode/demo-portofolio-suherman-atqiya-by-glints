import { Component, OnInit } from '@angular/core';

import { ApiBackendService } from "../../../auth/api-backend.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private apiService:ApiBackendService
  ) { }
  
  profile_name = ""
  ngOnInit(){
    
  }

}
