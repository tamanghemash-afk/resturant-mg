import { Injectable, signal, computed } from '@angular/core';
import { MenuItem, Table, Order, UserRole } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  role = signal<UserRole>('Staff');
  
  menu = signal<MenuItem[]>([
    { id: '1', name: 'Truffle Mushroom Risotto', category: 'Mains', price: 18.50 },
    { id: '2', name: 'Artisan Burrata Salad', category: 'Appetizers', price: 12.00 },
    { id: '3', name: 'Matcha Lava Cake', category: 'Desserts', price: 8.50 },
    { id: '4', name: 'Sparkling Yuzu Cold Brew', category: 'Beverages', price: 5.50 }
  ]);

  tables = signal<Table[]>([
    { id: 1, capacity: 2, status: 'Occupied' },
    { id: 2, capacity: 4, status: 'Available' },
    { id: 3, capacity: 2, status: 'Reserved' },
    { id: 4, capacity: 6, status: 'Available' }
  ]);

  orders = signal<Order[]>([
    {
      tableId: 1,
      status: 'Active',
      items: [
        { menuItem: { id: '1', name: 'Truffle Mushroom Risotto', category: 'Mains', price: 18.50 }, quantity: 2 },
        { menuItem: { id: '4', name: 'Sparkling Yuzu Cold Brew', category: 'Beverages', price: 5.50 }, quantity: 2 }
      ]
    }
  ]);

  setRole(role: UserRole) {
    this.role.set(role);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>) {
    const newItem = { ...item, id: Date.now().toString() };
    this.menu.update(prev => [...prev, newItem]);
  }

  removeMenuItem(id: string) {
    this.menu.update(prev => prev.filter(i => i.id !== id));
  }

  updateTableStatus(tableId: number, status: Table['status']) {
    this.tables.update(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  }

  placeOrder(tableId: number, items: { menuItem: MenuItem; quantity: number }[]) {
    this.orders.update(prev => {
      const existing = prev.filter(o => o.tableId !== tableId);
      return [...existing, { tableId, items, status: 'Active' }];
    });
    this.updateTableStatus(tableId, 'Occupied');
  }

  completeOrder(tableId: number) {
    this.orders.update(prev => prev.filter(o => o.tableId !== tableId));
    this.updateTableStatus(tableId, 'Available');
  }
}
