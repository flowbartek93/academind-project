import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../signup/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;

  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    console.log(form.value);

    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(form.value.email, form.value.password);
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        console.log(authStatus);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
