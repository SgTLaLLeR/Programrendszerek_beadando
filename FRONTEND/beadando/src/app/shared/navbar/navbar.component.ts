import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth";
import {Subscription} from "rxjs";
import {ApiService} from "../services/api";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  subscription?: Subscription;

  protected readonly open = open;
  isMobileMenuOpen: boolean = false;

  constructor(private authService: AuthService, private apiService: ApiService,public dialog: MatDialog,private router: Router) {
  }


  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit() {
    this.subscription = this.authService.isAuthenticated.subscribe(value => {
      this.isLoggedIn = value;
    });

    // Check localStorage on page load
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.authService.login();
    } else {
      this.authService.logout();
    }

    this.authService.checkAuthenticated();
  }

  logout() {
    this.apiService.getData<any>("/protected/user/logout",{}, {withCredentials: true}).subscribe({
      next: data => {

        this.openDialog('Siker!', 'Sikeres kijelentkezés');
        this.authService.logout();

      },
      error: error => {
        this.openDialog('Hiba történt', error.error.message);


      }
    });

  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
