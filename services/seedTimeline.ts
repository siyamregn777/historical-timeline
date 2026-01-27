
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { MOCK_DATA } from "./timelineData";

/**
 * Seeds the Firestore 'timelinedata' collection with MOCK_DATA if it is currently empty.
 * This ensures the app has content on the first run.
 */
export async function seedTimelineIfEmpty() {
  try {
    console.log("🌱 Checking 'timelinedata' collection...");
    const ref = collection(db, "timelinedata");
    const snapshot = await getDocs(ref);

    if (!snapshot.empty) {
      console.log(`✅ Timeline already has ${snapshot.size} items in Firestore.`);
      return;
    }

    console.log("📭 Collection empty, seeding data from mock source...");

    // Iterate through MOCK_DATA and add to Firestore
    for (const item of MOCK_DATA) {
      try {
        // We strip the local 'id' so Firestore generates a unique one
        const { id, ...data } = item;
        
        await addDoc(ref, {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        });
        console.log(`✓ Seeded: ${item.title?.en || 'Untitled Item'}`);
      } catch (error) {
        console.error(`✗ Failed to seed item ${item.id}:`, error);
      }
    }

    console.log("✅ Timeline seeding complete.");
    
  } catch (error) {
    console.error("❌ Error seeding timeline:", error);
    throw error;
  }
}
