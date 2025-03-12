export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  phones: string[];
  emails: string[];
  relevance?: number;
  thumbnail?: string;
  fileType?: string; // Added to support different file types in results
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