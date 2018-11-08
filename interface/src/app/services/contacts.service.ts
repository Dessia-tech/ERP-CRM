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


  getContacts(): Observable<Contact[]>{
    console.log(environment.api_url+'/contacts');
    return this.http.get<Contact[]>(environment.api_url+'/contacts');
  }

  createContact(contact):Promise<any>{
    return this.http
      .post(environment.api_url+'/contacts/create', JSON.stringify(contact), { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }

}
