import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'https://trainingg.herokuapp.com/register';
  private loginUrl = 'https://trainingg.herokuapp.com/signin';
  private verifyTokenUrl = 'https://trainingg.herokuapp.com/v';

  constructor(private http: HttpClient, private router: Router) { }
  registerUser(user) {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user) {
    return this.http.post<any>(this.loginUrl, user);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    if (!localStorage.getItem('token')) {
      return false;
    }
    return true;
  }

  isTokenValid(token): Observable<boolean> {
    console.log('verifing');
    return this.http.post<any>(this.verifyTokenUrl, {token});
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
