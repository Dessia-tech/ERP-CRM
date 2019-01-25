import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Contact } from '../models'

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getContact(contact_id): Observable<Contact>{
    return this.http.get<Contact>(environment.api_url+'/contacts/'+String(contact_id));
  }

  getContacts(): Observable<Contact[]>{
    return this.http.get<Contact[]>(environment.api_url+'/contacts');
  }

  createContact(contact):Promise<any>{
    return this.http
      .post(environment.api_url+'/contacts/create', JSON.stringify(contact), { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }

  deleteContact(contact_id):Observable<any>{
    return this.http.delete<any>(environment.api_url+'/contacts/'+String(contact_id)+'/delete');
  }

}
