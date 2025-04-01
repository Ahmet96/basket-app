import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { BasketCheckoutService } from '../shared-services/basket-checkout.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProductListService } from '../shared-services/product-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogComponent } from '../shared-components/mat-dialog/mat-dialog.component';
import { EncryptionService } from '../shared-services/encryption.service';
import { Order } from '../models/basket-checkout';
import { Product } from '../models/product-list';
import { DataSource } from '../models/data-source';

@Component({
  selector: 'basket-checkout',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule, MatCardModule, MatGridListModule, MatButtonModule, MatCardModule,MatTableModule,MatButtonModule,MatIcon,RouterModule],
  templateUrl: './basket-checkout.component.html',
  styleUrl: './basket-checkout.component.scss'
})

export class BasketCheckoutComponent {
  //declaring required values
  basket: Order[];
  product: Product[];
  displayedColumns: string[] = ['productName', 'selectedQuantity', 'unitPrice','totalPrice','removeBasket'];
  matchingProduct: Product[];
  dataSource: DataSource[];
  customerCardNumber: string;
  totalBasketLimit:number = 7;
  enteredCardNumber: string;
  totalPrice: number;
  array: number[];
  selectedQuantity: number;
  productPrice: number;
  basketTotalAmount: number;
  totalPriceCalculation: number;
  encryptedCardNumer: string;
  encryptedCardNumber: string;
  isDigitsValid: boolean;


  constructor(private encryptionService: EncryptionService,private dialog: MatDialog,private basketCheckoutService: BasketCheckoutService, private productListService: ProductListService) {}

  ngOnInit(): void {
    this.getBasketItem();
    this.getProducts();
    this.combineServices();
    this.getCardNumber();
  }


  IsValidCheckOut(): void {
    if(this.isCardNumberValid() === true) {
      this.dialog.open(MatDialogComponent, {
        data: {
          title: 'Congrats!',
          type: 'validCardNumber',
          info: 'Your process is complete. Your order will be shipped.',
        },
        width: '400px', 
      });
    } else {
      this.dialog.open(MatDialogComponent, {
        data: {
          title: 'An Error Occured!',
          type: 'wrongCardNumber',
          info: 'Please re-check your card informations.',
        },
        width: '400px', 
      });
    }
  }

  getCardNumber(): string | undefined {
    const item = this.dataSource?.find(item => item.cardNumber);
    this.customerCardNumber = item?.cardNumber;
    this.encryptedCardNumber =  this.encryptionService.encrypt(this.customerCardNumber);
    return this.encryptedCardNumber;
  }  

  isCardNumberValid(): boolean {
    return this.enteredCardNumber === this.customerCardNumber;
  }

  getQuantityRange(selectedQuantity: number,firstQuantity:number): number[] {
    const maxQuantity = Math.max(selectedQuantity, firstQuantity);
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
}

calculateTotalPrice(): void {
  this.basketTotalAmount = this.dataSource.reduce((sum, item, index) => {
    const quantity = Number(item.selectedQuantity) || 0; 
    return sum + quantity;
  }, 0);

  this.totalPriceCalculation = this.dataSource.reduce((sum, item) => 
    sum + (item.unitPrice * item.selectedQuantity), 0
  );
  this.totalPrice = Math.round(this.totalPriceCalculation)
  }

  removeBasket(sku: number, selectedQuantity: number): void {
    this.dataSource = this.dataSource.filter(item => item.basketSku !== sku);
    this.calculateTotalPrice();
  }
  

updatePrices(element: any, previousQuantity: number, newQuantity: number): void {
  if (previousQuantity === undefined) {
      previousQuantity = element.selectedQuantity;
  }

  const quantityDifference = newQuantity - previousQuantity;

  element.selectedQuantity = newQuantity;
  element.totalPrice = Math.round(element.unitPrice * newQuantity); 


  const product = this.dataSource.find(p => p.basketSku === element.basketSku);
  
  if (product) {
      this.basketTotalAmount += quantityDifference; 
      product.totalPrice = Math.round(product.unitPrice * newQuantity);


      this.totalPriceCalculation = this.dataSource.reduce((sum, item) => 
          sum + (item.unitPrice * item.selectedQuantity), 0
      );
      this.totalPrice = Math.round(this.totalPriceCalculation)
  }
}

  combineServices(): void{
    combineLatest([
      this.basketCheckoutService.getBasketItems(),
      this.productListService.getProducts()
    ]).subscribe(([basketItems, products]) => {
      this.dataSource = basketItems.flatMap(basketItem =>
        basketItem.basket.map(basket => {
          const product = products.find(p => p.sku === basket.sku);
          this.selectedQuantity = basket.quantity;
  
          return {
            basketSku: basket.sku,
            productSku: product?.sku ?? 'Unknown',
            name: product?.name ?? 'Unknown',
            selectedQuantity: this.selectedQuantity, 
            firstQuantity : basket.quantity,
            unitPrice: product?.price ?? 0,
            cardNumber: basketItem.cardNumber,
            basketLimit: product.basketLimit,
            totalPrice: Math.round(product.price * basket.quantity), 
            totalBasketPrice: this.totalBasketLimit
          };
        })
      );
      this.calculateTotalPrice();
    });
  }
  
  
  getBasketItem(): void{
    this.basketCheckoutService.getBasketItems().subscribe(data => {
      this.basket = data;
    })
  }

  getProducts(): void {
    this.productListService.getProducts().subscribe(data => {
      this.product = data;
    })
}
}
