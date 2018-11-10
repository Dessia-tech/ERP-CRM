import { Component, OnInit, TemplateRef } from '@angular/core';
import { Contact } from '../../models'
import { ContactsService } from '../../services/contacts.service'
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact = new Contact;
  contact_id: number;
  confirm_delete_modal: BsModalRef;

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.contact_id = +this.route.snapshot.paramMap.get('contact_id');
    this.getContact(this.contact_id);
  }

  getContact(contact_id){
    this.contactsService.getContact(contact_id).subscribe(
      contact=>{
        this.contact = contact;
      })
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.confirm_delete_modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  closeDeleteModal() {
    this.confirm_delete_modal.hide();
    this.confirm_delete_modal = null;
  }

  deleteContact(){
    this.closeDeleteModal();
    this.contactsService.deleteContact(this.contact_id)
      .subscribe(message=>{
        this.router.navigate(['/contacts']);
      })
  }

}
