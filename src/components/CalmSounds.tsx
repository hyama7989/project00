import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { CalmTrack } from '../types';

const calmTracks: CalmTrack[] = [
  {
    id: '1',
    name: 'Ocean Waves',
    duration: '10:00',
    category: 'nature',
    url: 'https://example.com/ocean-waves'
  },
  {
    id: '2',
    name: 'Forest Rain',
    duration: '15:00',
    category: 'nature',
    url: 'https://example.com/forest-rain'
  },
  {
    id: '3',
    name: 'Deep Breathing Guide',
    duration: '8:00',
    category: 'breathing',
    url: 'https://example.com/breathing-guide'
  },
  {
    id: '4',
    name: 'Mountain Wind',
    duration: '12:00',
    category: 'nature',
    url: 'https://example.com/mountain-wind'
  },
  {
    id: '5',
    name: 'Peaceful Meditation',
    duration: '20:00',
    category: 'meditation',
    url: 'https://example.com/meditation'
  },
  {
    id: '6',
    name: 'Ambient Piano',
    duration: '18:00',
    category: 'ambient',
    url: 'https://example.com/ambient-piano'
  }
];

export default function CalmSounds() {
  const [currentTrack, setCurrentTrack] = useState<CalmTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);

  const handlePlayPause = (track?: CalmTrack) => {
    if (track && track.id !== currentTrack?.id) {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = calmTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % calmTracks.length;
    setCurrentTrack(calmTracks[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = calmTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? calmTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(calmTracks[prevIndex]);
    setCurrentTime(0);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature': return 'from-green-500 to-teal-500';
      case 'breathing': return 'from-blue-500 to-indigo-500';
      case 'meditation': return 'from-purple-500 to-pink-500';
      case 'ambient': return 'from-orange-500 to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature': return '🌿';
      case 'breathing': return '🌬️';
      case 'meditation': return '🧘';
      case 'ambient': return '🎵';
      default: return '🎵';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = ['all', 'nature', 'breathing', 'meditation', 'ambient'];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTracks = selectedCategory === 'all' 
    ? calmTracks 
    : calmTracks.filter(track => track.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Calm & Relaxation
          </h1>
          <p className="text-gray-300">Find peace with our curated collection of soothing sounds and breathing guides</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 bg-gray-800/50 backdrop-blur-md rounded-xl p-2 border border-gray-700/50">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Track List */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  className={`bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                    currentTrack?.id === track.id
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePlayPause(track)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(track.category)} flex items-center justify-center text-lg`}>
                        {getCategoryIcon(track.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{track.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{track.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{track.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentTrack?.id === track.id && isPlaying
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(track);
                      }}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-1" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Player Panel */}
          <motion.div 
            className="w-80 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 h-fit sticky top-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center">Now Playing</h2>
            
            {currentTrack ? (
              <div className="space-y-6">
                {/* Track Info */}
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getCategoryColor(currentTrack.category)} flex items-center justify-center text-2xl mx-auto mb-4`}>
                    {getCategoryIcon(currentTrack.category)}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{currentTrack.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{currentTrack.category}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / 600) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-300 transition-all duration-300"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handlePlayPause()}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-300 transition-all duration-300"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p>Select a track to start playing</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}