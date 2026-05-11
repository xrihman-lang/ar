import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Share2, Home, Plus, CreditCard, AlertCircle } from 'lucide-react';
import { Order } from '../types';

export default function OrderSuccessPage({ onOpenMaya }: { onOpenMaya: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  
  const query = new URLSearchParams(location.search);
  const orderId = query.get('id');

  useEffect(() => {
    const fetchOrder = () => {
      const saved = localStorage.getItem('ar_bite_orders');
      if (saved) {
        const orders: Order[] = JSON.parse(saved);
        const current = orders.find(o => o.id === orderId);
        if (current) setOrder(current);
      }
    };

    fetchOrder();

    const handleUpdate = () => fetchOrder();
    window.addEventListener('orderStatusLocal', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    return () => {
      window.removeEventListener('orderStatusLocal', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [orderId]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a]">
      <div className="max-w-md w-full glass p-10 rounded-[40px] text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-white to-amber-500 animate-pulse" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
            order.paymentStatus === 'paid' ? 'bg-amber-500 shadow-amber-500/40' : 'bg-red-500/20 border border-red-500/20'
          }`}
        >
          {order.paymentStatus === 'paid' ? (
            <CheckCircle2 className="w-12 h-12 text-black" />
          ) : (
            <CreditCard className="w-12 h-12 text-red-500" />
          )}
        </motion.div>

        <div>
          <h1 className="text-3xl font-display font-black uppercase italic mb-2">
            {order.paymentStatus === 'paid' ? 'Success! Paid' : 'Order Received'}
          </h1>
          <div className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-black mb-6">Order ID: {order.orderId}</div>
          
          <div className={`p-6 border rounded-2xl mb-4 italic text-sm ${
            order.paymentStatus === 'paid' 
            ? 'bg-white/5 border-white/10 text-slate-300' 
            : 'bg-red-500/5 border-red-500/20 text-red-200'
          }`}>
            {order.paymentStatus === 'paid' ? (
              <p>"Payment confirmed! Aapka order 5 minute mein ready ho jaega. Tab tak aap hamari AI assistant Maya se baatein kar sakte hain."</p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase text-[10px] tracking-widest">
                  <AlertCircle className="w-4 h-4" /> Action Required
                </div>
                <p className="not-italic font-bold text-white">Waiter is verifying your {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}.</p>
                <p className="text-xs text-red-400/80">Please show order ID <span className="font-black text-white italic underline">{order.orderId}</span> to the waiter if requested.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 py-6 border-y border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-white/60 uppercase font-black text-[10px] tracking-widest">
              <Clock className="w-4 h-4 text-amber-500" /> Status
            </div>
            <span className={`font-black uppercase italic ${order.status === 'ready' ? 'text-green-500' : 'text-amber-500'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-white/60 uppercase font-black text-[10px] tracking-widest">
              <MapPin className="w-4 h-4 text-amber-500" /> Table Number
            </div>
            <span className="font-black text-white">#{order.tableNumber}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onOpenMaya}
            className="w-full py-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Chat with Maya <Share2 className="w-4 h-4" />
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/menu')}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest transition-all"
            >
              Order More
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 py-4 bg-amber-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
