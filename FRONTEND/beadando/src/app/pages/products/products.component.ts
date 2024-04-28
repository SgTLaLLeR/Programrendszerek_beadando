import {Component, OnInit} from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {ZProductDTOOutput, ZProductFilterDTOInput} from "../../dtos/product";
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ZFileDTOOutput} from "../../dtos/file";
import { ApiService } from "../../shared/services/api"
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/dialog/dialog.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatSliderModule, FormsModule, HttpClientModule, NgForOf, NgOptimizedImage, NgIf, ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  sliderStart = 0;
  sliderEnd = 50000000;

  sortOrderDate = '';
  sortOrderPrice = '';

  nameFilter = ''; // Név alapján szűrés
  isAvailable = false;

  timer: any;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
  }

  images: ZFileDTOOutput[] = [];
  products: ZProductDTOOutput[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let filter: ZProductFilterDTOInput;

    if (this.isAvailable) {
      filter = {
        name: this.nameFilter,
        priceStart: this.sliderStart,
        priceEnd: this.sliderEnd,
        dateOrder: this.sortOrderDate,
        priceOrder: this.sortOrderPrice,
        isAvailable: true
      };
    } else {
      filter = {
        name: this.nameFilter,
        priceStart: this.sliderStart,
        priceEnd: this.sliderEnd,
        dateOrder: this.sortOrderDate,
        priceOrder: this.sortOrderPrice
      };
    }


    this.apiService.getData<ZProductDTOOutput[]>('/product/getFilteredProduct', filter).subscribe(
      productsData => {
        this.products = productsData;
        this.applyFilters();
      },
      error => {
        console.error(error);
      }
    );

    this.apiService.getData<ZFileDTOOutput[]>('/product/getAllProductImage').subscribe(
      imagesData => {
        this.images = imagesData;
        this.applyFilters();
      },
      error => {
        console.error(error);
      }
    );
  }

  applyFilters(): void {
    if (this.products && this.images) {
      this.assignImagesToProducts(this.images, this.products);
    }
  }
  applyNameFilter(): void {

    this.loadData();
  }
  applyPriceFilter(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.loadData();
    }, 500);
  }

  toggleSortOrderDate(): void {
    this.sortOrderDate = this.sortOrderDate === 'asc' ? 'desc' : 'asc';
    this.sortOrderPrice = '';
    this.loadData();
  }

  toggleSortOrderPrice(): void {
    this.sortOrderPrice = this.sortOrderPrice === 'asc' ? 'desc' : 'asc';
    this.sortOrderDate = '';
    this.loadData();
  }

  assignImagesToProducts(images: ZFileDTOOutput[], products: ZProductDTOOutput[]): void {
    for (const product of products) {
      const productImages = images.filter(image => image.productId === product.id);
      if (productImages.length > 0) {
        product.image = productImages[0].path;
      } else {
        product.image = 'uploads/default_image.jpg';
      }
    }
  }
  applyAvailabilityFilter(): void {
    this.isAvailable = !this.isAvailable;
    this.loadData();
  }

  buy(product : ZProductDTOOutput): void {
    this.apiService.getData<any>('/protected/product/buyProduct', product , {withCredentials : true}).subscribe(
      response => {
        console.log(response);
        this.openDialog('Siker!','Sikeres vásárlás');
        this.loadData()
      },
      error => {
        this.openDialog('Hiba történt',error.error.message);

      }
    );

  }

  updateSlider() {

    if (this.sliderStart >= 0 && this.sliderEnd >= 0 && this.sliderStart <= this.sliderEnd) {

      const slider = document.querySelector('mat-slider');
      if (slider) {
        slider.setAttribute('min', this.sliderStart.toString());
        slider.setAttribute('max', this.sliderEnd.toString());
      }
    }
  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
  }

}
