import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { User, Token } from '../models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export const TOKEN_NAME: string = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  private user:User;
  private login_url: string = environment.api_url+'/auth';
  private infos_url: string = environment.api_url+'/account/infos';
  private reset_email_password_url:string = environment.api_url+'/password/reset-email'
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient
  ) { }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  updateUser(user:User):void{
    this.user=user;
    this.setUser(user);
  }

  setUser(user:User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  forgetUser():void{
    localStorage.removeItem('user');
  }


  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    let expired=true;
    if(!token) token = this.getToken();
    if(!token) {
      expired=true;
    }
    else{
      const date = this.getTokenExpirationDate(token);
      if(date === undefined){expired=false;}
      else{
        expired=!(date.valueOf() > new Date().valueOf());
      }
    }
    if (expired){
      this.forgetUser();
      delete this.user;
    }
    else{
      if (!this.user){
        this.user=this.getUser();
      }
    }
    return expired

  }

  login(email,password): Promise<boolean> {
    // console.log('login user',email);
    return this.http
      .post<Token>(`${this.login_url}`, JSON.stringify({email:email,password:password}), { headers: this.headers })
      .toPromise()
      .then(res => {
        this.setToken(res.access_token);
        // this.setUser(res.)

          //console.log('login user',user);
        this.http.get<User>(this.infos_url).subscribe(user=>{
        this.setUser(user);
        this.user=user;

        })

        return true;
      });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_NAME);
    this.forgetUser();
    delete this.user;
  }

  resetEmailPassword(email):Promise<any> {
    return this.http
        .post(`${this.reset_email_password_url}`, JSON.stringify({email:email}), { headers: this.headers })
        .toPromise()
        .then((res) => {return res;});
    }

}
