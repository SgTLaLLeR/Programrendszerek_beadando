import { Component } from '@angular/core';
import {ZProductDTOOUpdate, ZProductDTOOutput} from "../../dtos/product";

import {ApiService} from "../../shared/services/api";

import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ZFileDTOOutput} from "../../dtos/file";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-myproducts',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './myproducts.component.html',
  styleUrl: './myproducts.component.scss'
})
export class MyproductsComponent {
  editMode: string | null = null;
  editedImage: File | null = null;
  images: ZFileDTOOutput[] = [];
  products: ZProductDTOOutput[] = [];
  editedProduct : ZProductDTOOUpdate = {
    id : '',
    name: '',
    description: '',
    price: 0,
    isAvailable: false,
    uploadedAt: new Date(),
    userId: ''
  }



  constructor(private apiService: ApiService, public dialog: MatDialog, private router: Router, ) {
  }

  ngOnInit() {
    this.apiService.getData<ZProductDTOOutput[]>("/protected/product/getProductByUserId", {}, {withCredentials: true}).subscribe({
      next: data => {
        this.products = data;
        this.assignImagesToProducts(this.images, this.products);

      },

      error: error => {
        console.log(error)

      }
    });
    this.apiService.getData<ZFileDTOOutput[]>('/product/getAllProductImage').subscribe(
      imagesData => {
        this.images = imagesData;
        this.assignImagesToProducts(this.images, this.products);
      },
      error => {
        console.error(error);
      }
    );
  }

  assignImagesToProducts(images: ZFileDTOOutput[], products: ZProductDTOOutput[]): void {
    for (const product of products) {
      const productImages = images.filter(image => image.productId === product.id);
      if (productImages.length > 0) {
        product.image = productImages[0].path;
        product.imageId = productImages[0].id;
      } else {
        product.image = 'uploads/default_image.jpg';
      }
    }
  }

  deleteProduct(id: string) {
    this.apiService.getData<any>("/protected/product/deleteProduct", {id}, {withCredentials: true}).subscribe({
      next: data => {
        this.openDialog('Sikeres!', 'Sikeres törlés');

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/myproducts']);
        });
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
  startEdit(productId: string) {
    this.editMode = productId;
  }

  cancelEdit() {
    this.editMode = null;
  }

  onFileSelected(event: any) {
    this.editedImage = event.target.files[0];
  }

  updateProduct(product: any) {
    const formData = new FormData();
    this.editedProduct.id = product.id;
    this.editedProduct.name = product.name;
    this.editedProduct.description = product.description;
    this.editedProduct.price = product.price;
    this.editedProduct.isAvailable = product.isAvailable;
    this.editedProduct.imageId = product.imageId;
    formData.append('id', this.editedProduct.id.toString());
    formData.append('name', this.editedProduct.name);
    formData.append('description', this.editedProduct.description);
    formData.append('price', this.editedProduct.price.toString());
    formData.append('isAvailable', this.editedProduct.isAvailable.toString());
    if(this.editedProduct.imageId){
      formData.append('imageId', this.editedProduct.imageId.toString());
    }
    if (this.editedImage) {
      formData.append('file', this.editedImage);
    }

    this.cancelEdit();
    this.sendNewProduct(formData);

  }

  sendNewProduct(form : FormData) {
    this.apiService.getData<any>("/protected/product/updateProduct", form, {withCredentials: true}).subscribe({
      next: data => {
        this.openDialog('Sikeres!', 'Sikeres mentés');

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/myproducts']);
        });
      },


      error: error => {
        this.openDialog('Hiba történt',error.error.message);
      }
    });

  }


  suspendProduct(product: ZProductDTOOUpdate) {
    if(product.isAvailable){
      product.isAvailable = false;
      console.log(product.isAvailable)
      this.apiService.getData<any>("/protected/product/updateProductState", product, {withCredentials: true}).subscribe({
        next: data => {

        },
        error: error => {
          this.openDialog('Hiba történt',error.error.message);
        }
      });
    } else {
      product.isAvailable = true;
      console.log(product.isAvailable)
      this.apiService.getData<any>("/protected/product/updateProductState", product, {withCredentials: true}).subscribe({
        next: data => {

        },
        error: error => {
          this.openDialog('Hiba történt',error.error.message);
        }
      });

    }


  }


}
