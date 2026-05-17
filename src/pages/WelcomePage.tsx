import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Code2, Gamepad2, BrainCircuit, Terminal, Cpu } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Simulated Loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 500); // 0.5s pause at 100%
      }
      setLoadingProgress(progress);
    }, 150);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleEnter = () => {
    // Create an exit animation state or directly navigate
    navigate('/home');
  };

  return (
    <div className="fixed inset-0 bg-[#020205] overflow-hidden flex items-center justify-center font-sans">
      {/* Background Particles / Circuit Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px), radial-gradient(circle at center, #a855f7 1px, transparent 1px)', 
          backgroundSize: '40px 40px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />
      
      {/* Floating Animated Icons (Background) */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] left-[15%]">
              <Code2 className="w-16 h-16 text-blue-500/30" />
            </motion.div>
            <motion.div animate={{ y: [0, 20, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-[20%] right-[15%]">
              <Gamepad2 className="w-20 h-20 text-purple-500/30" />
            </motion.div>
            <motion.div animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[30%] right-[20%]">
              <BrainCircuit className="w-12 h-12 text-cyan-500/30" />
            </motion.div>
            <motion.div animate={{ y: [0, 15, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-[30%] left-[25%]">
              <Terminal className="w-10 h-10 text-pink-500/30" />
            </motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[50%] left-[5%]">
              <Cpu className="w-14 h-14 text-indigo-500/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full px-4"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {!isLoaded ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="flex flex-col items-center"
          >
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-6 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-mono text-2xl font-black tracking-widest loop-glow">
              INITIALIZING... {loadingProgress}%
            </div>
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-xs text-slate-500 uppercase tracking-[0.3em] font-light"
            >
              Loading Core Modules
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.2, filter: 'blur(20px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative relative group"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-purple-500/30 transition-colors duration-1000" />
              
              {/* Light Streak Sweep Animation */}
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full transform -skew-x-12 z-20 mix-blend-overlay pointer-events-none"
              />

              <motion.div 
                animate={{ boxShadow: ['0 0 40px rgba(59,130,246,0.3)', '0 0 80px rgba(168,85,247,0.6)', '0 0 40px rgba(59,130,246,0.3)'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="rounded-full overflow-hidden border-2 border-white/10 p-2 glass relative z-10 bg-black/40 backdrop-blur-md"
              >
                <img 
                  src="https://i.postimg.cc/CM7ygX2m/GDX-BARND-LOGO.jpg" 
                  alt="GDX MAYA NAGRI"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full mix-blend-screen"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 text-center"
            >
              <h3 className="text-sm md:text-md text-blue-400 font-black uppercase tracking-[0.4em] mb-4">
                Welcome To
              </h3>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                GDX MAYA NAGRI
              </h1>
              <div className="flex items-center justify-center flex-wrap gap-3 md:gap-6 text-[10px] md:text-xs tracking-[0.3em] font-medium text-purple-300/80 mb-16">
                <span>WEB DEVELOPER</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                <span>GAME DEVELOPER</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_10px_#f472b6]"></span>
                <span>AI DEVELOPER</span>
              </div>

              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="relative px-12 py-5 rounded-full bg-transparent overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-70 group-hover:opacity-100 transition-opacity blur-[2px]" />
                <div className="absolute inset-[1px] bg-black rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 group-hover:from-blue-600/40 group-hover:via-purple-600/40 group-hover:to-pink-600/40 transition-colors" />
                
                {/* Button light sweep */}
                 <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

                <span className="relative z-10 text-white font-black text-sm uppercase tracking-[0.3em] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                  ENTER
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { left: 200%; }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
