import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Info, RotateCw, Move, Maximize, ShoppingBag } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';
import { useRef } from 'react';

export default function ARPage({ 
  menuItems, 
  addToCart,
  placeDirectOrder
}: { 
  menuItems: MenuItem[], 
  addToCart: (item: MenuItem) => void,
  placeDirectOrder?: (item: MenuItem, tableNumber: string) => void
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const modelRef = useRef<any>(null);
  const item = menuItems.find(i => i.id === id);

  if (!item) return <div className="p-20 text-center font-display uppercase tracking-widest text-slate-500">Dish not found</div>;

  return (
    <div className="fixed inset-0 bg-[#05070a] z-[100] flex flex-col font-sans">
      {/* 3D Viewer Container */}
      <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#1a1d23_0%,_#05070a_100%)]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* @ts-ignore */}
        <model-viewer
          ref={modelRef}
          src={item.arModel}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          poster={item.image}
          shadow-intensity="2"
          shadow-softness="1"
          exposure="1.2"
          environment-image="neutral"
          auto-rotate
          ar-scale="auto"
          ar-placement="floor"
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <button 
            slot="ar-button"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-10 py-5 bg-amber-500 text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-3 animate-pulse pointer-events-auto"
          >
            <Maximize className="w-5 h-5" />
            Initiate AR Projector
          </button>
        {/* @ts-ignore */}
        </model-viewer>

        {/* HUD Overlay */}
        <div className="absolute top-8 left-8 right-8 flex items-start justify-between pointer-events-none">
          <button 
            onClick={() => navigate(-1)}
            className="pointer-events-auto p-4 glass-dark rounded-2xl border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="pointer-events-auto flex flex-col items-end gap-4 text-right">
             <div className="glass-dark p-6 rounded-[32px] max-w-[280px] border-white/20 shadow-2xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-black text-xl text-white uppercase italic leading-tight">{item.name}</h3>
                  <span className="text-amber-500 font-bold ml-4">${item.price}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed font-light mb-4">{item.description}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {item.ingredients.slice(0, 3).map(ing => (
                    <span key={ing} className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded uppercase font-bold text-slate-300">
                      {ing}
                    </span>
                  ))}
                </div>
             </div>
             
             <div className="flex gap-2">
                <div className="p-3 glass-dark rounded-xl border-white/10 text-slate-400">
                  <RotateCw className="w-4 h-4" />
                </div>
                 <div className="p-3 glass-dark rounded-xl border-white/10 text-slate-400">
                  <Move className="w-4 h-4" />
                </div>
             </div>
          </div>
        </div>

        {/* Scanning Status Label */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
           <div className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2 opacity-80">Targeting System.v2</div>
           <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        </div>
      </div>

      {/* Footer Controls */}
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="p-10 glass-dark rounded-t-[48px] border-t border-white/10 flex items-center justify-between gap-10"
      >
        <div className="hidden md:block flex-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Item Details</h4>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Calories</span>
              <span className="text-sm font-bold text-white">{item.calories} KCAL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Texture</span>
              <span className="text-sm font-bold text-white">Soft/Rich</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => {
                addToCart(item);
                navigate('/menu');
              }}
              className="flex-1 md:flex-none px-6 py-5 btn-secondary border-white/20 flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5" /> ADD TO CART
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 pl-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">TABLE</span>
            <input 
              id="table-input"
              type="text"
              placeholder="07"
              className="w-16 bg-transparent text-white font-bold text-center focus:outline-none placeholder:text-white/20"
            />
            <button 
              onClick={() => {
                const tableInput = document.getElementById('table-input') as HTMLInputElement;
                const table = tableInput?.value || "07";
                if (placeDirectOrder) {
                  placeDirectOrder(item, table);
                }
              }}
              className="flex-1 md:flex-none px-6 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> ORDER NOW
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
