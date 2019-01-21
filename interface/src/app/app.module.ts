import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token-interceptor'

import { AuthService } from './services/auth.service';
import { ContactsService } from './services/contacts.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactComponent } from './contacts/contact/contact.component';
// import { CreateContactComponent } from './contacts/create-contact/create-contact.component';


import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GravatarModule } from  'ngx-gravatar';

// PrimeNG Modules
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';

// PrimeNg Services
import { MessageService } from 'primeng/api';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LandingComponent,
    ContactsComponent,
    ContactComponent,
    AccountComponent,
    // CreateContactComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    TableModule,
    DropdownModule,
    CardModule,
    AccordionModule,
    DialogModule,
    SidebarModule,
    GravatarModule

  ],
  providers: [
    AuthService,
    ContactsService,
    MessageService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
