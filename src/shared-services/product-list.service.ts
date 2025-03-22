import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, products } from '../models/product-list';


@Injectable({
  providedIn: 'root'
})

export class ProductListService {

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(products);
  }


}


  
