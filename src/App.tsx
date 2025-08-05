import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './components/Auth';
import Home from './components/Home';
import AnonymousWall from './components/AnonymousWall';
import SpeechToSpeech from './components/SpeechToSpeech';
import CalmSounds from './components/CalmSounds';
import EmotionCheckIns from './components/EmotionCheckIns';
import Navigation from './components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <Auth />;
  }

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <Home />;
      case 'wall':
        return <AnonymousWall />;
      case 'speech':
        return <SpeechToSpeech />;
      case 'calm':
        return <CalmSounds />;
      case 'checkins':
        return <EmotionCheckIns />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="relative">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;