import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Organization } from '../models'

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getOrganization(organization_id): Observable<Organization>{
    return this.http.get<Organization>(environment.api_url+'/organizations/'+String(organization_id));
  }

  getOrganizations(): Observable<Organization[]>{
    return this.http.get<Organization[]>(environment.api_url+'/organizations');
  }

  createOrganization(organization):Promise<any>{
    return this.http
      .post(environment.api_url+'/organizations/create', JSON.stringify(organization), { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }

  deleteOrganization(organization_id):Observable<any>{
    return this.http.delete<any>(environment.api_url+'/organizations/'+String(organization_id)+'/delete');
  }

  addContactToOrganization(contact_id, organization_id):Promise<any>{
    return this.http
      .post(environment.api_url+'/organizations/'+organization_id+'/contacts/add',
            JSON.stringify({contact_id: contact_id}),
            { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }
}
