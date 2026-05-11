import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Mic } from 'lucide-react';
import { MenuItem } from '../types';

export default function MayaAssistant({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void; menuItems?: MenuItem[] }) {
  const [showModal, setShowModal] = useState(isOpen || false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setShowModal(isOpen);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-amber-500 text-black px-6 py-4 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 hover:bg-amber-400 active:scale-95 transition-all outline-none"
      >
        <span className="font-black uppercase tracking-widest text-xs hidden sm:block">Talk to Maya</span>
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-amber-500"></span>
        </div>
      </button>

      {/* Centered Iframe Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 backdrop-blur-md bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full h-full md:w-[400px] md:h-[600px] bg-black border border-white/10 md:rounded-[32px] overflow-hidden flex flex-col relative shadow-[0_0_100px_rgba(245,158,11,0.1)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-[#0a0c10] border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                    <Mic className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-black italic uppercase tracking-wider">Maya AI</h3>
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Restaurant Mode</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Iframe */}
              <div className="flex-1 w-full bg-slate-900 overflow-hidden relative">
                {/* Fallback to hide iframe loading flash */}
                <div className="absolute inset-0 flex items-center justify-center -z-10 bg-black">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <iframe
                  src="https://mayaai.sbs/?context=restaurant_greet_mode"
                  className="w-full h-full border-none"
                  allow="microphone; camera"
                  title="Maya AI"
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
