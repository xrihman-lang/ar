import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import ARPage from './pages/ARPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import { CartItem, MenuItem, Order } from './types';
import MayaAssistant from './components/MayaAssistant';
import { AnimatePresence } from 'motion/react';
import { MENU_ITEMS as INITIAL_MENU } from './constants';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ar_bite_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ar_bite_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const [orderCount, setOrderCount] = useState(() => {
    const saved = localStorage.getItem('ar_bite_order_count');
    return saved ? parseInt(saved) : 100;
  });

  const placeOrder = (tableNumber: string, paymentMethod: 'online' | 'cash' = 'cash') => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const nextCount = orderCount + 1;
    setOrderCount(nextCount);
    localStorage.setItem('ar_bite_order_count', nextCount.toString());

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderId: `ARB-${nextCount}`,
      items: [...cart],
      total: subtotal * 1.1,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod,
      tableNumber,
      timestamp: Date.now()
    };
    
    setOrders(prev => {
      const next = [newOrder, ...prev];
      localStorage.setItem('ar_bite_orders', JSON.stringify(next));
      return next;
    });
    localStorage.setItem('ar_bite_new_order', JSON.stringify(newOrder));
    window.dispatchEvent(new CustomEvent('newOrderLocal', { detail: newOrder }));
    
    setCart([]);
    navigate(`/success?id=${newOrder.id}`);
  };

  const verifyPayment = (orderIdText: string) => {
    setOrders(prev => {
      const next = prev.map(o => o.orderId === orderIdText ? { ...o, paymentStatus: 'paid', status: 'preparing' } : o);
      localStorage.setItem('ar_bite_orders', JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new CustomEvent('orderStatusLocal'));
  };

  const placeDirectOrder = (item: MenuItem, tableNumber: string) => {
    const nextCount = orderCount + 1;
    setOrderCount(nextCount);
    localStorage.setItem('ar_bite_order_count', nextCount.toString());

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderId: `ARB-${nextCount}`,
      items: [{...item, quantity: 1}],
      total: item.price * 1.1,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'cash',
      tableNumber,
      timestamp: Date.now()
    };
    setOrders(prev => {
      const next = [newOrder, ...prev];
      localStorage.setItem('ar_bite_orders', JSON.stringify(next));
      return next;
    });
    localStorage.setItem('ar_bite_new_order', JSON.stringify(newOrder));
    window.dispatchEvent(new CustomEvent('newOrderLocal', { detail: newOrder }));
    
    navigate(`/success?id=${newOrder.id}`);
  };

  const addMenuItem = (item: MenuItem) => setMenuItems(prev => [...prev, item]);
  const deleteMenuItem = (id: string) => setMenuItems(prev => prev.filter(i => i.id !== id));
  const updateMenuItem = (item: MenuItem) => setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('ar_bite_orders', JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new CustomEvent('orderStatusLocal'));
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white relative">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage menuItems={menuItems} addToCart={addToCart} cart={cart} />} />
          <Route path="/ar/:id" element={<ARPage menuItems={menuItems} addToCart={addToCart} placeDirectOrder={placeDirectOrder} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} placeOrder={placeOrder} />} />
          <Route path="/success" element={<OrderSuccessPage onOpenMaya={() => setIsAssistantOpen(true)} />} />
          <Route path="/admin" element={
            <AdminDashboard 
              menuItems={menuItems} 
              orders={orders} 
              onAdd={addMenuItem} 
              onDelete={deleteMenuItem} 
              onUpdate={updateMenuItem}
              onUpdateStatus={updateOrderStatus}
              onVerifyPayment={verifyPayment}
            />
          } />
        </Routes>
      </AnimatePresence>

      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20 flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
      </button>

      <MayaAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} menuItems={menuItems} />
    </div>
  );
}
