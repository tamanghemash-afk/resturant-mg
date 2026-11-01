import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span class="text-xs font-bold text-zinc-200">A</span>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">AURUM</span>
          </div>
          <div class="hidden md:flex items-center gap-6 text-sm font-medium">
            <a routerLink="/tables" routerLinkActive="text-white" [class.text-zinc-400]="!isActive('/tables')" class="px-3 py-2 rounded-md transition-colors hover:bg-zinc-900 hover:text-white">Tables</a>
            <a routerLink="/orders" routerLinkActive="text-white" [class.text-zinc-400]="!isActive('/orders')" class="px-3 py-2 rounded-md transition-colors hover:bg-zinc-900 hover:text-white">Orders</a>
            <a routerLink="/menu" routerLinkActive="text-white" [class.text-zinc-400]="!isActive('/menu')" class="px-3 py-2 rounded-md transition-colors hover:bg-zinc-900 hover:text-white">Menu</a>
            <a routerLink="/billing" routerLinkActive="text-white" [class.text-zinc-400]="!isActive('/billing')" class="px-3 py-2 rounded-md transition-colors hover:bg-zinc-900 hover:text-white">Billing</a>
          </div>
          <div class="flex items-center gap-3">
            <span class="hidden md:block px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Role: {{ service.role() }}
            </span>
            <a routerLink="/login" class="px-4 py-2 rounded-md bg-white text-zinc-900 text-sm font-medium transition-colors hover:bg-zinc-100">Switch Role</a>
          </div>
        </div>
      </div>
    </nav>
    <div class="h-16"></div>
  `
})
export class NavbarComponent {
  service = inject(RestaurantService);

  isActive(path: string): boolean {
    return typeof location !== 'undefined' && location.pathname === path;
  }
}
