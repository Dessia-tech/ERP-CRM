import { Component, OnInit, Host } from '@angular/core';
import { Organization } from '../../models'
import { OrganizationsService } from '../../services/organizations.service'
import { OrganizationsComponent } from '../../organizations/organizations.component'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css']
})
export class CreateOrganizationComponent implements OnInit {
  organization_create: Organization = new Organization;

  constructor(private organizationsService: OrganizationsService,
              private messageService: MessageService,
              @Host() private app: OrganizationsComponent) { }

  ngOnInit() {

  }


  createOrganization(){
      this.organizationsService.createOrganization(this.organization_create)
      .then((user) => {
      // this.getOrganizations();
      this.messageService.add({severity:'info', summary:'Organization created!'});
      this.app.getOrganizations();
        })
        .catch((err) => {
          this.messageService.add({severity:'error', summary:'Error in organization creation', detail:err.statusText});
        });
      }

}
