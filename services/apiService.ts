
import { User, TimelineItem } from '../types';
import { fetchTimelineData as getMockData } from './timelineData';

/**
 * This service simulates a Node.js/Firebase backend.
 * In production, these methods would call real endpoints or Firebase SDK.
 */
export const apiService = {
  // --- AUTH ENTITIES ---
  async login(email: string, pass: string): Promise<User> {
    console.log(`[API] Logging in: ${email}`);
    await new Promise(r => setTimeout(r, 800));
    const user = { id: 'u1', email, name: email.split('@')[0] };
    localStorage.setItem('chronos_user', JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, pass: string): Promise<User> {
    console.log(`[API] Signing up: ${email}`);
    await new Promise(r => setTimeout(r, 1000));
    const user = { id: 'u2', email, name };
    localStorage.setItem('chronos_user', JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem('chronos_user');
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem('chronos_user');
    return data ? JSON.parse(data) : null;
  },

  // --- DATA ENTITIES ---
  async getTimeline(): Promise<TimelineItem[]> {
    return getMockData();
  }
};
