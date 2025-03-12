export interface SearchHistory {
  query: string;
  url: string;
  timestamp: number;
  keywords: string[];
  dorks: string[];
}

const STORAGE_KEY = 'google-dorks-history';

export function saveSearch(search: SearchHistory): void {
  const history = getSearchHistory();
  const updatedHistory = [search, ...history].slice(0, 50); // Keep last 50 searches
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
}

export function getSearchHistory(): SearchHistory[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearSearchHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}