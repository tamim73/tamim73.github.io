import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

  mobileQuery: MediaQueryList;
  xlScreenQuery: MediaQueryList;
  snavItems = [
    { divider: true },
    { icon: 'business', text: 'Departments', },
    { divider: true },
    { icon: 'people', text: 'Employees', },
    { divider: true },
  ];
  //
  // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
  //

  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 720px)');
    this.xlScreenQuery = media.matchMedia('(min-width: 1200px)');
    this._mobileQueryListener = () => {changeDetectorRef.detectChanges();
                                        console.log(this.mobileQuery);
                                        console.log(this.xlScreenQuery); };
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.xlScreenQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.xlScreenQuery.removeListener(this._mobileQueryListener);

  }
  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    console.log('on init');
  }
  logout() {
    this.authService.logout();
  }
}
