import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginStatus = new BehaviorSubject<boolean>(false);

  login() {
    this.loginStatus.next(true);
  }

  logout() {
    this.loginStatus.next(false);
  }

  get isAuthenticated() {
    return this.loginStatus.asObservable();
  }


}
