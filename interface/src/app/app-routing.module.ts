import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactComponent } from './contacts/contact/contact.component';

import { AuthGuard } from './auth.guard'

const routes: Routes = [
    { path: '', component: LandingComponent},
    { path: 'login', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
    { path: 'contacts/:contact_id', component: ContactComponent, canActivate: [AuthGuard]},
  ]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
