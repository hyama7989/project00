import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmotionCheckIn } from '../types';

export default function EmotionCheckIns() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState({
    mood: 5,
    notes: ''
  });
  const { state, dispatch } = useApp();

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkIn: EmotionCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: newCheckIn.mood,
      notes: newCheckIn.notes,
      source: 'manual'
    };
    
    dispatch({ type: 'ADD_EMOTION_CHECKIN', payload: checkIn });
    setShowAddModal(false);
    setNewCheckIn({ mood: 5, notes: '' });
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return 'Very Low';
    if (mood <= 4) return 'Low';
    if (mood <= 6) return 'Neutral';
    if (mood <= 8) return 'Good';
    return 'Excellent';
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'text-red-400';
    if (mood <= 4) return 'text-orange-400';
    if (mood <= 6) return 'text-yellow-400';
    if (mood <= 8) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😕';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  // Calculate stats
  const averageMood = state.emotionCheckIns.length > 0 
    ? state.emotionCheckIns.reduce((sum, checkIn) => sum + checkIn.mood, 0) / state.emotionCheckIns.length
    : 0;

  const last7Days = state.emotionCheckIns
    .filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return checkInDate >= weekAgo;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTrend = () => {
    if (last7Days.length < 2) return 'stable';
    const recent = last7Days.slice(-3).reduce((sum, c) => sum + c.mood, 0) / 3;
    const earlier = last7Days.slice(0, -3).reduce((sum, c) => sum + c.mood, 0) / (last7Days.length - 3);
    
    if (recent > earlier + 0.5) return 'up';
    if (recent < earlier - 0.5) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Daily Emotion Check-ins
          </h1>
          <p className="text-gray-300">Track your emotional journey and discover patterns in your well-being</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Mood</p>
                <p className="text-2xl font-bold text-white">{averageMood.toFixed(1)}/10</p>
                <p className={`text-sm font-medium ${getMoodColor(averageMood)}`}>
                  {getMoodLabel(averageMood)}
                </p>
              </div>
              <div className="text-3xl">{getMoodEmoji(averageMood)}</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">7-Day Trend</p>
                <p className="text-2xl font-bold text-white">
                  {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
                </p>
                <p className="text-sm text-gray-300">{last7Days.length} check-ins</p>
              </div>
              <div className="text-2xl">
                {trend === 'up' && <TrendingUp className="w-8 h-8 text-green-400" />}
                {trend === 'down' && <TrendingDown className="w-8 h-8 text-red-400" />}
                {trend === 'stable' && <Minus className="w-8 h-8 text-yellow-400" />}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Check-ins</p>
                <p className="text-2xl font-bold text-white">{state.emotionCheckIns.length}</p>
                <p className="text-sm text-gray-300">All time</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
        </div>

        <div className="flex gap-6">
          {/* Chart Area */}
          <div className="flex-1">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-6">Mood Timeline</h2>
              
              {state.emotionCheckIns.length > 0 ? (
                <div className="space-y-4">
                  {/* Chart visualization would go here - simplified version */}
                  <div className="h-64 bg-gray-700/30 rounded-lg flex items-end justify-around p-4">
                    {last7Days.slice(-7).map((checkIn, index) => (
                      <div key={checkIn.id} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                          style={{ height: `${(checkIn.mood / 10) * 200}px` }}
                        />
                        <span className="text-xs text-gray-400 mt-2">
                          {new Date(checkIn.date).toLocaleDateString('en', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>0 - Very Low</span>
                    <span>5 - Neutral</span>
                    <span>10 - Excellent</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-lg mb-2">No check-ins yet</p>
                  <p>Start tracking your daily emotions to see patterns over time</p>
                </div>
              )}
            </motion.div>

            {/* Add Check-in Button */}
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Today's Check-in</span>
            </motion.button>
          </div>

          {/* Recent Check-ins */}
          <motion.div 
            className="w-80 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-6">Recent Check-ins</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {state.emotionCheckIns
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(checkIn.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${getMoodColor(checkIn.mood)}`}>
                          {checkIn.mood}/10
                        </span>
                        <span className="text-lg">{getMoodEmoji(checkIn.mood)}</span>
                      </div>
                    </div>
                    
                    <p className={`text-sm font-medium ${getMoodColor(checkIn.mood)} mb-1`}>
                      {getMoodLabel(checkIn.mood)}
                    </p>
                    
                    {checkIn.notes && (
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {checkIn.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        checkIn.source === 'manual' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {checkIn.source === 'manual' ? 'Manual' : 'AI Detected'}
                      </span>
                    </div>
                  </div>
                ))}
              
              {state.emotionCheckIns.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No check-ins yet. Add your first one to get started!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Check-in Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">How are you feeling today?</h2>
            
            <form onSubmit={handleSubmitCheckIn} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-4">Mood Level</label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newCheckIn.mood}
                    onChange={(e) => setNewCheckIn({...newCheckIn, mood: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 - Very Low</span>
                    <span>5 - Neutral</span>
                    <span>10 - Excellent</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl">{getMoodEmoji(newCheckIn.mood)}</span>
                    <p className={`text-lg font-semibold ${getMoodColor(newCheckIn.mood)}`}>
                      {newCheckIn.mood}/10 - {getMoodLabel(newCheckIn.mood)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                <textarea
                  value={newCheckIn.notes}
                  onChange={(e) => setNewCheckIn({...newCheckIn, notes: e.target.value})}
                  placeholder="What's contributing to how you feel today?"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Save Check-in
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}