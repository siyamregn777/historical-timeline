
import { User, TimelineItem, UserRole } from '../types';
import { MOCK_DATA } from './timelineData';

/**
 * MOCK PERSISTENCE ENGINE - OPEN ACCESS VERSION
 * This service allows any user to enter by email.
 * If the user doesn't exist, it is created automatically.
 */

const STORAGE_KEYS = {
  USERS: 'chronos_db_users',
  TIMELINE: 'chronos_db_timeline',
  SESSION: 'chronos_user_session'
};

const ADMIN_EMAIL = "admin@gmail.com";

const getStorageData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setStorageData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initDB = () => {
  if (!getStorageData(STORAGE_KEYS.TIMELINE)) {
    setStorageData(STORAGE_KEYS.TIMELINE, MOCK_DATA);
  }
  if (!getStorageData(STORAGE_KEYS.USERS)) {
    setStorageData(STORAGE_KEYS.USERS, [{
      id: 'admin-123',
      name: 'Administrator',
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: new Date().toISOString()
    }]);
  }
};

initDB();

export const apiService = {
  /**
   * Universal Login: If user is not found, automatically signs them up.
   * This removes the "Account not found" error entirely.
   */
  async login(email: string, _pass: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getStorageData(STORAGE_KEYS.USERS) || [];
    const cleanEmail = email.toLowerCase().trim();
    let user = users.find((u: any) => u.email === cleanEmail);

    if (!user) {
      // Auto-signup if not found
      const defaultName = cleanEmail.split('@')[0];
      const displayName = cleanEmail === ADMIN_EMAIL ? "Administrator" : (defaultName.charAt(0).toUpperCase() + defaultName.slice(1));
      return this.signup(displayName, cleanEmail, "password");
    }

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, _pass: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStorageData(STORAGE_KEYS.USERS) || [];
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = users.find((u: any) => u.email === cleanEmail);

    if (existingUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(existingUser));
      return existingUser;
    }

    const role: UserRole = cleanEmail === ADMIN_EMAIL ? 'admin' : 'user';
    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: cleanEmail,
      role,
      photoURL: ""
    };

    users.push({ ...newUser, createdAt: new Date().toISOString() });
    setStorageData(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));

    return newUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  onAuthUpdate(callback: (user: User | null) => void): () => void {
    const savedUser = getStorageData(STORAGE_KEYS.SESSION);
    callback(savedUser);
    return () => {};
  },

  async getTimeline(): Promise<TimelineItem[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getStorageData(STORAGE_KEYS.TIMELINE) || [];
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<void> {
    const items = getStorageData(STORAGE_KEYS.TIMELINE) || [];
    const newItem = { ...item, id: `item-${Date.now()}` };
    items.push(newItem);
    setStorageData(STORAGE_KEYS.TIMELINE, items);
  },

  async updateTimelineItem(id: string, updatedFields: Partial<TimelineItem>): Promise<void> {
    const items = getStorageData(STORAGE_KEYS.TIMELINE) || [];
    const index = items.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      setStorageData(STORAGE_KEYS.TIMELINE, items);
    }
  },

  async deleteTimelineItem(id: string): Promise<void> {
    const items = getStorageData(STORAGE_KEYS.TIMELINE) || [];
    const filtered = items.filter((i: any) => i.id !== id);
    setStorageData(STORAGE_KEYS.TIMELINE, filtered);
  },

  async updateUserProfile(data: { name?: string, photoURL?: string, password?: string }): Promise<User> {
    const sessionUser = getStorageData(STORAGE_KEYS.SESSION);
    if (!sessionUser) throw new Error("Not logged in");

    const users = getStorageData(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex((u: any) => u.id === sessionUser.id);

    if (index !== -1) {
      if (data.name) users[index].name = data.name;
      if (data.photoURL !== undefined) users[index].photoURL = data.photoURL;
      
      const updatedUser = { ...sessionUser, ...users[index] };
      setStorageData(STORAGE_KEYS.USERS, users);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
      return updatedUser;
    }

    throw new Error("User not found");
  }
};
