import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e =>{
        if(e.status == 400){
          if(this.authService.isAuthenticated()){
            this.authService.logout
          }
          this.router.navigate(['/'])
        }
        if(e.status == 403){
          this.router.navigate(['/menu'])
        }
        return throwError(e);
      })
    );
  }



}
