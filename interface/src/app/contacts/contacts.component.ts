import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service'
import { Contact } from '../models'

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[];
  contact_create: Contact = new Contact;

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    this.getContacts();
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

}
