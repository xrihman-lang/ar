import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Gourmet Truffle Burger',
    description: 'Wagyu beef patty with black truffle aioli, caramelized onions, and aged Gruyere.',
    price: 24,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder AR model
    category: 'Main Course',
    rating: 4.9,
    ingredients: ['Wagyu Beef', 'Truffle Aioli', 'Caramelized Onions', 'Gruyere'],
    isVeg: false,
    isSpicy: false,
    calories: 850
  },
  {
    id: '2',
    name: 'Artisan Margherita Pizza',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, basil, and extra virgin olive oil.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1574129624552-46c13a69366f?auto=format&fit=crop&q=80&w=800',
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    category: 'Pizza',
    rating: 4.8,
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isVeg: true,
    isSpicy: false,
    calories: 620
  },
  {
    id: '3',
    name: 'Wild Mushroom Risotto',
    description: 'Creamy Arborio rice with porcini and shiitake mushrooms, finished with parmesan.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800',
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    category: 'Main Course',
    rating: 4.7,
    ingredients: ['Arborio Rice', 'Mushrooms', 'Parmesan', 'White Wine'],
    isVeg: true,
    isSpicy: false,
    calories: 540
  },
  {
    id: '4',
    name: 'Gold Leaf Chocolate Melt',
    description: '70% dark chocolate fondant served with vanilla bean gelato and edible 24k gold leaf.',
    price: 16,
    image: 'https://images.unsplash.com/photo-1541946535456-06f9479b32ce?auto=format&fit=crop&q=80&w=800',
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    category: 'Desserts',
    rating: 4.9,
    ingredients: ['Dark Chocolate', 'Gelato', 'Gold Leaf'],
    isVeg: true,
    isSpicy: false,
    calories: 420
  }
];

export const CATEGORIES = ['All', 'Main Course', 'Pizza', 'Pasta', 'Desserts', 'Beverages'];
