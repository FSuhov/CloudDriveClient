import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, take, tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getHttpOption(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      })
    }
    return httpOptions;
  }

  login(model: any){
    return this.http.post(this.baseUrl+'user/login', model).pipe(
      map((response: any) => {
        const user = response;
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }  

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  changePassword(model: any){
    this.http.post(this.baseUrl+'user/changePassword', model,
    {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      }),
      observe: 'response',
      responseType: 'text'
    }).subscribe(
      response => {  
        console.log(response.status);
        if(response.status === 200) {   
          localStorage.removeItem('user');
          this.currentUserSource.next(null);
          this.router.navigateByUrl('/');
        }
        else {
          console.log(response.statusText);
        }
      },
      error => console.log(error))     
  }

  // changePassword(model: any){
  //   return this.http.post(this.baseUrl+'user/changePassword', model).pipe(
  //     map((user: User) => {
  //       if(user){
  //         localStorage.removeItem('user');
  //         this.currentUserSource.next(null);
  //       }
  //     })
  //   )
  // }
}


