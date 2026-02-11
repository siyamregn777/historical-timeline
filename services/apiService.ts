
import { User, TimelineItem, Category, ItemType } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { seedTimelineIfEmpty } from './seedTimeline';
import { CATEGORIES } from '../constants';

const COLLECTIONS = ["event", "people"];

export const apiService = {
  async getCategories(): Promise<Category[]> {
    return CATEGORIES;
  },

  async ensureSeeded(): Promise<void> {
    await seedTimelineIfEmpty();
  },

  async getTimeline(): Promise<TimelineItem[]> {
    try {
      const allItems: TimelineItem[] = [];
      const snapshots = await Promise.all(
        COLLECTIONS.map(colName => getDocs(collection(db, colName)))
      );

      snapshots.forEach(snapshot => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          allItems.push({ id: doc.id, ...data } as TimelineItem);
        });
      });

      console.log(`[API] Loaded ${allItems.length} records from Firestore.`);
      return allItems;
    } catch (error) {
      console.error("Fetch failed:", error);
      throw error;
    }
  },

  // Fix: Updated login to accept optional password as used in Auth.tsx
  async login(email: string, password?: string): Promise<User> {
    return { id: 'guest-id', name: email.split('@')[0], email, role: 'user' };
  },

  // Fix: Updated signup to accept name, email, and optional password as used in Auth.tsx
  async signup(name: string, email: string, password?: string): Promise<User> {
    return { id: 'new-id', name, email, role: 'user' };
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<string> {
    const col = item.type === ItemType.PERSON ? 'people' : 'event';
    const docRef = await addDoc(collection(db, col), item);
    return docRef.id;
  },

  async updateTimelineItem(id: string, item: Omit<TimelineItem, 'id'>): Promise<void> {
    const col = item.type === ItemType.PERSON ? 'people' : 'event';
    await updateDoc(doc(db, col, id), item);
  },

  async deleteTimelineItem(id: string): Promise<void> {
    for (const col of COLLECTIONS) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (e) {}
    }
  },

  async updateUserProfile(data: any): Promise<User> {
    return { id: 'guest-id', name: data.name || 'Guest', email: 'guest@chronos.io', role: 'user' };
  }
};
