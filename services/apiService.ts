
import { User, TimelineItem, Category } from '../types';
import { MOCK_CATEGORIES } from './timelineData';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { seedTimelineIfEmpty } from './seedTimeline';

const STORAGE_KEYS = {
  SESSION: 'chronos_user_session'
};

const TIMELINE_COLLECTION = "timelinedata";

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

  /**
   * Delegates to the dedicated seeding service.
   */
  async ensureSeeded(): Promise<void> {
    await seedTimelineIfEmpty();
  },

  async getTimeline(): Promise<TimelineItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, TIMELINE_COLLECTION));
      const items: TimelineItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TimelineItem);
      });
      return items;
    } catch (error) {
      console.error("Error fetching timeline from Firestore:", error);
      throw error;
    }
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<void> {
    await addDoc(collection(db, TIMELINE_COLLECTION), {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  async updateTimelineItem(id: string, updatedFields: Partial<TimelineItem>): Promise<void> {
    const itemRef = doc(db, TIMELINE_COLLECTION, id);
    await updateDoc(itemRef, {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteTimelineItem(id: string): Promise<void> {
    const itemRef = doc(db, TIMELINE_COLLECTION, id);
    await deleteDoc(itemRef);
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
