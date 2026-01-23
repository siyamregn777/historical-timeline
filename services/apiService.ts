
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  doc,
  getDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { User, TimelineItem, UserRole } from '../types';
import { fetchTimelineData as getMockData } from './timelineData';

const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER",
  authDomain: "chronos-timeline.firebaseapp.com",
  projectId: "chronos-timeline",
  storageBucket: "chronos-timeline.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "admin@gmail.com";

export const apiService = {
  async login(email: string, pass: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const fUser = userCredential.user;
    
    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, 'users', fUser.uid));
    let role: UserRole = 'user';
    
    if (userDoc.exists()) {
      role = userDoc.data().role as UserRole;
    } else if (email === ADMIN_EMAIL) {
      role = 'admin';
      await setDoc(doc(db, 'users', fUser.uid), { email, name: email.split('@')[0], role });
    }

    return {
      id: fUser.uid,
      email: fUser.email || '',
      name: fUser.displayName || email.split('@')[0],
      role
    };
  },

  async signup(name: string, email: string, pass: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fUser = userCredential.user;
    await updateProfile(fUser, { displayName: name });
    
    const role: UserRole = email === ADMIN_EMAIL ? 'admin' : 'user';
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', fUser.uid), {
      email,
      name,
      role
    });
    
    return {
      id: fUser.uid,
      email: fUser.email || '',
      name: name,
      role
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthUpdate(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        const userDoc = await getDoc(doc(db, 'users', fUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : (fUser.email === ADMIN_EMAIL ? 'admin' : 'user');
        callback({
          id: fUser.uid,
          email: fUser.email || '',
          name: fUser.displayName || fUser.email?.split('@')[0] || 'User',
          role
        });
      } else {
        callback(null);
      }
    });
  },

  async getTimeline(): Promise<TimelineItem[]> {
    const timelineCol = collection(db, 'timeline_items');
    const q = query(timelineCol, orderBy('startYear', 'asc'));
    const snapshot = await getDocs(q);
    
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineItem));

    if (items.length === 0) {
      const mockData = await getMockData();
      for (const item of mockData) {
        await addDoc(timelineCol, item);
      }
      const reSnapshot = await getDocs(q);
      items = reSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineItem));
    }

    return items;
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<void> {
    const timelineCol = collection(db, 'timeline_items');
    await addDoc(timelineCol, item);
  }
};
