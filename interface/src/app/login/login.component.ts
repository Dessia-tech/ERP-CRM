import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;
  returnUrl: string;
  email_reset:string;

  constructor(
     private auth: AuthService,
     private route: ActivatedRoute,
     private router: Router,
     private messageService: MessageService
  ) { }

  ngOnInit() {
    this.auth.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

  }

  onLogin() {
    this.auth.login(this.email, this.password)
    .then((user) => {
      this.router.navigateByUrl(this.returnUrl);
      this.messageService.add({severity:'info', summary:'Successfully logged in'});
    })
    .catch((err) => {
      this.messageService.add({severity:'error', summary:'Login Error', detail:err.statusText});
    });
  }

  resetEmailPassword():void{
    this.auth.resetEmailPassword(this.email_reset)
    .then((res)=>{
      // this.notificationsService.notification(res.message);
    })
    .catch((err) => {
      // this.notificationsService.notificationError('Password reset error');
    });
  }

}
