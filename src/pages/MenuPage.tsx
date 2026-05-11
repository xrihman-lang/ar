import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, Eye, Plus, Info } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../constants';
import { MenuItem, CartItem } from '../types';

export default function MenuPage({ 
  menuItems, 
  addToCart, 
  cart 
}: { 
  menuItems: MenuItem[], 
  addToCart: (item: MenuItem) => void, 
  cart: CartItem[] 
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-24 bg-[#05070a]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl px-8 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center">
                <span className="text-black font-black text-xs">AR</span>
             </div>
             <div>
                <h1 className="text-sm font-bold tracking-tight text-white uppercase italic">AR BITE</h1>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Menu Studio</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="PROBE MENU..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold tracking-widest focus:outline-none focus:border-amber-500/50 transition-colors w-48 uppercase"
              />
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartTotal > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Categories Sidebar/Top */}
        <div className="flex flex-wrap gap-3 mb-16">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex flex-col bg-slate-900/40 border border-white/10 rounded-[32px] overflow-hidden hover:border-amber-500/30 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden p-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-[24px] grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100"
                  />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-[10px] font-bold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {item.rating}
                  </div>
                  {item.isVeg && (
                    <div className="absolute top-6 left-6 p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-green-500 rounded-sm" />
                    </div>
                  )}
                </div>

                <div className="px-8 pb-8 flex-1 flex flex-col pt-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold tracking-tight text-white uppercase italic">{item.name}</h3>
                    <span className="text-amber-500 font-bold text-lg">${item.price}</span>
                  </div>
                  
                  <p className="text-slate-500 text-xs leading-relaxed font-light mb-8 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`/ar/${item.id}`)}
                      className="btn-secondary flex-1 py-3.5 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> AR ENGINE
                    </button>
                    <button 
                      onClick={() => addToCart(item)}
                      className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> ADD ITEM
                    </button>
                  </div>
                </div>
                
                {/* Technical corner accents */}
                <div className="absolute bottom-0 right-0 w-8 h-8 opacity-20 border-r-2 border-b-2 border-amber-500 rounded-br-[32px] pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
