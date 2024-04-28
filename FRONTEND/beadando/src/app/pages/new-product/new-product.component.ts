import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ApiService} from "../../shared/services/api";
import {ZProductDTOOutput} from "../../dtos/product";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  image: File | null = null;
  name: string = '';
  description: string = '';
  price: number | null = null;

  constructor(public dialog: MatDialog, private apiService : ApiService, private router : Router) {
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }



  onSubmit() {
    if (!this.image || !this.name || !this.description || !this.price) {
      console.error('Some fields are empty!');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.image);
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    this.apiService.getData<ZProductDTOOutput[]>('/protected/product/createProduct', formData, {withCredentials : true}).subscribe(
      response => {
        this.openDialog('Success', 'Product created successfully');
        this.router.navigate(['/myproducts']);

      },
      error => {
        this.openDialog('Hiba történt',error.error.message);
        console.error(error);
      }
    );


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
