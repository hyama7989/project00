import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Copy, Hash, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnonymousPost } from '../types';

const emotionEmojis = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🥺', label: 'Vulnerable' }
];

const emotionHashtags = [
  '#depression', '#anxiety', '#stress', '#lonely', '#grateful',
  '#overwhelmed', '#hopeful', '#confused', '#angry', '#peaceful'
];

export default function AnonymousWall() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postData, setPostData] = useState({
    topic: '',
    emotion: '',
    selectedEmoji: '',
    selectedHashtags: [] as string[]
  });
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Generate anonymous username if not exists
    if (!state.anonymousUsername) {
      const username = `Anonymous${Math.floor(Math.random() * 9999)}`;
      dispatch({ type: 'SET_ANONYMOUS_USERNAME', payload: username });
    }
  }, [state.anonymousUsername, dispatch]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: AnonymousPost = {
      id: Date.now().toString(),
      username: state.anonymousUsername,
      topic: postData.topic,
      emotion: postData.emotion,
      hashtags: postData.selectedHashtags,
      emojiMood: postData.selectedEmoji,
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 50),
      views: Math.floor(Math.random() * 200) + 50,
      isOwner: true
    };

    dispatch({ type: 'ADD_ANONYMOUS_POST', payload: newPost });
    setShowPostModal(false);
    setPostData({
      topic: '',
      emotion: '',
      selectedEmoji: '',
      selectedHashtags: []
    });
  };

  const toggleHashtag = (hashtag: string) => {
    if (postData.selectedHashtags.includes(hashtag)) {
      setPostData({
        ...postData,
        selectedHashtags: postData.selectedHashtags.filter(h => h !== hashtag)
      });
    } else {
      setPostData({
        ...postData,
        selectedHashtags: [...postData.selectedHashtags, hashtag]
      });
    }
  };

  const handleLike = (postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: postId });
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(state.anonymousUsername);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Main Feed */}
        <div className="flex-1">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" 
                style={{ fontFamily: 'Instagram Sans, sans-serif' }}>
              Anonymous Wall: Let Your Inner Feelings Out
            </h1>
            <p className="text-gray-300">Share your emotions freely in a safe, anonymous space</p>
          </motion.div>

          {/* Post Button */}
          <motion.button
            onClick={() => setShowPostModal(true)}
            className="w-full mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Share Your Feelings</span>
          </motion.button>

          {/* Posts Feed */}
          <div className="space-y-6">
            {state.anonymousPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{post.topic}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <span>{post.username}</span>
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestamp(post.timestamp)}</span>
                    </div>
                  </div>
                  {post.emojiMood && (
                    <span className="text-2xl">{post.emojiMood}</span>
                  )}
                </div>

                <p className="text-gray-200 mb-4 leading-relaxed">{post.emotion}</p>

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((hashtag, idx) => (
                      <span key={idx} className="text-gray-400 text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  
                  {post.isOwner && (
                    <button className="text-blue-400 text-sm opacity-60 cursor-not-allowed">
                      AI Explain (Coming Soon)
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {state.anonymousPosts.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <p className="text-lg">No posts yet. Be the first to share your feelings!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <motion.div 
          className="w-80 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">{state.anonymousUsername}</span>
              <button onClick={copyUsername} className="text-blue-400 hover:text-blue-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm">Your anonymous identity</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Activity</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Posts shared:</span>
                  <span>{state.anonymousPosts.filter(p => p.isOwner).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total likes received:</span>
                  <span>
                    {state.anonymousPosts
                      .filter(p => p.isOwner)
                      .reduce((sum, p) => sum + p.likes, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Share Your Feelings</h2>
              
              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Topic</label>
                  <input
                    type="text"
                    value={postData.topic}
                    onChange={(e) => setPostData({...postData, topic: e.target.value})}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Your Feelings</label>
                  <textarea
                    value={postData.emotion}
                    onChange={(e) => setPostData({...postData, emotion: e.target.value})}
                    placeholder="Express how you're feeling..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Mood (Optional)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {emotionEmojis.map((emotion) => (
                      <button
                        key={emotion.emoji}
                        type="button"
                        onClick={() => setPostData({
                          ...postData, 
                          selectedEmoji: postData.selectedEmoji === emotion.emoji ? '' : emotion.emoji
                        })}
                        className={`p-3 rounded-lg text-2xl hover:bg-gray-600 transition-colors ${
                          postData.selectedEmoji === emotion.emoji ? 'bg-blue-600' : 'bg-gray-700'
                        }`}
                        title={emotion.label}
                      >
                        {emotion.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Tags (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {emotionHashtags.map((hashtag) => (
                      <button
                        key={hashtag}
                        type="button"
                        onClick={() => toggleHashtag(hashtag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          postData.selectedHashtags.includes(hashtag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}