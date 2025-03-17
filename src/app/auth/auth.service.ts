import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';

const users = [{ email: 'tony.gamble@gmail.com', password: 'Test1234' }];
const dummyJwtToken = 'dummyLoginToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  constructor() {
    this.isLoggedIn = !!localStorage.getItem('auth');
    // afterNextRender(() => {
    // });
  }

  login(email: string, password: string) {
    if (!email || !password) return false;
    const user = users.find(
      (user) =>
        user.email.toLowerCase().trim() === email && user.password === password
    );
    if (!user) {
      this.isLoggedIn = false;
      return false;
    }
    localStorage.setItem('auth', dummyJwtToken);
    this.isLoggedIn = true;
    return true;
  }

  isAuthenticatedUser() {
    return this.isLoggedIn;
  }

  logout() {
    localStorage.removeItem('auth');
    this.isLoggedIn = false;
  }
}
