import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { order, Order } from '../models/basket-checkout';

@Injectable({
  providedIn: 'root'
})
export class BasketCheckoutService {

  constructor() { }

  getBasketItems(): Observable<Order[]> {
    return of(order);
  }
}
