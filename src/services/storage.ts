export interface SearchHistory {
  query: string;
  url: string;
  timestamp: number;
  keywords: string[];
  dorks: string[];
}

const STORAGE_KEY = 'google-dorks-history';
const USER_DATA_KEY = 'google-dorks-user';

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

export function saveUserData(userData: any): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export function getUserData(): any | null {
  const stored = localStorage.getItem(USER_DATA_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}