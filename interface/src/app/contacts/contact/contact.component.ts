import { Component, OnInit, TemplateRef } from '@angular/core';
import { Contact } from '../../models'
import { ContactsService } from '../../services/contacts.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact = new Contact;
  contact_id: number;
  display_delete_contact: boolean;

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.contact_id = +this.route.snapshot.paramMap.get('contact_id');
    this.getContact(this.contact_id);
    display_delete_contact = false;
  }

  getContact(contact_id){
    this.contactsService.getContact(contact_id).subscribe(
      contact=>{
        this.contact = contact;
      })
  }

  openDeleteConfirm() {
    this.display_delete_contact = true;

  }
  //
  // closeDeleteModal() {
  //   this.confirm_delete_modal.hide();
  //   this.confirm_delete_modal = null;
  // }

  deleteContact(){
    // this.closeDeleteModal();
    this.contactsService.deleteContact(this.contact_id)
      .subscribe(message=>{
        this.router.navigate(['/contacts']);
      })
  }

}
