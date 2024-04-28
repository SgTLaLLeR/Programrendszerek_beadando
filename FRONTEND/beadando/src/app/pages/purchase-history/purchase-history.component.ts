import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../shared/services/api";
import {ZHistoryDTO} from "../../dtos/purchaseHistory";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory : ZHistoryDTO[] = []

  constructor( private apiService : ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getData<ZHistoryDTO[]>("/protected/product/purchaseHistory", {}, {withCredentials: true}).subscribe({
      next: data => {
        this.purchaseHistory = data;
      },
      error: error => {
        console.log(error)

      }
    });
  }




}
