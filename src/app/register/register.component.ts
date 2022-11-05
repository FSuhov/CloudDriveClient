import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {  
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  changePassword(){
    const user = JSON.parse(localStorage.getItem('user'));
    const name = user.userName;
    this.model.UserName = name;
    
    this.accountService.changePassword(this.model);
  }

  cancel(){
    if(this.accountService.currentUser$){
      this.router.navigateByUrl('/files');
    }
    else{
      this.router.navigateByUrl('/');
    }
  }
}
