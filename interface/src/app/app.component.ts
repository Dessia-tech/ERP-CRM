import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'
import { User } from './models'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DessIA ERP-CRM';
  // user: User;

  constructor(
    public authService: AuthService,
    private router: Router) {


      }

  ngOnInit() {
    this.authService.isTokenExpired();
   }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
