import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'menu', 
    loadComponent: () => import('./features/menu/pages/menu-management/menu.component').then(m => m.MenuComponent) 
  },
  { 
    path: 'tables', 
    loadComponent: () => import('./features/tables/pages/table-grid/tables.component').then(m => m.TablesComponent) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./features/orders/pages/order-taking/orders.component').then(m => m.OrdersComponent) 
  },
  { 
    path: 'billing', 
    loadComponent: () => import('./features/billing/pages/checkout/billing.component').then(m => m.BillingComponent) 
  },
  { path: '**', redirectTo: 'tables' }
];
