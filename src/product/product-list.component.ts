import { Component,signal } from '@angular/core';
import { ProductListService } from '../shared-services/product-list.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatDialogComponent } from '../shared-components/mat-dialog/mat-dialog.component';
import { RouterModule } from '@angular/router';
import { BasketCheckoutService } from '../shared-services/basket-checkout.service';
import { Order } from '../models/basket-checkout';
import { Product } from '../models/product-list';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatButtonModule, MatCardModule,MatTableModule,MatButtonModule,MatIcon,RouterModule],
  providers: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent {
//declaring required values
product = signal<Product[]>([]); 
products: Product[];
displayedColumns: string[] = ['name', 'description', 'price', 'basketLimit','addBasket','removeBasket'];
totalBasketLimit: number = 0;
basketItem: Order[];
selectedProduct: Product;
totalPrice: number = 0;

constructor(private dialog: MatDialog,private productService: ProductListService,private basketService: BasketCheckoutService) {}

ngOnInit(): void {
  this.getProducts();
  this.getBasketItem();
}

checkBasketLimit(sku:number,basketLimit:number): void {
  const minBasketLimit = 0;
  const selectedProduct = this.products.find(p => p.sku === sku);
  const maxBasketLimit =  selectedProduct ? selectedProduct.basketLimit : null; 
  
  if (maxBasketLimit !== null) {
    if (basketLimit <= minBasketLimit || basketLimit > maxBasketLimit ) {
      this.dialog.open(MatDialogComponent, {
        data: {
          title: 'Basket Warning',
          type: 'insufficientBasket',
          info: 'Your basket does not have enough items.',
        },
        width: '400px', 
      });
    }
   }
  }

calculateTotalPrice(productSku: number,totalBasketLimit:number): number {
  const foundBasketItem = this.basketItem.find(item => 
      item.basket.some(basket => basket.sku === productSku)
  );

  if (!foundBasketItem) { this.totalPrice = 0; return this.totalPrice; }

  const foundBasket = foundBasketItem.basket.find(basket => basket.sku === productSku);
  const foundProductSku = foundBasket?.sku ?? 0;
  const quantity = foundBasket?.quantity ?? 0;

  const foundProduct = this.products.find(product => product.sku === foundProductSku);
  const price = foundProduct?.price ?? 0;

  this.totalPrice = Math.round(price * quantity * totalBasketLimit * 100) / 100;
  return this.totalPrice;
}



getBasketLimit(sku:number): number {
  const selectedProduct = this.products.find(p => p.sku === sku);
  return selectedProduct.basketLimit;
}


updateBasketLimit(productId: number, change: number,basketLimit:number): void {
  this.product.update(products => {
    return products.map(p => {
      if (p.sku === productId) {
        const newBasketLimit = p.basketLimit + change;
        const updatedProduct = { ...p, basketLimit: p.basketLimit + change };
        this.checkBasketLimit(updatedProduct.sku, updatedProduct.basketLimit);

        const basketLimit = this.getBasketLimit(p.sku)  
        if (newBasketLimit < 0 || newBasketLimit > basketLimit) return p;

        this.totalBasketLimit -= change;
        this.calculateTotalPrice(updatedProduct.sku,this.totalBasketLimit)
        return updatedProduct;
      }
      return p;
    });
  });
}

decreaseBasketLimit(productId: number,basketLimit:number): void {
  this.updateBasketLimit(productId, 1,basketLimit);
}

increaseBasketLimit(productId: number,basketLimit:number): void {
  this.updateBasketLimit(productId, -1,basketLimit);
}

getProducts(): void {
  this.productService.getProducts().subscribe(data => {
    this.products = data;
    //for signal operations
    this.product.set(data);
  })
}

getBasketItem(): void {
this.basketService.getBasketItems().subscribe(data => {
  this.basketItem = data;
})
}

}
