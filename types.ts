
export interface DiagnosisResult {
  id: string;
  plantName: string;
  disease: string;
  confidence: number;
  remedyId: string;
  timestamp: number;
  imageUrl: string;
  isTreated: boolean;
  isPlant: boolean;
}

export interface Remedy {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  targetDisease: string;
}

export type AppView = 'scanner' | 'remedies' | 'impact' | 'history' | 'profile' | 'settings' | 'calculator' | 'auth';

export interface User {
  name: string;
  email: string;
  password?: string;
  phone: string;
  location: string;
  farmSize: number;
  mainCrop: string;
  experienceYears: number;
  farmType: 'Organic' | 'Traditional' | 'Hydroponic';
  bio?: string;
  preferredContact?: 'Email' | 'Phone' | 'WhatsApp';
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  offlineMode: boolean;
  highContrast: boolean;
}
