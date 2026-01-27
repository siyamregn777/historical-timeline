
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5wIYcWT-acyXZt4Li_1mkQfV1NGr3cfA",
  authDomain: "historical-ad1eb.firebaseapp.com",
  projectId: "historical-ad1eb",
  storageBucket: "historical-ad1eb.appspot.com",
  messagingSenderId: "702447257650",
  appId: "1:702447257650:web:711317b053e1a416ac542b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
