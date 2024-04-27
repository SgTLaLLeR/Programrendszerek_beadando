import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ZProductDTOOutput} from "../../dtos/product";
import {ApiService} from "./api";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginStatus = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {
  }

  login() {
    this.loginStatus.next(true);
    localStorage.setItem('isLoggedIn', 'true'); // Set flag in localStorage
  }

  logout() {
    this.loginStatus.next(false);
    localStorage.removeItem('isLoggedIn'); // Remove flag from localStorage
  }

  get isAuthenticated() {
    return this.loginStatus.asObservable();
  }

  public checkAuthenticated() {
    this.apiService.getData<any>('/checkAuth', {}, {withCredentials: true}).subscribe(
      response => {
        if (response) {
          console.log('Meghívtak a validra');
          this.login();
        }
        else if (!response) {
          console.log('Meghívtak a nem validra');
          this.logout();

        }

      },
      error => {
        console.error(error);
        this.logout();
      }
    );
  }


}
