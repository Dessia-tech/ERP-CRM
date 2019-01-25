import { Component, OnInit } from '@angular/core';
import { Organization, Contact } from '../../models'
import { OrganizationsService } from '../../services/organizations.service'
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../services/contacts.service'
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  organization: Organization = new Organization;
  organization_id: number;
  display_delete_organization: boolean;
  single_contacts: any[];
  selected_contacts: SelectItem[];

  constructor(
    private organizationsService: OrganizationsService,
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.organization_id = +this.route.snapshot.paramMap.get('organization_id');
    this.getOrganization();
    this.display_delete_organization = false;
    this.getSingleContacts();
  }

  getOrganization(){
    this.organizationsService.getOrganization(this.organization_id).subscribe(
      organization=>{
        this.organization = organization;
      })
  }

  getSingleContacts(){
    this.contactsService.getContacts().subscribe(
      contacts=>{

        this.single_contacts = new Array;
        for (let contact of contacts) {
          if (contact.organization == null){
            this.single_contacts.push({label: contact.first_name+' '+contact.last_name,
                                        value: contact.id})
          }
        }
      })
  }


  openDeleteConfirm() {
    this.display_delete_organization = true;

  }

  addContactsToOrganization(){
    for (let contact_id of this.selected_contacts){
      this.organizationsService.addContactToOrganization(contact_id, this.organization_id)
      .then(res=>{
        this.getOrganization();
        this.getSingleContacts();
      })
    }

  }

  deleteOrganization(){
    // this.closeDeleteModal();
    this.organizationsService.deleteOrganization(this.organization_id)
      .subscribe(message=>{
        this.router.navigate(['/organizations']);
      })
  }

  }
