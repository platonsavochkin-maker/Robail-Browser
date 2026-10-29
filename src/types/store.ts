export interface ExtensionItem {
  id: string;
  name: string;
  category: 'security' | 'gaming' | 'productivity' | 'design';
  shortDesc: string;
  fullDesc: string;
  author: string;
  version: string;
  rating: number;
  downloads: string;
  icon: string;
  badge?: string;
  isInstalled: boolean;
  isEnabled: boolean;
}

export interface ModItem {
  id: string;
  name: string;
  subTitle: string;
  category: 'theme' | 'gaming' | 'audio';
  description: string;
  author: string;
  version: string;
  rating: number;
  badge: string;
  isInstalled: boolean;
  isActive: boolean;
  accentColor: string;
  features: string[];
}
