export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  phones: string[];
  emails: string[];
  relevance?: number;
  thumbnail?: string;
  fileType?: string;
}

export interface SearchHistory {
  keyword: string;
  timestamp: string;
  resultCount: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  keywords?: string[];
}

export interface ChatState {
  messages: Message[];
  selectedKeywords: string[];
  businessContext?: string;
  selectedDorks: string[];
}

export interface GoogleDork {
  id: string;
  operator: string;
  description: string;
  category: 'contact' | 'document' | 'security' | 'social' | 'technical';
}

export interface UserData {
  name: string;
  email: string;
  whatsapp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  browser: {
    userAgent: string;
    language: string;
    platform: string;
    vendor: string;
    screenResolution: string;
    timezone: string;
  };
}