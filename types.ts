
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice';
  imageUrl?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  lastSeen: string;
  status: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  CHATS = 'CHATS',
  ROOM = 'ROOM'
}
