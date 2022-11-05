import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { FileListComponent } from './files/file-list/file-list.component';
import { FileUploaderComponent } from './files/file-uploader/file-uploader.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'files', component: FileListComponent },
  {path: 'changePassword', component: RegisterComponent },
  {path: 'upload', component: FileUploaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
