import { Component, OnInit } from '@angular/core';
import { OrganizationsService } from '../services/organizations.service'
import { Organization } from '../models'

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[];

  constructor(private organizationService: OrganizationsService) { }

  ngOnInit() {
    this.getOrganizations();
  }

  getOrganizations(){
    this.organizationService.getOrganizations().subscribe(
      organizations=>{
        this.organizations = organizations;
      })
  }

}
