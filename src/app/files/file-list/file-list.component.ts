import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { FileService } from 'src/app/_services/file.service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';
import { WindowService } from 'src/app/_services/window.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: File[];
  baseUrl = environment.apiUrl;
  user: User;  
  message: string;
  progress: number;
  fileName: string;
  presignedUrl: string;

  constructor(private fileService: FileService, private accountService: AccountService, 
    private router: Router, private toastr: ToastrService,
    private clipboard: Clipboard, private http: HttpClient,
    private windowRef: WindowService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if(this.user){
      this.loadFiles();
    }
    else{
      this.router.navigateByUrl('/');
    }
  }

  loadFiles() {
    this.fileService.getFiles().subscribe(files => {
      this.files = files;
    })
  }

  deleteFile(fileName: string){ 
    const url = this.baseUrl+'delete?userName=' 
    + this.user.userName + '&fileName=' + fileName;
    
    this.fileService.deleteFile(url).subscribe(response => {  
      console.log(response.status);
      if(response.status === 204) {   
        this.loadFiles();
      }
      else {
        console.log(response.statusText);
      }
    },
    error => console.log(error))    
  }

  download(fileName: string){    
    this.fileName = fileName;
    this.fileService.downloadFile(fileName).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round((100 * event.loaded) / event.total);
      else if (event.type === HttpEventType.Response) {
          this.message = 'Download success.';
          this.downloadFile(event);
      }
  });
  }

  onClipboardCopy(fileName: string) {

    this.setPresignedUrl(fileName);
    console.log(this.presignedUrl);
    
  }

  setPresignedUrl(fileName: string) {
    const url = this.baseUrl+'share?userName=' 
    + this.user.userName + '&fileName=' + fileName;

    this.getSharedLink(url).subscribe( response => {
      this.presignedUrl = response;
      
      console.log(this.presignedUrl);

      this.windowRef.nativeWindow.navigator.clipboard.writeText(this.presignedUrl);
    });     
  }

  getSharedLink(url: string) {
    return this.http.get(url, {
      headers: new HttpHeaders ({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      }),
      responseType: 'text'
    });
  }

  private downloadFile = (data: HttpResponse<Blob>) => {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = this.fileName;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  
}
