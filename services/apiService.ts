
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { User, TimelineItem, UserRole } from '../types';

// NOTE: Replace these placeholders with your actual Firebase Project configuration
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
  /**
   * Logs in a user via Firebase Auth and retrieves their role from Firestore.
   */
  async login(email: string, pass: string): Promise<User> {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', res.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    let role: UserRole = 'user';
    if (userDoc.exists()) {
      role = userDoc.data()?.role as UserRole;
    } else {
      // Fallback for existing auth users without firestore docs
      role = email === ADMIN_EMAIL ? 'admin' : 'user';
      await setDoc(userDocRef, { role, email: res.user.email, name: res.user.displayName });
    }

    return {
      id: res.user.uid,
      email: res.user.email!,
      name: res.user.displayName || 'Explorer',
      role,
      photoURL: res.user.photoURL || undefined
    };
  },

  /**
   * Registers a new user, automatically assigning 'admin' role to admin@gmail.com
   */
  async signup(name: string, email: string, pass: string): Promise<User> {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Determine role
    const role: UserRole = email === ADMIN_EMAIL ? 'admin' : 'user';
    
    // Update Auth Profile
    await updateProfile(res.user, { displayName: name });
    
    // Create Firestore User Document
    await setDoc(doc(db, 'users', res.user.uid), { 
      name, 
      email, 
      role,
      createdAt: new Date().toISOString()
    });

    return {
      id: res.user.uid,
      email: res.user.email!,
      name,
      role
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Listens for auth state changes and syncs with Firestore roles.
   */
  onAuthUpdate(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || 'Explorer',
            role: (userDoc.data()?.role as UserRole) || 'user',
            photoURL: firebaseUser.photoURL || undefined
          });
        } catch (e) {
          console.error("Error fetching user role:", e);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  async getTimeline(): Promise<TimelineItem[]> {
    const q = query(collection(db, 'timeline'), orderBy('startYear'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineItem));
  },

  async addTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<void> {
    await addDoc(collection(db, 'timeline'), item);
  },

  async updateTimelineItem(id: string, item: Partial<TimelineItem>): Promise<void> {
    const itemRef = doc(db, 'timeline', id);
    await updateDoc(itemRef, item as any);
  },

  async deleteTimelineItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'timeline', id));
  },

  async updateUserProfile(data: { name?: string, photoURL?: string, password?: string }): Promise<User> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    if (data.name || data.photoURL) {
      await updateProfile(user, { displayName: data.name, photoURL: data.photoURL });
      // Sync with Firestore
      await updateDoc(doc(db, 'users', user.uid), { 
        ...(data.name && { name: data.name }),
        ...(data.photoURL && { photoURL: data.photoURL })
      });
    }

    if (data.password) {
      await updatePassword(user, data.password);
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return {
      id: user.uid,
      email: user.email!,
      name: user.displayName || 'User',
      role: (userDoc.data()?.role as UserRole) || 'user',
      photoURL: user.photoURL || undefined
    };
  }
};
