export interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages';
  price: number;
  description?: string;
}

export interface Table {
  id: number;
  capacity: number;
  status: 'Available' | 'Reserved' | 'Occupied';
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  tableId: number;
  items: OrderItem[];
  status: 'Active' | 'Completed';
}

export type UserRole = 'Admin' | 'Customer' | 'Staff';
