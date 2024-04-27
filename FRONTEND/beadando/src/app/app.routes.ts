import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {ProductsComponent} from "./pages/products/products.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {MyproductsComponent} from "./pages/myproducts/myproducts.component";
import {NewProductComponent} from "./pages/new-product/new-product.component";
import {PurchaseHistoryComponent} from "./pages/purchase-history/purchase-history.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'myproducts', component: MyproductsComponent },
  { path: 'newProduct', component: NewProductComponent },
  { path: 'purchaseHistory', component: PurchaseHistoryComponent},
];
