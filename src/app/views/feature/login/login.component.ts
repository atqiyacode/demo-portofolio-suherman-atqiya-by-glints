import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from "rxjs";

import { ApiBackendService } from "../../../auth/api-backend.service";
import { LoadJsService } from "../../library/service/load-js.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private api: ApiBackendService,
    public loadJs: LoadJsService,
  ) { }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  response:any={}
  errorMessage = ""
  alertError = false
  ngOnInit() {

  }
  loginAccounting() {
    localStorage.setItem('act_m', "1")
    this.api.login(this.loginForm.value).subscribe((data: {}) => { 
      this.response = data
        if (this.response.status == 200) {
          this.router.navigate(['/home'])
        } else {
          this.alertError = true
          this.errorMessage = this.response.message
          setTimeout(()=>{
            this.alertError = false
          },8000);
        }
    },
    (err) => {
      console.log(err)
      this.alertError = true
      this.errorMessage = err
      setTimeout(()=>{
        this.alertError = false
      },8000);
    });
  }

}
