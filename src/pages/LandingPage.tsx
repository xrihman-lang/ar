import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Camera, Smartphone, Utensils, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden bg-[#05070a]">
      {/* Navigation */}
      <nav className="h-16 px-8 flex items-center justify-between border-b border-white/10 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <span className="text-black font-black text-xs">AR</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
            AR BITE <span className="text-[10px] font-medium text-amber-500 align-top uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 ml-1">Studio</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <button onClick={() => navigate('/menu')} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">MENU</button>
            <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">KITCHEN</button>
            <button onClick={() => navigate('/admin')} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">ADMIN</button>
          </div>
          <div className="w-px h-6 bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table 14</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/20"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 overflow-hidden">
        {/* Background glow and grid overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              WebXR Enabled Technology
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight mb-8 uppercase italic leading-none">
              Dine in the <br />
              <span className="text-gradient">3rd Dimension</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Experience ultra-realistic 3D representations of gourmet cuisine at your table. 
              Hyper-accurate scale. Stunning textures. Zero install.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/menu')}
                className="btn-primary px-10 py-5 flex items-center gap-3"
              >
                Scan Menu in AR <ArrowRight className="w-4 h-4" />
              </button>
              <button className="btn-secondary px-10 py-5 border-white/20">
                Restaurant Showcase
              </button>
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 relative px-4 max-w-4xl mx-auto"
          >
            <div className="rounded-[40px] border border-white/10 bg-slate-900/40 p-4 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1550966841-3ee7adac1afb?auto=format&fit=crop&q=80&w=1200" 
                alt="Restaurant Experience" 
                className="w-full h-auto rounded-[32px] brightness-75 group-hover:brightness-100 transition-all duration-700"
              />
              {/* AR HUD Simulation Overlays */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 p-[1px] bg-gradient-to-tr from-amber-500/50 to-transparent rounded-2xl hidden md:block backdrop-blur-md"
              >
                <div className="bg-slate-950/80 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Spatial Analysis</p>
                    <p className="text-[9px] text-amber-500/60 uppercase font-bold">Scanning Surface...</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features with Sleek Styling */}
      <section className="py-32 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-amber-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Smartphone, title: "WebXR Standard", desc: "No native app downloads. Just open your browser and point your camera at the table to initiate the experience." },
              { icon: Utensils, title: "Photorealistic 3D", desc: "Every model is hand-crafted with ultra-high resolution textures and PBR materials to ensure visual fidelity." },
              { icon: Star, title: "Smart Ecosystem", desc: "Unified ordering flow from AR preview to kitchen status. Seamless, integrated, and incredibly fast." }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] glass-dark border-white/10 hover:border-amber-500/40 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-[24px] bg-amber-500/5 flex items-center justify-center mb-8 border border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <f.icon className="text-amber-500 w-7 h-7" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-white">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
