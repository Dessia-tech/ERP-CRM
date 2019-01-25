import { Component, OnInit } from '@angular/core';
import { MeetingsService } from '../../services/meetings.service'
import { ContactsService } from '../../services/contacts.service'
import { Contact, Organization, Meeting } from '../../models'
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  meeting: Meeting;
  edit_mode: boolean;
  meeting_id: number;
  all_contacts: Contact[];
  selected_contacts: Contact[];
  start_date: Date = new Date();
  end_date: Date = new Date();

  constructor(private contactsService: ContactsService,
              private meetingsService: MeetingsService,
              private messageService: MessageService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.edit_mode = false;
    this.meeting_id = +this.route.snapshot.paramMap.get('meeting_id');
    this.getMeeting();

  }

  getContacts(){
    this.contactsService.getContacts().subscribe(
      contacts=>{
        this.all_contacts = contacts;
      })
  }

  getMeeting(){
    this.meetingsService.getMeeting(this.meeting_id).subscribe(
      meeting=>{
        this.meeting = meeting;
        this.all_contacts = this.meeting.contact_participants;
        this.selected_contacts = this.meeting.contact_participants;
      })
  }

  changeEditMode(){
    this.edit_mode = !this.edit_mode;
    if (!this.edit_mode){
      this.getMeeting();//To flush edits
      this.all_contacts = this.selected_contacts;
    }
    else{
      this.getContacts();
    }
  }

  editMeeting(){
    this.meeting.start_date = this.start_date.getTime();
    this.meeting.end_date = this.end_date.getTime();
    this.meeting.contact_participants = [];
    for (let contact of this.selected_contacts){
      this.meeting.contact_participants.push(contact.id);
    }
    this.meetingsService.editMeeting(this.meeting_id, this.meeting).then((user) => {
      this.messageService.add({severity:'info', summary:'Meeting updated'});
      this.changeEditMode();
    })
    .catch((err) => {
      this.messageService.add({severity:'error', summary:'Meeting update error', detail:err.statusText});
    });
  }

}
