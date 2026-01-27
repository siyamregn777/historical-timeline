import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { MOCK_DATA } from "./timelineData";

export async function seedTimelineIfEmpty() {
  try {
    console.log("🌱 Checking timeline collection...");
    const ref = collection(db, "timeline");
    const snapshot = await getDocs(ref);

    if (!snapshot.empty) {
      console.log(`✅ Timeline already has ${snapshot.size} items`);
      return;
    }

    console.log("📭 Collection empty, seeding data...");

    // Use your MOCK_DATA from timelineData.ts
    for (const item of MOCK_DATA) {
      try {
        await addDoc(ref, {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        });
        console.log(`✓ Added: ${item.title?.en || item.title}`);
      } catch (error) {
        console.error(`✗ Failed to add item:`, error);
      }
    }

    console.log("✅ Timeline seeding complete");
    
  } catch (error) {
    console.error("❌ Error seeding timeline:", error);
    throw error;
  }
}