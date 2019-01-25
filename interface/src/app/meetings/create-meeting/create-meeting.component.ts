import { Component, OnInit } from '@angular/core';
import { MeetingsService } from '../../services/meetings.service'
import { ContactsService } from '../../services/contacts.service'
import { Contact, Organization, Meeting } from '../../models'
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router} from '@angular/router';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {
  meeting: Meeting = new Meeting();
  start_date: Date = new Date();
  end_date: Date = new Date();
  contacts: Contact[];
  selected_contacts: Contact[];

  constructor(private contactsService: ContactsService,
              private meetingsService: MeetingsService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {
    this.getContacts();
    this.meeting.report = ''

  }

  getContacts(){
    this.contactsService.getContacts().subscribe(
      contacts=>{
        this.contacts = contacts;
      })
  }

  createMeeting(){
    this.meeting.start_date = this.start_date.getTime();
    this.meeting.end_date = this.end_date.getTime();
    this.meeting.contact_participants = [];
    for (let contact of this.selected_contacts){
      this.meeting.contact_participants.push(contact.id);
    }
    this.meetingsService.createMeeting(this.meeting);
    this.router.navigateByUrl('/meetings');
  }



}
