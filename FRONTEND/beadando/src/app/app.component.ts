import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {LoginComponent} from "./pages/login/login.component";
import {NavbarComponent} from "./shared/navbar/navbar.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {ProductsComponent} from "./pages/products/products.component";
import {HttpClientModule} from "@angular/common/http";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, LoginComponent, NavbarComponent, FooterComponent, ProductsComponent, HttpClientModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beadando';
  constructor(private router: Router) { }

  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register'
      || this.router.url === '/profile' || this.router.url === '/myproducts' || this.router.url ==='/newProduct'
      || this.router.url === '/purchaseHistory';
  }

}
