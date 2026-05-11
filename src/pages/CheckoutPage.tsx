import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Trash2, Minus, Plus, ArrowLeft, CreditCard, Clock, MapPin, CheckCircle2, QrCode, Banknote, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CartItem } from '../types';

export default function CheckoutPage({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  placeOrder 
}: { 
  cart: CartItem[], 
  updateQuantity: (id: string, delta: number) => void, 
  removeFromCart: (id: string) => void,
  placeOrder: (table: string, method?: 'online' | 'cash') => void 
}) {
  const [tableNumber, setTableNumber] = useState("07");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | null>(null);
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = (method: 'online' | 'cash') => {
    if (tableNumber) {
      placeOrder(tableNumber, method);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center p-8 gap-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-4 border border-white/5">
          <Trash2 className="w-10 h-10 text-slate-700" />
        </div>
        <h2 className="text-3xl font-display font-black uppercase italic">Deployment required</h2>
        <p className="text-slate-500 max-w-sm font-light">Your cart is currently empty. Navigate to the menu to select items in AR.</p>
        <button 
          onClick={() => navigate('/menu')}
          className="btn-primary px-12 py-5"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] py-16 px-8 max-w-7xl mx-auto">
      <header className="flex items-center gap-6 mb-16">
        <button onClick={() => navigate('/menu')} className="p-4 glass-dark rounded-2xl border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-4xl font-display font-black uppercase italic tracking-tight">Order Queue</h1>
          <p className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-bold">Review Selected Items</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/40 border border-white/10 p-6 rounded-[32px] flex items-center gap-8 relative group"
            >
              <img src={item.image} className="w-28 h-28 rounded-2xl object-cover grayscale active:grayscale-0 brightness-75 group-hover:brightness-100 transition-all" />
              <div className="flex-1">
                <div className="text-[9px] text-amber-500 uppercase font-black tracking-widest mb-1">{item.category}</div>
                <h3 className="text-xl font-bold text-white uppercase italic">{item.name}</h3>
                <p className="text-amber-500 font-black text-lg mt-1">${item.price}</p>
              </div>
              
              <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl p-1.5 gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-4 bg-red-500/5 text-red-500/40 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="absolute top-0 right-0 w-8 h-8 opacity-10 border-r border-t border-amber-500 rounded-tr-[32px] pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="glass-dark p-10 rounded-[48px] border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] rounded-full" />
            
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-10 border-b border-white/5 pb-6">Final Verification</h2>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-slate-400 font-light text-sm">
                <span>Net Value</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-light text-sm">
                <span>Protocol Fee (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-display font-black border-t border-white/10 pt-8 mt-4 text-white uppercase italic">
                <span>Total Due</span>
                <span className="text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-10">
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <MapPin className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Spatial Target (Table)</p>
                  <input 
                    type="text" 
                    value={tableNumber} 
                    onChange={e => setTableNumber(e.target.value)} 
                    className="bg-transparent text-xs font-bold text-white uppercase focus:outline-none w-full"
                    placeholder="Enter Table Number"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full btn-primary py-6 text-sm flex items-center justify-center gap-3 active:scale-95"
            >
              PROCEED TO PAYMENT <CreditCard className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 glass-dark rounded-[32px] border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-loose">
              Est. Prep latency: <span className="text-white font-black">15-20m</span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl glass-dark rounded-[48px] border border-white/10 p-10 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-3xl font-display font-black uppercase italic tracking-tight text-white leading-tight">
                    Select Payment<br/>Method
                  </h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Total Due: ${total.toFixed(2)}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!paymentMethod ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <button 
                    onClick={() => setPaymentMethod('online')}
                    className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl hover:bg-amber-500/10 transition-all flex flex-col items-center gap-4 group"
                  >
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <QrCode className="w-8 h-8 text-black" />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black uppercase italic text-lg">Pay Online</div>
                      <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-1">Instant Verification</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className="p-8 bg-slate-800/20 border border-white/5 rounded-3xl hover:bg-slate-800/40 transition-all flex flex-col items-center gap-4 group"
                  >
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Banknote className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black uppercase italic text-lg">Pay with Cash</div>
                      <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-1">At Counter / Waiter</div>
                    </div>
                  </button>
                </div>
              ) : paymentMethod === 'online' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center bg-white/5 border border-white/5 rounded-3xl p-8 relative z-10"
                >
                  <div className="p-4 bg-white rounded-2xl mb-6 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <QRCodeSVG value={`upi://pay?pa=arbite@upi&pn=ARBite&am=${total.toFixed(2)}&cu=USD`} size={200} />
                  </div>
                  <h4 className="text-white font-black uppercase italic text-xl mb-2 text-center">Scan to Pay Online</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest text-center mb-8">Dynamic QR Generated for ${total.toFixed(2)}</p>
                  
                  <div className="w-full flex gap-3">
                    <button 
                      onClick={() => setPaymentMethod(null)}
                      className="flex-1 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => handlePlaceOrder('online')}
                      className="flex-[2] py-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                    >
                      Confirm Order Payment
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center bg-white/5 border border-white/5 rounded-3xl p-8 relative z-10 text-center"
                >
                  <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                    <Banknote className="w-10 h-10 text-amber-500" />
                  </div>
                  <h4 className="text-white font-black uppercase italic text-xl mb-4">Cash Payment Mode</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-8 max-w-xs">
                    Please pay <span className="text-white font-bold">${total.toFixed(2)}</span> at the counter or to your waiter. Your order will be processed once payment is verified.
                  </p>
                  
                  <div className="w-full flex gap-3">
                    <button 
                      onClick={() => setPaymentMethod(null)}
                      className="flex-1 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => handlePlaceOrder('cash')}
                      className="flex-[2] py-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                    >
                      Confirm & Pay Cash
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
