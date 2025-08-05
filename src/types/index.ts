export interface User {
  id: string;
  email: string;
  username: string;
  dateOfBirth: string;
  profilePicture?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  emotion?: string;
  isUser: boolean;
}

export interface AnonymousPost {
  id: string;
  username: string;
  topic: string;
  emotion: string;
  hashtags: string[];
  emojiMood?: string;
  timestamp: string;
  likes: number;
  views: number;
  isOwner: boolean;
}

export interface EmotionCheckIn {
  id: string;
  date: string;
  mood: number;
  notes?: string;
  source: 'manual' | 'ai';
}

export interface SpeechTranscript {
  id: string;
  name: string;
  content: string;
  timestamp: string;
  emotion?: string;
}

export interface CalmTrack {
  id: string;
  name: string;
  duration: string;
  category: 'breathing' | 'nature' | 'meditation' | 'ambient';
  url: string;
}