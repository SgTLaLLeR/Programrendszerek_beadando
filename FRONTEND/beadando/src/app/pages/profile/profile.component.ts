import {Component, OnInit} from '@angular/core';
import {ZUserProfileDTO, ZUserRegisterDTOInput} from "../../dtos/user-login";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../../shared/services/api";
import {MatDialog} from "@angular/material/dialog";
import {data} from "autoprefixer";
import {AuthService} from "../../shared/services/auth";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DialogComponent} from "../../shared/dialog/dialog.component";



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit{
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog, private authService: AuthService) {
  }

  user: ZUserProfileDTO = {
    id: '',
    email: '',
    name: '',
    pw: ''
  }


  ngOnInit() {
    this.apiService.getData<ZUserProfileDTO>("/protected/user/profile", {}, {withCredentials: true}).subscribe({
      next: data => {
        this.user.id = data.id
        this.user.email = data.email
        this.user.name = data.name;
        this.user.pw = data.pw;


      },


      error: error => {
        console.log(error)
        this.router.navigate(['/']);

      }
    });
    this.authService.isAuthenticated.subscribe(value => {
      console.log(value);
    });
  }

  editMode = {
    email: false,
    name: false,
    password: false,
  };

  toggleEditMode(field: 'email' | 'name' | 'password') {

    this.editMode[field] = !this.editMode[field];
  }

  saveChanges() {
    console.log(this.user);

    if (this.editMode.email) {
      this.toggleEditMode("email");

    }
    if (this.editMode.name) {
      this.toggleEditMode('name');
    }
    if (this.editMode.password) {
      this.toggleEditMode('password');
    }

    this.apiService.getData<ZUserRegisterDTOInput>("/protected/user/update", this.user, {withCredentials: true}).subscribe({
      next: data => {


        this.openDialog('Siker!', 'Sikeres adatfrissítés');
        this.authService.login();

        this.router.navigate(['/profile']);
      },
      error: error => {
        this.openDialog('Hiba történt', error.error.message);
      }
    });


  }

  cancelEdit() {
    this.editMode['email'] = false;
    this.editMode['password'] = false;
    this.editMode['name'] = false;

  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {title: title, message: message}
    });

    dialogRef.afterClosed().subscribe(result => {
    });


  }
}
