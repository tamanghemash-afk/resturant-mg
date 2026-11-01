import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { MenuItem } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Menu Catalog</h1>
          <p class="text-sm text-zinc-400 mt-1">Manage kitchen items and pricing</p>
        </div>
        @if (service.role() === 'Admin') {
          <button
            (click)="showForm.set(!showForm())"
            class="px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors active:scale-95"
          >
            {{ showForm() ? 'Close Form' : '+ Add Item' }}
          </button>
        }
      </div>

      @if (showForm() && service.role() === 'Admin') {
        <div class="mb-10 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <h3 class="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Create New Item</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              [(ngModel)]="newItem.name"
              placeholder="Item Name"
              class="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <input
              [(ngModel)]="newItem.price"
              type="number"
              placeholder="Price ($)"
              class="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <select
              [(ngModel)]="newItem.category"
              class="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              <option value="Appetizers">Appetizers</option>
              <option value="Mains">Mains</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
            <button
              (click)="addItem()"
              class="px-5 py-3 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (item of service.menu(); track item.id) {
          <div class="p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-colors group">
            <div class="flex items-start justify-between mb-4">
              <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{{ item.category }}</span>
              @if (service.role() === 'Admin') {
                <button
                  (click)="service.removeMenuItem(item.id)"
                  class="w-6 h-6 rounded bg-red-950/30 border border-red-900/40 text-red-400 text-xs hover:bg-red-900/50 transition-colors"
                >
                  ×
                </button>
              }
            </div>
            <h4 class="text-base font-medium text-white mb-2">{{ item.name }}</h4>
            <p class="text-xs font-mono text-zinc-400">\${{ item.price.toFixed(2) }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class MenuComponent {
  service = inject(RestaurantService);
  showForm = signal(false);
  newItem: Omit<MenuItem, 'id'> = { name: '', price: 0, category: 'Mains' };

  addItem() {
    if (!this.newItem.name || this.newItem.price <= 0) return;
    this.service.addMenuItem({ ...this.newItem });
    this.newItem = { name: '', price: 0, category: 'Mains' };
    this.showForm.set(false);
  }
}
