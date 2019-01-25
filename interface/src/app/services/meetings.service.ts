import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Meeting } from '../models'


@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }


  getMeeting(meeting_id): Observable<Meeting>{
    return this.http.get<Meeting>(environment.api_url+'/meetings/'+String(meeting_id));
  }

  getMeetings(): Observable<Meeting[]>{
    return this.http.get<Meeting[]>(environment.api_url+'/meetings');
  }

  createMeeting(meeting):Promise<any>{
    return this.http
      .post(environment.api_url+'/meetings/create', JSON.stringify(meeting), { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }

  editMeeting(meeting_id, meeting):Promise<any>{
    return this.http
      .post(environment.api_url+'/meetings/'+JSON.stringify(meeting_id)+'/edit', JSON.stringify(meeting), { headers: this.headers })
      .toPromise()
      .then(res => {return res});
  }

  deleteMeeting(meeting_id):Observable<any>{
    return this.http.delete<any>(environment.api_url+'/meetings/'+String(meeting_id)+'/delete');
  }

}
