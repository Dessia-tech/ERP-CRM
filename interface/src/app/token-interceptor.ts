import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  auth:AuthService;
  inj:Injector;

  constructor(inj: Injector) {
    //this.auth = inj.get(AuthService);
    this.inj=inj;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.inj.get(AuthService);
    request = request.clone({
      setHeaders: {
        Authorization: `JWT ${this.auth.getToken()}`
      }
    });

    return next.handle(request);
  }
}
