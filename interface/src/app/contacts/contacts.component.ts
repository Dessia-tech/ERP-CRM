import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service'
import { Contact, Organization } from '../models'
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

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

  constructor(private contactsService: ContactsService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.getContacts();
    this.getOrganizations();

  }

  createContact(){
    this.contactsService.createContact(this.contact_create).then((user) => {
      this.getContacts();
      this.messageService.add({severity:'info', summary:'User Created!'});
        })
        .catch((err) => {
          this.messageService.add({severity:'error', summary:'Error in user creation', detail:err.statusText});
        });
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
