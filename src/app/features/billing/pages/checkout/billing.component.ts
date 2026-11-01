import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../core/services/restaurant.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-5xl mx-auto p-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Checkout & Billing</h1>
          <p class="text-sm text-zinc-400 mt-1">Review live active orders and generate receipt prints</p>
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

      @if (activeOrder()) {
        <div class="flex justify-center">
          <div class="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl" id="receipt">
            <div class="text-center pb-6 border-b border-zinc-800 mb-6">
              <h2 class="text-sm font-bold text-white tracking-widest uppercase">Aurum Restaurant</h2>
              <p class="text-[10px] text-zinc-500 mt-1">Invoice #{{ activeOrder()?.tableId }}-{{ Date.now().toString().slice(-4) }}</p>
            </div>

            <div class="space-y-3 mb-6">
              @for (item of activeOrder()!.items; track item.menuItem.id) {
                <div class="flex justify-between items-center pb-2 border-b border-zinc-800/50 last:border-0">
                  <span class="text-sm text-zinc-300">{{ item.quantity }}x {{ item.menuItem.name }}</span>
                  <span class="text-sm font-mono text-white">\${{ (item.menuItem.price * item.quantity).toFixed(2) }}</span>
                </div>
              }
            </div>

            <div class="space-y-2 mb-6">
              <div class="flex justify-between text-xs text-zinc-400">
                <span>Subtotal</span>
                <span>\${{ subtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs text-zinc-400">
                <span>Tax (8%)</span>
                <span>\${{ tax().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span>\${{ total().toFixed(2) }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                (click)="printReceipt()"
                class="flex-1 py-3 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700 transition-colors active:scale-95"
              >
                Print
              </button>
              <button
                (click)="settleBill()"
                class="flex-1 py-3 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors active:scale-95"
              >
                Settle & Clear
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <span class="text-zinc-500">🧾</span>
          </div>
          <p class="text-sm text-zinc-500">No active bill or order found for Table 0{{ selectedTableId() }}</p>
        </div>
      }
    </div>
  `
})
export class BillingComponent {
  service = inject(RestaurantService);
  selectedTableId = signal(1);
  Date = Date;

  activeOrder = computed(() =>
    this.service.orders().find(o => o.tableId === Number(this.selectedTableId()))
  );

  subtotal = computed(() => {
    const order = this.activeOrder();
    if (!order) return 0;
    return order.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  });

  tax = computed(() => this.subtotal() * 0.08);
  total = computed(() => this.subtotal() + this.tax());

  settleBill() {
    this.service.completeOrder(Number(this.selectedTableId()));
  }

  printReceipt() {
    window.print();
  }
}
