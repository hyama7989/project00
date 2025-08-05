import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, ChatMessage, AnonymousPost, EmotionCheckIn, SpeechTranscript } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPage: string;
  chatMessages: ChatMessage[];
  anonymousPosts: AnonymousPost[];
  emotionCheckIns: EmotionCheckIn[];
  speechTranscripts: SpeechTranscript[];
  anonymousUsername: string;
  settings: {
    notifications: boolean;
    aiTone: 'formal' | 'casual';
    theme: 'dark';
  };
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_ANONYMOUS_POST'; payload: AnonymousPost }
  | { type: 'ADD_EMOTION_CHECKIN'; payload: EmotionCheckIn }
  | { type: 'ADD_SPEECH_TRANSCRIPT'; payload: SpeechTranscript }
  | { type: 'SET_ANONYMOUS_USERNAME'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'LIKE_POST'; payload: string }
  | { type: 'DELETE_TRANSCRIPT'; payload: string }
  | { type: 'RENAME_TRANSCRIPT'; payload: { id: string; name: string } };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentPage: 'auth',
  chatMessages: [],
  anonymousPosts: [],
  emotionCheckIns: [],
  speechTranscripts: [],
  anonymousUsername: '',
  settings: {
    notifications: true,
    aiTone: 'casual',
    theme: 'dark'
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        currentPage: 'home'
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    case 'ADD_ANONYMOUS_POST':
      return {
        ...state,
        anonymousPosts: [action.payload, ...state.anonymousPosts]
      };
    case 'ADD_EMOTION_CHECKIN':
      return {
        ...state,
        emotionCheckIns: [...state.emotionCheckIns, action.payload]
      };
    case 'ADD_SPEECH_TRANSCRIPT':
      return {
        ...state,
        speechTranscripts: [...state.speechTranscripts, action.payload]
      };
    case 'SET_ANONYMOUS_USERNAME':
      return {
        ...state,
        anonymousUsername: action.payload
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'LIKE_POST':
      return {
        ...state,
        anonymousPosts: state.anonymousPosts.map(post =>
          post.id === action.payload
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      };
    case 'DELETE_TRANSCRIPT':
      return {
        ...state,
        speechTranscripts: state.speechTranscripts.filter(t => t.id !== action.payload)
      };
    case 'RENAME_TRANSCRIPT':
      return {
        ...state,
        speechTranscripts: state.speechTranscripts.map(t =>
          t.id === action.payload.id
            ? { ...t, name: action.payload.name }
            : t
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}