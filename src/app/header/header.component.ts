import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../signup/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  userIsAuthenticated = false;
  private authListenrSubs: Subscription;

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenrSubs = this.authService
      .getAuthStatusListener()
      .subscribe((val) => {
        this.userIsAuthenticated = val;
      });

    console.log(this.userIsAuthenticated);
  }

  onLogout() {
    console.log('logout');
    this.authService.logout();
  }

  ngOnDestory() {
    this.authListenrSubs.unsubscribe();
  }
}
