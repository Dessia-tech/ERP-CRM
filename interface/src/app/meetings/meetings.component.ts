import { Component, OnInit } from '@angular/core';
// import { ContactsService } from '../services/contacts.service'
import { MeetingsService } from '../services/meetings.service'
import { Contact, Organization, Meeting } from '../models'
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[];

  constructor(private meetingsService: MeetingsService,
              // private organizationService: OrganizationsService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.getMeetings();
  }

  getMeetings(){
    this.meetingsService.getMeetings().subscribe(
      meetings=>{
        this.meetings = meetings;
      })
  }

}
