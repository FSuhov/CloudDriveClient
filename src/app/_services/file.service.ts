import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseUrl = environment.apiUrl;
  user: User;  

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  getHttpOption(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      })
    }
    return httpOptions;
  }

  getFiles() {
    const userName = JSON.parse(localStorage.getItem('user')).userName;
    return this.http.get<File[]>(this.baseUrl + 'list?userName=' + userName, this.getHttpOption());
  }
  
  deleteFile(url: string){
    return this.http.delete(url, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      }),
      observe: 'response'
    });    
  }

  downloadFile(fileName: string){
    const url = this.baseUrl+'download?userName=' 
    + this.user.userName + '&fileName=' + fileName;
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      }),
      reportProgress: true,
      responseType: 'blob',
      observe: 'events'
    });
  }

  getPresignedUrl(fileName: string){
    const url = this.baseUrl+'share?userName=' 
    + this.user.userName + '&fileName=' + fileName;
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      }),
      observe: 'response',
      responseType: 'text'
    });  
  }  
}
