import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router} from '@angular/router';
import { formatDate } from '@angular/common';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiBackendService {
  public urlApi = environment.apiUrl
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user-login')));
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public errorCode = null
  /*HTTP AUTH */
  httpAuth(params) { 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+params,
      })
    };
  } 
  httpAuthMasterProduct(params) {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+params,
      })
    };
  } 
  httpAuthLogin() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  } 
  /*HANDLE ERROR */
  messageError:any={}
  private handleError(error: HttpErrorResponse) {
    this.errorCode = error.status
    if (this.errorCode != 500) {
      if (this.errorCode == 401) {
        localStorage.clear();
        this.router.navigate(['login']);
        
      } else {
        if (error.error instanceof ErrorEvent) {
          return throwError(error.error.message);
        } else {
            return throwError(error.error.message);
        }
      }
    }
  }
  private handleErrorShipping(error: HttpErrorResponse) {
    return throwError(error.error.status)
  }

  /*LOGIN ACCOUNTING*/
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  
  login(params: any): Observable<any> {
    let today = new Date()
    let timeDate = new Date() 
    today.setHours(24)
    let date = formatDate(today, 'yyyy-MM-dd', 'en-ID')
    let time = formatDate(timeDate, 'HH:mm:ss', 'en-ID')
    let dateTime = date+' '+time
    return this.http.post<any>(this.urlApi + 'login', JSON.stringify(params), this.httpAuthLogin())
        .pipe(map(user => {
            if (user) {
                const data = user
                localStorage.setItem('user-login', JSON.stringify(data))
                localStorage.setItem('date', dateTime)
                localStorage.setItem("language", '0');
                this.currentUserSubject.next(data)
            }
            return user;
        }),catchError(this.handleError));
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
  
  dateNow = new Date()
  serviceAuth() {
    let data:any={}
    if (localStorage.getItem('user-login') != null) {
      let lc = JSON.parse(localStorage.getItem('user-login'))
      data['tokenAuth'] = lc['data']['token']
      data['tenant_id'] = lc['data']['tenant_id']
      data['user_id'] = lc['data']['user_id']
    }
    return data
  }
  /*END LOGIN*/

  /*LOGISTIC */
  Shipping(data: any, urlMaster){
    return this.http.post(this.urlApi + urlMaster, JSON.stringify(data), this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleErrorShipping))
  }

  /*PAGINATION */
  Pagination(url){
    return this.http.get<any>(url, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  GetSearch(urlMaster) {
    return this.http.get(this.urlApi + urlMaster, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }

  /*API CRUD */
  /*GET */
  Get(urlMaster) {
    return this.http.get(this.urlApi + urlMaster+'/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  GetWithQuery(url) {
    return this.http.get(this.urlApi + url, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0), catchError(this.handleError))
  }

  /*CREATE */
  Create(data: any, urlMaster){
    return this.http.post(this.urlApi + urlMaster, JSON.stringify(data), this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  /*SHOW BY ID */
  Show(urlMaster){
    return this.http.get(this.urlApi + urlMaster, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  /*UPDATE */
  UpdateEtc(data:any, urlMaster){
    return this.http.post(this.urlApi + urlMaster, JSON.stringify(data), this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  Update(data:any, urlMaster){
    return this.http.put(this.urlApi + urlMaster, JSON.stringify(data), this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  /*DELETE */
  Delete(urlMaster){
    return this.http.get(this.urlApi + urlMaster, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }

  /*API SPECIAL*/
  MasterProduct(data, urlMaster){
    return this.http.post(this.urlApi + urlMaster, data, this.httpAuthMasterProduct(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }


  /*LIST DROPDOWN*/
  MemberList() {
    return this.http.get(this.urlApi +'member-list/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  WarehouseList() {
    return this.http.get(this.urlApi +'warehouse-list/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  QuotationList() {
    return this.http.get(this.urlApi +'quotation-list/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }


  /*CONTACT */
  /*MEMBER/CUSTOMER */
  GenerateCodeMember() {
    return this.http.get(this.urlApi + 'code-member/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  GenerateCodeSupplier() {
    return this.http.get(this.urlApi + 'code-supplier/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  GenerateCodeSales() {
    return this.http.get(this.urlApi + 'code-sales/'+this.serviceAuth()['tenant_id'], this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  SearchLocation(url) {
    return this.http.get(this.urlApi + 'location/'+url, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
  MemberByEc(id,data) {
    return this.http.patch(this.urlApi+'member/'+this.serviceAuth()['tenant_id']+'/approval/'+id,data, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }

  /*GENERAL UPLOAD */
  GeneralUpload(data) {
    return this.http.post(this.urlApi+'upload', data, this.httpAuthMasterProduct(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }

  /*UPDATE STATUS DELIVERY */
  StatusUpdate(url,data) {
    return this.http.patch(this.urlApi+url,data, this.httpAuth(this.serviceAuth()['tokenAuth']))
    .pipe(retry(0),catchError(this.handleError))
  }
}
