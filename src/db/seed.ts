import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  console.log("⏳ Starting transferring data to PostgreSQL...");
  // Dynamically import the database and schema modules to avoid issues with top-level await
  const { db } = await import("./index");
  const { wordSets, words } = await import("./schema/word-sets");
  const { starterWordSets } = await import("../features/word-sets/data");

  /*Clear existing data to avoid duplicates*/
  await db.delete(wordSets);
  console.log("🧹 Old records cleared.");

  for (const set of starterWordSets) {
    console.log(`Adding set: "${set.title}"...`);
    
    await db.insert(wordSets).values({
      id: set.id, 
      title: set.title,
      description: set.description
    });

    /*Prepare words for this set (excluding old fields)*/
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

  console.log("✅ All 4 word sets successfully added to the database with complete data!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ An error occurred while seeding the database:", err);
  process.exit(1);
});