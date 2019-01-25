import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
// import { CreateContactComponent } from './contacts/create-contact/create-contact.component';
import { ContactComponent } from './contacts/contact/contact.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationComponent } from './organizations/organization/organization.component';
import { AccountComponent } from './account/account.component';

import { MeetingsComponent } from './meetings/meetings.component';
import { MeetingComponent } from './meetings/meeting/meeting.component';
import { CreateMeetingComponent } from './meetings/create-meeting/create-meeting.component';

import { AuthGuard } from './auth.guard'

const routes: Routes = [
    { path: '', component: LandingComponent},
    { path: 'login', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
    { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
    { path: 'contacts/:contact_id', component: ContactComponent, canActivate: [AuthGuard]},
    { path: 'organizations', component: OrganizationsComponent, canActivate: [AuthGuard]},
    { path: 'organizations/:organization_id', component: OrganizationComponent, canActivate: [AuthGuard]},
    { path: 'meetings', component: MeetingsComponent, canActivate: [AuthGuard]},
    { path: 'meetings/create', component: CreateMeetingComponent, canActivate: [AuthGuard]},
    { path: 'meetings/:meeting_id', component: MeetingComponent, canActivate: [AuthGuard]},
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
