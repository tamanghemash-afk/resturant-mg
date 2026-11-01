import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { MenuItem, OrderItem } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Take Order</h1>
          <p class="text-sm text-zinc-400 mt-1">Select table and attach menu choices</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Table</label>
          <select
            [(ngModel)]="selectedTableId"
            class="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-600 transition-colors"
          >
            @for (t of service.tables(); track t.id) {
              <option [value]="t.id">Table 0{{ t.id }}</option>
            }
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-7 space-y-6">
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h2 class="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Menu</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (item of service.menu(); track item.id) {
                <div
                  class="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900 hover:border-zinc-700/50 transition-colors group cursor-pointer"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <h4 class="text-sm font-medium text-white">{{ item.name }}</h4>
                      <p class="text-xs font-mono text-zinc-400">\${{ item.price.toFixed(2) }}</p>
                    </div>
                    <button
                      (click)="addToOrder(item)"
                      class="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-bold hover:bg-white transition-colors active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Active Selection</h2>
              <span class="text-[10px] font-mono text-zinc-500">Table 0{{ selectedTableId }}</span>
            </div>
            <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              @for (line of currentOrder(); track line.menuItem.id) {
                <div class="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-zinc-300">{{ line.menuItem.name }}</span>
                    <span class="text-xs font-mono text-zinc-500 ml-auto">\${{ (line.menuItem.price * line.quantity).toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button
                      (click)="updateQty(line.menuItem.id, -1)"
                      class="w-6 h-6 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                    >
                      −
                    </button>
                    <span class="w-5 text-center text-xs font-mono text-white">{{ line.quantity }}</span>
                    <button
                      (click)="updateQty(line.menuItem.id, 1)"
                      class="w-6 h-6 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              } @empty {
                <p class="text-xs text-zinc-500 text-center py-8">No items added</p>
              }
            </div>
            <div class="mt-6 pt-6 border-t border-zinc-800">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-zinc-400">Subtotal</span>
                <span class="text-sm font-mono text-white">\${{ orderTotal().toFixed(2) }}</span>
              </div>
              <button
                (click)="submitOrder()"
                [disabled]="currentOrder().length === 0"
                class="w-full mt-6 py-3 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent {
  service = inject(RestaurantService);
  selectedTableId = 1;
  currentOrder = signal<OrderItem[]>([]);

  addToOrder(menuItem: MenuItem) {
    this.currentOrder.update(items => {
      const existing = items.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return items.map(i =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { menuItem, quantity: 1 }];
    });
  }

  updateQty(id: string, delta: number) {
    this.currentOrder.update(items =>
      items
        .map(i => {
          if (i.menuItem.id === id) {
            const qty = i.quantity + delta;
            return qty > 0 ? { ...i, quantity: qty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  }

  submitOrder() {
    if (this.currentOrder().length === 0) return;
    this.service.placeOrder(Number(this.selectedTableId), this.currentOrder());
    this.currentOrder.set([]);
  }

  orderTotal() {
    return this.currentOrder().reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0
    );
  }
}
