import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  progress: number;
  message: string;
  baseUrl = environment.apiUrl;  
  user: User;
  @Output() public onUploadFinished = new EventEmitter();

  uploader: FileUploader;
  hasBaseDropzoneOver = false;

  constructor(private accountService: AccountService, private http: HttpClient) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);    
   }

  ngOnInit(): void {  
    this.initializeUploader();  
  }
  
  fileOverBase(e: any){
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'upload?userName=' + this.user.userName,
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        console.log(response);
      }
    }
  }


  // uploadFile = (files) => {
  //   if (files.length === 0) {
  //     return;
  //   }    
  //   let fileToUpload = <File>files[0];
  //   const formData = new FormData();
  //   formData.append('file', fileToUpload, fileToUpload.name);    
    
  //   this.http.post(this.baseUrl + 'upload?userName=' + this.user.userName, formData, 
  //     { 
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + this.user.token
  //       }),
  //       reportProgress: true, 
  //       observe: 'events'        
  //     })
  //     .subscribe({
  //       next: (event) => {
  //       if (event.type === HttpEventType.UploadProgress)
  //         this.progress = Math.round(100 * event.loaded / event.total);
  //       else if (event.type === HttpEventType.Response) {
  //         this.message = 'Upload success.';
  //         this.onUploadFinished.emit(event.body);
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => console.log(err)
  //   });
  // }

}
