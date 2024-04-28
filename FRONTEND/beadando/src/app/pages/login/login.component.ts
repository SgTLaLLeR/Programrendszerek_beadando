import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ZUserLoginDTOInput, ZUserRegisterDTOInput} from "../../dtos/user-login";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../shared/services/api";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {AuthService} from "../../shared/services/auth";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {


  constructor(private router: Router,
              private apiService: ApiService,
              public dialog: MatDialog,
              private authService: AuthService
              ) { }

  user: ZUserLoginDTOInput = {
    name: '',
    pw: ''
  }

  onSubmit() {
    this.apiService.getData<ZUserRegisterDTOInput>("/user/login", this.user,{ withCredentials: true } ).subscribe({
      next: data => {



        this.openDialog('Siker!','Sikeres bejelentkezés');
        this.authService.login();

        this.router.navigate(['/']);
      },
      error: error => {
        this.openDialog('Hiba történt',error.error.message);

      }
    });
  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
