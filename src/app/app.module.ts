import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FileCardComponent } from './files/file-card/file-card.component';
import { FileListComponent } from './files/file-list/file-list.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FileUploaderComponent } from './files/file-uploader/file-uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
//import { WindowRef } from './_services/WindowRef';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FileCardComponent,
    FileListComponent,
    HomeComponent,
    RegisterComponent,
    FileUploaderComponent
  ],
  imports: [
    BrowserModule,
    ClipboardModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    FileUploadModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    //{ provide: WindowRef, useClass: WindowRef, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
