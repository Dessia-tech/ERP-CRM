import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'
import { User } from './models'
import { Router } from '@angular/router';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DessIA ERP-CRM';
  items: MenuItem[];
  display_sidebar: boolean;
  // user: User;

  constructor(
    public authService: AuthService,
    private router: Router) {


      }

  ngOnInit() {
    this.authService.isTokenExpired();

    this.items = [
                {
                    label: 'Menu',
                    icon: 'pi pi-bars',
                    command: (event) => {
                     this.display_sidebar = true;}
                },
                {
                    label: 'Dashboard',
                    icon: 'pi pi-th-large',
                    // items: []
                },
                {
                    label: 'Contacts',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {label: 'List', icon: 'pi pi-list', routerLink: '/contacts'},
                        {label: 'Add', icon: 'pi pi-fw pi-plus',
                         routerLink: '/contacts/create'}
                    ],
                    routerLink: '/contacts'
                }
            ];

   }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }



}
