import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((res) => {
        console.log(res);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    console.log(authData);
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((res) => {
        const token = res.token;
        this.token = token;

        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;

    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
