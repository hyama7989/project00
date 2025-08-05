import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Mic, Leaf, BarChart3, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navigationItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'wall', icon: MessageSquare, label: 'Anonymous Wall' },
  { id: 'speech', icon: Mic, label: 'Speech-to-Speech' },
  { id: 'calm', icon: Leaf, label: 'Calm Sounds' },
  { id: 'checkins', icon: BarChart3, label: 'Emotion Check-ins' }
];

// Star shape path for custom SVG
const StarShape = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useApp();

  const handleNavigation = (pageId: string) => {
    dispatch({ type: 'SET_PAGE', payload: pageId });
    setIsOpen(false);
  };

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        {/* Main Menu Button */}
        <motion.button
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/25 transition-all duration-300 backdrop-blur-md border border-white/10 relative overflow-hidden"
          style={{
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            borderRadius: '0'
          }}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <StarShape className="w-6 h-6" />
        </motion.button>

        {/* Semi-circle Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute left-0 top-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navigationItems.map((item, index) => {
                const angle = (index * 36) - 72; // -72 to 72 degrees for semi-circle
                const radius = 120;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <motion.button
                    key={item.id}
                    className={`absolute w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md border border-white/10 ${
                      state.currentPage === item.id
                        ? 'bg-gradient-to-br from-teal-500 to-blue-500 shadow-teal-500/25'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 hover:shadow-white/10'
                    }`}
                    style={{
                      left: x + 32 - 24, // Center the button
                      top: y + 32 - 24
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.id)}
                    title={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}