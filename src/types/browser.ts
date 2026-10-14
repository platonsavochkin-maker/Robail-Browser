export type TabMode = 'start' | 'web';

export type SecurityThreat = 'virus' | 'pirate' | 'malware' | 'phishing' | 'blocked_domain' | 'user_reported' | null;

export interface DomainSecurity {
  isSecure: boolean;
  protocol: 'https' | 'http' | 'internal';
  hostname: string;
  statusText: string;
  reason: string;
  certificateIssuer?: string;
  encryption?: string;
  threatType?: SecurityThreat;
  isDangerous?: boolean;
}

export interface QuarantinedSite {
  domain: string;
  threatType: SecurityThreat;
  reason: string;
  deletedAt: number;
}

export interface ReaderArticle {
  title: string;
  author: string;
  leadImage?: string;
  readMinutes: number;
  wordCount: number;
  url: string;
  blocks: any[];
  rawSnippet?: string;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  history: string[];
  historyIndex: number;
  isPinned: boolean;
  mode: TabMode;
  security: DomainSecurity;
  readerData?: ReaderArticle | null;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
  source?: string;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  type: string;
  size: string;
  time: string;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  progress: number;
  status: 'completed' | 'downloading' | 'failed';
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  favicon?: string;
}

export type BrowserTheme = 'midnight' | 'cyberpunk' | 'arctic' | 'indigo' | 'emerald';
export type SearchEngine = 'robail' | 'google' | 'duckduckgo' | 'bing' | 'wikipedia';

export interface BrowserSettings {
  theme: BrowserTheme;
  layout: 'horizontal' | 'vertical';
  defaultSearchEngine: SearchEngine;
  adBlockEnabled: boolean;
  darkModeByDefault: boolean;
  doNotTrack: boolean;
  showBookmarksBar: boolean;
  hardwareAcceleration: boolean;
}
