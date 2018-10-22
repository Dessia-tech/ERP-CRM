import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models';

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
     private router: Router
  ) { }

  ngOnInit() {
    this.auth.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

  }

  onLogin() {
    //    this.notificationsService.modal('Successfully logged in!');
    this.auth.login(this.email, this.password)
    .then((user) => {
      console.log('logged',user);
      // this.notificationsService.notification('Successfully logged in!');
      this.router.navigateByUrl(this.returnUrl);
    })
    .catch((err) => {
      // this.notificationsService.notificationError('Login Error');
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
