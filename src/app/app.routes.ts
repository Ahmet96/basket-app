import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../product/product-list.component').then(m => m.ProductListComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('../basket/basket-checkout.component').then(m => m.BasketCheckoutComponent),
  }
];

export default routes;
