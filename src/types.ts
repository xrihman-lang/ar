export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  arModel?: string; // URL to .glb file
  category: string;
  rating: number;
  ingredients: string[];
  isVeg: boolean;
  isSpicy: boolean;
  calories: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Restaurant {
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
}

export interface Order {
  id: string; // Internal UUID
  orderId: string; // User-facing ID (e.g., ARB-101)
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod: 'online' | 'cash';
  tableNumber: string;
  timestamp: number;
}
