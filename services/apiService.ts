
import { User, TimelineItem, Category } from '../types';
import { MOCK_DATA, MOCK_CATEGORIES } from './timelineData';

const STORAGE_KEYS = {
  USERS: 'chronos_db_users',
  TIMELINE: 'chronos_db_timeline',
  SESSION: 'chronos_user_session'
};

export const apiService = {
  async login(email: string, _pass: string): Promise<User> {
    const isGuest = email.includes('guest') || email.includes('simulation');
    const user: User = {
      id: isGuest ? 'guest-curator' : `user-${Date.now()}`,
      name: isGuest ? 'Guest Curator' : email.split('@')[0],
      email: email.toLowerCase(),
      role: 'admin'
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, _pass: string): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      name: name,
      email: email.toLowerCase(),
      role: 'admin'
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  onAuthUpdate(callback: (user: User | null) => void): () => void {
    const check = () => {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  },

  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  },

  async getTimeline(): Promise<TimelineItem[]> {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : MOCK_DATA;
      } catch (e) {
        return MOCK_DATA;
      }
    }
    return MOCK_DATA;
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<void> {
    const items = await this.getTimeline();
    const newItem = { ...item, id: `item-${Date.now()}` };
    const updatedItems = [...items, newItem];
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(updatedItems));
  },

  async updateTimelineItem(id: string, updatedFields: Partial<TimelineItem>): Promise<void> {
    const items = await this.getTimeline();
    const index = items.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(items));
    }
  },

  async deleteTimelineItem(id: string): Promise<void> {
    const items = await this.getTimeline();
    const filtered = items.filter((i: any) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(filtered));
  },

  async updateUserProfile(data: { name?: string, photoURL?: string, password?: string }): Promise<User> {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    const currentUser = stored ? JSON.parse(stored) : null;
    const updatedUser = {
      ...currentUser,
      name: data.name || currentUser.name,
      photoURL: data.photoURL || currentUser.photoURL
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
    return updatedUser;
  }
};
