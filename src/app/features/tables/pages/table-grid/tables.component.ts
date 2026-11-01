import { Component, inject } from '@angular/core';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { Table } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-tables',
  standalone: true,
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Floor & Tables</h1>
            <p class="text-sm text-zinc-400 mt-1">Live grid status and table reservations</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Available
            </span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (table of service.tables(); track table.id) {
            <div
              class="group p-6 rounded-2xl border bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900 transition-all duration-200"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Table</span>
                  <h3 class="text-2xl font-bold text-white mt-0.5">0{{ table.id }}</h3>
                </div>
                <span
                  [class]="getStatusBadgeClass(table.status)"
                  class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border"
                >
                  {{ table.status }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6">
                <span>{{ table.capacity }} Seats</span>
                <span>Table {{ table.id }}</span>
              </div>
              <div class="flex gap-2">
                @if (table.status === 'Available') {
                  <button
                    (click)="service.updateTableStatus(table.id, 'Reserved')"
                    class="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors active:scale-95"
                  >
                    Reserve
                  </button>
                } @else if (table.status === 'Reserved') {
                  <button
                    (click)="service.updateTableStatus(table.id, 'Available')"
                    class="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors active:scale-95"
                  >
                    Release
                  </button>
                } @else {
                  <button
                    class="flex-1 px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-500 text-sm font-medium cursor-not-allowed"
                  >
                    Occupied
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TablesComponent {
  service = inject(RestaurantService);

  getStatusBadgeClass(status: Table['status']) {
    switch (status) {
      case 'Available':
        return 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400';
      case 'Reserved':
        return 'bg-amber-950/40 border-amber-800/50 text-amber-400';
      case 'Occupied':
        return 'bg-zinc-800 border-zinc-700 text-zinc-400';
    }
  }
}
