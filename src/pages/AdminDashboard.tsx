import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  QrCode, 
  Settings, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3,
  Users,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  X,
  Home
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MenuItem, Order } from '../types';

function CountdownTimer({ timestamp }: { timestamp: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const end = timestamp + 15 * 60 * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('00:00 MINS');
        clearInterval(interval);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} MINS`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{timeLeft || '15:00 MINS'}</span>;
}

export default function AdminDashboard({ 
  menuItems, 
  orders, 
  onAdd, 
  onDelete, 
  onUpdate,
  onUpdateStatus,
  onVerifyPayment
}: { 
  menuItems: MenuItem[], 
  orders: Order[], 
  onAdd: (item: MenuItem) => void, 
  onDelete: (id: string) => void, 
  onUpdate: (item: MenuItem) => void,
  onUpdateStatus?: (id: string, status: Order['status']) => void,
  onVerifyPayment?: (orderId: string) => void
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tableNumber, setTableNumber] = useState('7');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [verificationInput, setVerificationInput] = useState<{ [id: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const playLoudBell = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Bell Tone 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain1.gain.setValueAtTime(0.5, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        // Bell Tone 2
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(660, ctx.currentTime);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 2.0);
        osc2.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.warn("Audio Context blocked or unsupported");
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ar_bite_new_order' && e.newValue) {
        const order = JSON.parse(e.newValue);
        setNewOrderAlert(order);
        playLoudBell();
      }
    };
    
    const handleCustom = (e: CustomEvent) => {
      setNewOrderAlert(e.detail);
      playLoudBell();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('newOrderLocal', handleCustom as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('newOrderLocal', handleCustom as EventListener);
    };
  }, []);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const exists = menuItems.find(i => i.id === editingItem.id);
      if (exists) {
        onUpdate(editingItem);
      } else {
        onAdd(editingItem);
      }
      setIsEditModalOpen(false);
      setEditingItem(null);
    }
  };

  const startNewItem = () => {
    setEditingItem({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Main Course',
      rating: 5.0,
      ingredients: [],
      isVeg: true,
      isSpicy: false,
      calories: 500
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/20 backdrop-blur-md p-8 flex flex-col gap-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <span className="text-black font-black text-xs">AR</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">AR BITE</h1>
          </div>
          <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 inline-block">Studio Admin</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'OVERVIEW' },
            { id: 'menu', icon: UtensilsCrossed, label: 'MENU MANAGEMENT' },
            { id: 'qr', icon: QrCode, label: 'QR GENERATOR' },
            { id: 'analytics', icon: TrendingUp, label: 'LIVE ORDERS' },
            { id: 'customers', icon: Users, label: 'CUSTOMERS' },
            { id: 'settings', icon: Settings, label: 'SETTINGS' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all text-[10px] font-black tracking-[0.2em] ${
                activeTab === item.id 
                ? 'bg-amber-500 text-black shadow-[0_4px_20px_rgba(245,158,11,0.2)]' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all text-[10px] font-black tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-white mt-4"
          >
            <Home className="w-4 h-4" />
            HOME EXIT
          </button>
        </nav>

        <div className="mt-auto p-5 glass-dark rounded-2xl border-white/10">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Authorized Personnel</p>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px]">AD</div>
             </div>
             <p className="text-xs font-bold text-white">Alex D. Chef</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-16 relative">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        {activeTab === 'menu' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl font-display font-black uppercase italic tracking-tight mb-2">Menu Management</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest">Restaurant Menu Data</p>
              </div>
              <button 
                onClick={startNewItem}
                className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Add Menu Item
              </button>
            </div>

            <div className="space-y-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex items-center gap-8 group hover:border-amber-500/30 transition-all">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
                  <div className="flex-1">
                    <div className="text-[8px] text-amber-500 uppercase font-black tracking-widest mb-1">{item.category}</div>
                    <h4 className="font-bold text-white uppercase italic">{item.name}</h4>
                  </div>
                  <div className="text-right px-12">
                    <p className="text-xl font-black text-amber-500">${item.price}</p>
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-tight flex items-center gap-1.5 justify-end">
                       <span className="w-1 h-1 rounded-full bg-green-500" /> SYNCED
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-3 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-3 hover:bg-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
             <div>
                <h2 className="text-4xl font-display font-black uppercase italic tracking-tight mb-2">Live Orders</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest">Real-time Order Operations</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
               {[
                 { label: 'GROSS YIELD', value: `$${orders.reduce((a, b) => a + b.total, 0).toFixed(0)}`, delta: '+12%', icon: DollarSign },
                 { label: 'ACTIVE ORDERS', value: orders.filter(o => o.status === 'preparing').length.toString(), delta: 'SYNCED', icon: Clock },
                 { label: 'SATISFACTION', value: '4.8', delta: '+0.2', icon: Star },
                 { label: 'OCCUPANCY', value: '82%', delta: '+5%', icon: Users },
               ].map((stat, i) => (
                 <div key={i} className="glass-dark p-8 rounded-[32px] border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-[20px] rounded-full" />
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
                       <stat.icon className="w-4 h-4 text-amber-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                   </div>
                   <div className="flex items-end justify-between">
                     <span className="text-3xl font-display font-black text-white italic">{stat.value}</span>
                   </div>
                 </div>
               ))}
             </div>

              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Live Order Queue</h3>
                <div className="grid grid-cols-1 gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-slate-900/60 border border-white/10 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shrink-0">
                          <span className="text-xl font-black text-amber-500">#{order.tableNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-[10px] text-white bg-white/10 px-2 py-0.5 rounded font-black tracking-widest uppercase">ID: {order.orderId}</div>
                            {order.paymentStatus === 'paid' ? (
                              <div className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1.2">
                                <CheckCircle2 className="w-3 h-3" /> SUCCESS / PAID
                              </div>
                            ) : (
                              <div className="text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1.2">
                                <Clock className="w-3 h-3" /> PAYMENT PENDING
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 text-white font-bold italic uppercase text-lg">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                            Total: <span className="text-amber-500">${order.total.toFixed(2)}</span> | Mode: <span className="text-white italic">{order.paymentMethod === 'online' ? 'Digital QR' : 'Cash (Waiter)'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-end">
                        {order.paymentStatus === 'unpaid' && (
                          <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-2xl p-2 pl-4 w-full md:w-64">
                            <input 
                              type="text" 
                              placeholder="Enter Order ID"
                              value={verificationInput[order.id] || ''}
                              onChange={e => setVerificationInput(prev => ({ ...prev, [order.id]: e.target.value.toUpperCase() }))}
                              className="bg-transparent text-white font-black text-xs italic focus:outline-none w-full placeholder:text-slate-700"
                            />
                            <button 
                              onClick={() => {
                                if (verificationInput[order.id] === order.orderId) {
                                  onVerifyPayment?.(order.orderId);
                                  setVerificationInput(prev => ({ ...prev, [order.id]: '' }));
                                } else {
                                  alert("Invalid Order ID verification sequence.");
                                }
                              }}
                              className="bg-amber-500 text-black px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 shrink-0"
                            >
                              CONFIRM PAYMENT
                            </button>
                          </div>
                        )}

                        <div className="text-right shrink-0">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Estimated Prep</p>
                          <p className="font-mono text-amber-500 font-bold">
                            <CountdownTimer timestamp={order.timestamp} />
                          </p>
                        </div>
                        
                        <div className="shrink-0 min-w-[120px] flex justify-end">
                          {order.status === 'pending' || order.status === 'preparing' ? (
                            <button 
                              onClick={() => onUpdateStatus?.(order.id, 'ready')}
                              disabled={order.paymentStatus === 'unpaid'}
                              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                order.paymentStatus === 'unpaid' 
                                ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-50'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-black'
                              }`}
                            >
                              {order.paymentStatus === 'unpaid' ? 'Wait for Pay' : 'Mark Ready'}
                            </button>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> Ready
                              </div>
                              {order.status !== 'delivered' && (
                                <button 
                                  onClick={() => onUpdateStatus?.(order.id, 'delivered')}
                                  className="text-[8px] text-slate-500 underline hover:text-white uppercase font-black tracking-widest"
                                >
                                  Mark as Delivered
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="p-12 text-center glass rounded-[32px] border-dashed border-white/10">
                      <p className="text-slate-500 uppercase tracking-widest text-xs font-black">No active orders detected</p>
                    </div>
                  )}
                </div>
             </div>
          </motion.div>
        )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#0a0c10] border border-white/10 rounded-[40px] p-10 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-display font-black uppercase italic tracking-tight">Edit Menu Item</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Name</label>
                <input 
                  type="text" 
                  value={editingItem.name}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Description</label>
                <textarea 
                  value={editingItem.description}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 h-24"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Price ($)</label>
                <input 
                  type="number" 
                  value={editingItem.price}
                  onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Category</label>
                <select 
                   value={editingItem.category}
                   onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Image URL</label>
                <input 
                  type="text" 
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2 block">3D AR Model URL (.glb)</label>
                <input 
                  type="text" 
                  value={editingItem.arModel}
                  onChange={e => setEditingItem({...editingItem, arModel: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2 pt-6">
                <button type="submit" className="w-full btn-primary py-5 text-sm uppercase tracking-[0.2em] font-black">
                  Commit Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

        {activeTab === 'qr' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h2 className="text-4xl font-display font-black uppercase italic tracking-tight mb-16">QR Generator</h2>
            <div className="glass-dark p-12 rounded-[48px] border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full" />
              
              <div className="mb-12">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block">Target Table Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-2xl font-black italic focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Table Number..."
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-500/60 uppercase">Table Ready</div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] flex items-center justify-center max-w-[320px] mx-auto shadow-[0_0_50px_rgba(255,255,255,0.05)] border-8 border-white/5">
                <QRCodeSVG 
                  value={`${window.location.origin}/menu?table=${tableNumber}`} 
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center mt-12 space-y-6">
                <p className="text-xs text-slate-500 font-light leading-relaxed">This QR project directs customers to the AR Menu assigned to <span className="text-white font-bold italic">Table #{tableNumber}</span>.</p>
                <button className="w-full py-5 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
                  PRINT QR CODE (PDF)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* New Order Alert Modal */}
      {newOrderAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-amber-500 rounded-[40px] p-10 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="pr-8">
                <h3 className="text-2xl font-display font-black uppercase italic tracking-tight text-black leading-tight">
                  New Order: {newOrderAlert.items.map(i => i.name).join(', ')}<br/>
                  <span className="text-xl">| Table: {newOrderAlert.tableNumber}</span>
                </h3>
              </div>
              <button onClick={() => setNewOrderAlert(null)} className="p-3 bg-black/10 hover:bg-black/20 rounded-xl text-black transition-colors shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-black/10 border border-black/10 rounded-3xl p-6 mb-8 relative z-10 text-black">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-black/60 mb-1">Table Number</div>
                  <div className="text-4xl font-black italic">#{newOrderAlert.tableNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-black tracking-widest text-black/60 mb-1">Time Remaining</div>
                  <div className="text-2xl font-mono font-black border border-black/20 px-3 py-1 rounded-lg">
                    <CountdownTimer timestamp={newOrderAlert.timestamp} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-[10px] uppercase font-black tracking-widest text-black/60 border-b border-black/10 pb-2">Order Items</div>
                {newOrderAlert.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center font-bold">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setNewOrderAlert(null)}
              className="w-full py-5 bg-black text-amber-500 text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-transform relative z-10"
            >
              Acknowledge
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

