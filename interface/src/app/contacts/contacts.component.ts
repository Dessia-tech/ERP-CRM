import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service'
import { OrganizationsService } from '../services/organizations.service'
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

  columns: any[];

  constructor(private contactsService: ContactsService,
              private organizationService: OrganizationsService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.getContacts();
    this.getOrganizations();

    this.columns = [
      { field: 'full_name', header: 'Full name' },
      { field: 'email', header: 'Email' },
      { field: 'organization', header: 'Organization' }
    ];

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
    this.organizationService.getOrganizations().subscribe(
      organizations=>{
        this.organizations_choices = [{label:'Select Organization', value:null}];
        for (let organization of organizations){
          this.organizations_choices.push({label: organization.name, value: organization.id})
        }
      })
  }

}
