export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  duration: string;
  date: string;
  imageUrl: string;
  tags: string[];
  fullTranscript: string;
}

export enum NoteType {
  HIGHLIGHT = 'HIGHLIGHT',
  EXTRACT = 'EXTRACT',
  DEEP_DIVE = 'DEEP_DIVE',
}

export interface Note {
  id: string;
  type: NoteType;
  originalText: string;
  content?: string; // For Extract/Deep Dive results
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
