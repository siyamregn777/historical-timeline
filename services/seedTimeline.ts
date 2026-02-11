
import { collection, getDocs, addDoc, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { MOCK_PEOPLE, MOCK_EVENTS } from "./timelineData";

async function seedCollection(name: string, data: any[]) {
  const ref = collection(db, name);
  const snapshot = await getDocs(query(ref, limit(1)));

  if (!snapshot.empty) {
    console.log(`[SEED] Collection '${name}' is already populated. Skipping.`);
    return;
  }

  console.log(`[SEED] Seeding ${data.length} entries into '${name}'...`);

  for (const item of data) {
    try {
      const docRef = await addDoc(ref, {
        ...item,
        createdAt: new Date().toISOString()
      });
      console.log(`[SUCCESS] '${name}' -> ${item.title.en} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`[ERROR] Failed to seed into '${name}':`, error);
    }
  }
}

export async function seedTimelineIfEmpty() {
  try {
    console.log("🚀 Starting Bulk Seeding Sequence...");
    await seedCollection("people", MOCK_PEOPLE);
    await seedCollection("event", MOCK_EVENTS);
    console.log("✨ Seeding Sequence Complete.");
  } catch (error) {
    console.error("❌ Critical Seeding Error:", error);
  }
}
