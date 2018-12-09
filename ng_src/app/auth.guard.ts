import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { from, Observable, of } from 'rxjs';
import { catchError, map,   } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      return this.authService.isTokenValid(token)
      .pipe(
        map(e => {
          if (e) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError((err) => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
