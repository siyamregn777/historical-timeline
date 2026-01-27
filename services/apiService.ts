import { User, TimelineItem, Category, ItemType } from '../types';
import { MOCK_DATA, MOCK_CATEGORIES } from './timelineData';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

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
    try {
      console.log("📡 Fetching timeline from Firebase...");
      const snapshot = await getDocs(collection(db, "timeline"));
      console.log(`📊 Found ${snapshot.size} documents`);
      
      if (snapshot.empty) {
        console.log("📭 No timeline data found, returning mock data");
        return MOCK_DATA;
      }
      
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Ensure all required TimelineItem properties exist
        return {
          id: doc.id,
          type: data.type || ItemType.EVENT,
          title: data.title || { en: 'Untitled', he: 'ללא כותרת' },
          summary: data.summary || { en: '', he: '' },
          description: data.description || { en: '', he: '' },
          startYear: data.startYear || data.year || 0,
          endYear: data.endYear || data.startYear || data.year || 0,
          category: data.category || 'uncategorized',
          importance: data.importance || 3,
          zoomLevelMin: data.zoomLevelMin || 1,
          zoomLevelMax: data.zoomLevelMax || 100,
          imageUrl: data.imageUrl || '',
          articleUrl: data.articleUrl || '',
          parentId: data.parentId || null,
          isPeriod: data.isPeriod || false,
          tags: data.tags || [],
          sources: data.sources || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          createdBy: data.createdBy || 'system'
        } as TimelineItem;
      });
      
      console.log("✅ Successfully loaded timeline items:", items.length);
      return items;
      
    } catch (error) {
      console.error("❌ Failed to fetch timeline from Firebase:", error);
      console.log("🔄 Falling back to mock data");
      return MOCK_DATA;
    }
  },

  async addTimelineItem(item: Omit<TimelineItem, "id">) {
    await addDoc(collection(db, "timeline"), {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user'
    });
  },

  async updateTimelineItem(id: string, updatedFields: Partial<TimelineItem>) {
    const ref = doc(db, "timeline", id);
    await updateDoc(ref, {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteTimelineItem(id: string) {
    const ref = doc(db, "timeline", id);
    await deleteDoc(ref);
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