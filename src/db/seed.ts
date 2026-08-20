import { config } from "dotenv";
import bcrypt from "bcryptjs";
config({ path: ".env.local" });

async function seed() {
  console.log("⏳ Starting transferring data to PostgreSQL...");
  // Dynamically import the database and schema modules to avoid issues with top-level await
  const { db } = await import("./index");
  const { wordSets, words } = await import("./schema/word-sets");
  const { users } = await import("./schema/users");
  const { starterWordSets } = await import("../features/word-sets/data");

  /*Clear existing data to avoid duplicates*/
  await db.delete(wordSets);
  await db.delete(users);
  console.log("🧹 Old records cleared.");

  /*Seed Admin and Student users*/
  console.log("Adding seed users...");
  const defaultPasswordHash = await bcrypt.hash("password", 10);
  
  await db.insert(users).values([
    {
      name: "Student User",
      email: "student@example.com",
      passwordHash: defaultPasswordHash,
      role: "user",
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: defaultPasswordHash,
      role: "admin",
    },
  ]);

  /*Seed Word Sets*/
  for (const set of starterWordSets) {
    console.log(`Adding set: "${set.title}"...`);
    
    await db.insert(wordSets).values({
      id: set.id, 
      title: set.title,
      description: set.description
    });

    /*Prepare words for this set*/
    const wordsToInsert = set.words.map((w) => ({
      id: w.id,
      wordSetId: set.id,
      englishWord: w.englishWord,
      ukrainianTranslation: w.ukrainianTranslation,
      category: w.category,
      difficulty: w.difficulty,
      exampleSentence: w.exampleSentence,
    }));

    await db.insert(words).values(wordsToInsert);
  }

  console.log("✅ All users and word sets successfully added to the database!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ An error occurred while seeding the database:", err);
  process.exit(1);
});