import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service'
import { Contact, Organization } from '../models'
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[];
  contact_create: Contact = new Contact;
  organization: SelectItem[];
  organizations_choices: any[];

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    this.getContacts();
    this.getOrganizations();

  }

  createContact(){
    this.contactsService.createContact(this.contact_create);
    this.getContacts();
  }

  getContacts(){
    this.contactsService.getContacts().subscribe(
      contacts=>{
        this.contacts = contacts;
      })
  }

  getOrganizations(){
    this.organizations_choices = [
             {label:'Select Organization', value:null},
             {label:'Dessia', value:{id:1, name: 'New York'}}
         ];

  }

}
