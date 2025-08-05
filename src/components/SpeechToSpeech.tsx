import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Trash2, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpeechTranscript } from '../types';

export default function SpeechToSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [showTranscripts, setShowTranscripts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { state, dispatch } = useApp();

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentTranscript('');
    // Simulate speech recognition
    simulateSpeechRecognition();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (currentTranscript) {
      saveTranscript();
    }
  };

  const simulateSpeechRecognition = () => {
    const sampleTexts = [
      "I've been feeling really overwhelmed lately with work and personal responsibilities. Sometimes it feels like I'm drowning in tasks and I don't know how to prioritize.",
      "Today was actually a good day. I managed to complete most of my goals and felt productive. It's nice when things go according to plan.",
      "I'm struggling with some anxiety about an upcoming presentation. I keep overthinking what could go wrong.",
      "I've been reflecting on my relationships and wondering if I'm being a good friend to the people I care about."
    ];
    
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentTranscript(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const saveTranscript = () => {
    const transcript: SpeechTranscript = {
      id: Date.now().toString(),
      name: `Session ${new Date().toLocaleDateString()}`,
      content: currentTranscript,
      timestamp: new Date().toISOString(),
      emotion: analyzeEmotion(currentTranscript)
    };
    
    dispatch({ type: 'ADD_SPEECH_TRANSCRIPT', payload: transcript });
  };

  const analyzeEmotion = (text: string): string => {
    if (text.toLowerCase().includes('overwhelmed') || text.toLowerCase().includes('anxious')) return 'stressed';
    if (text.toLowerCase().includes('good') || text.toLowerCase().includes('productive')) return 'positive';
    if (text.toLowerCase().includes('struggling') || text.toLowerCase().includes('worried')) return 'concerned';
    return 'neutral';
  };

  const handleDeleteTranscript = (id: string) => {
    dispatch({ type: 'DELETE_TRANSCRIPT', payload: id });
  };

  const handleRenameTranscript = (id: string, newName: string) => {
    dispatch({ type: 'RENAME_TRANSCRIPT', payload: { id, name: newName } });
    setEditingId(null);
    setEditName('');
  };

  const startEditing = (transcript: SpeechTranscript) => {
    setEditingId(transcript.id);
    setEditName(transcript.name);
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'positive': return 'text-green-400';
      case 'stressed': return 'text-red-400';
      case 'concerned': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Main Recording Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Speech-to-Speech Companion
            </h1>
            <p className="text-gray-300">Express your feelings through voice and receive supportive responses</p>
          </motion.div>

          {/* Recording Button */}
          <motion.div
            className="relative mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-40 h-40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isRecording 
                ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-2xl shadow-red-500/30' 
                : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/30'
            }`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <MicOff className="w-16 h-16 text-white" />
                </motion.div>
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </div>
            
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </motion.div>

          <p className="text-gray-300 mb-8 text-center">
            {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
          </p>

          {/* Current Transcript */}
          {(currentTranscript || isRecording) && (
            <motion.div
              className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Mic className="w-5 h-5 mr-2 text-blue-400" />
                Live Transcript
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 min-h-[100px]">
                <p className="text-gray-200 leading-relaxed">
                  {currentTranscript}
                  {isRecording && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel - Transcripts */}
        <motion.div 
          className="w-96 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Saved Sessions</h2>
            <button
              onClick={() => setShowTranscripts(!showTranscripts)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showTranscripts ? 'Hide' : 'Show'} ({state.speechTranscripts.length})
            </button>
          </div>

          <AnimatePresence>
            {showTranscripts && (
              <motion.div
                className="space-y-4 max-h-96 overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {state.speechTranscripts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No sessions yet. Start recording to save your first transcript.
                  </p>
                ) : (
                  state.speechTranscripts.map((transcript) => (
                    <motion.div
                      key={transcript.id}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {editingId === transcript.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 px-2 py-1 bg-gray-600 rounded text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameTranscript(transcript.id, editName);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleRenameTranscript(transcript.id, editName)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-sm">{transcript.name}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditing(transcript)}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTranscript(transcript.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>{new Date(transcript.timestamp).toLocaleDateString()}</span>
                        <span className={`font-semibold ${getEmotionColor(transcript.emotion || 'neutral')}`}>
                          {transcript.emotion}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {transcript.content}
                      </p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}