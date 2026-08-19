import { config } from "dotenv";
config({ path: ".env.local" });

async function reset() {
  console.log("Deleting tables with foreign key constraints...");
  
  const { db } = await import("./index");
  const { sql } = await import("drizzle-orm");

  /*Table deletion order matters due to foreign key constraints. Drop the "words" table first, then the "word_sets" table.*/
  await db.execute(sql`DROP TABLE IF EXISTS words CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS word_sets CASCADE`);

  console.log("✅ Tables deleted successfully!");
  process.exit(0);
}

reset().catch((err) => {
  console.error("❌ Error occurred while deleting tables:", err);
  process.exit(1);
});