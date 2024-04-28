import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ZUserRegisterDTOInput} from "../../dtos/user-login";
import {ApiService} from "../../shared/services/api";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/dialog/dialog.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registrationData : ZUserRegisterDTOInput = {
    email: '',
    name: '',
    pw: ''
  };

  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog,) { }

  onSubmit() {
    this.apiService.getData<ZUserRegisterDTOInput>("/user/register", this.registrationData).subscribe({
      next: data => {



        this.openDialog('Siker!','Köszönjük hogy regisztráltál.');


        this.router.navigate(['/login']);
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
