
// Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  status: 'new' | 'contacted' | 'closed';
  date: string;
}

export interface AppSettings {
  aiName: string;
  businessName: string;
  phone: string;
  email: string;
  workingHours: string;
  pricePerConsultation: string;
}

// Default Data
const DEFAULT_SETTINGS: AppSettings = {
  aiName: "Анна",
  businessName: "Моята Компания",
  phone: "+359 888 123 456",
  email: "office@example.com",
  workingHours: "Пон-Пет: 09:00 - 18:00",
  pricePerConsultation: "50 лв"
};

// Storage Keys
const KEYS = {
  LEADS: 'ai_receptionist_leads',
  SETTINGS: 'ai_receptionist_settings',
  AUTH: 'ai_receptionist_auth'
};

export const db = {
  // Leads Management
  getLeads: (): Lead[] => {
    try {
      const data = localStorage.getItem(KEYS.LEADS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addLead: (lead: Omit<Lead, 'id' | 'status' | 'date'>) => {
    const leads = db.getLeads();
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      date: new Date().toISOString()
    };
    localStorage.setItem(KEYS.LEADS, JSON.stringify([newLead, ...leads]));
    return newLead;
  },

  updateLeadStatus: (id: string, status: Lead['status']) => {
    const leads = db.getLeads().map(l => 
      l.id === id ? { ...l, status } : l
    );
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
  },

  deleteLead: (id: string) => {
    const leads = db.getLeads().filter(l => l.id !== id);
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
  },

  // Settings Management
  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Auth (Simple Simulation)
  login: (password: string): boolean => {
    // Hardcoded password for demo: "admin"
    if (password === "admin") {
      localStorage.setItem(KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(KEYS.AUTH);
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  }
};
