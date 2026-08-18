import { db } from "@/db";
import { wordSets, words } from "@/db/schema/word-sets";
import { eq } from "drizzle-orm";
import { type CreateWordSetInput, createWordSetSchema } from "./schema";

/*Fetch all word sets (without words, just headers for lists)*/
export async function getAllWordSets() {
  return await db.query.wordSets.findMany({
    with: {
      words: true,
    },
    orderBy: (sets, { desc }) => [desc(sets.createdAt)],
  });
}

/*Fetch a specific word set by ID (including all its words)*/
export async function getWordSetById(id: string) {
  const result = await db.query.wordSets.findFirst({
    where: eq(wordSets.id, id),
    with: {
      words: true,
    },
  });
  
  return result || null;
}

/*Create a new word set with its words(Transactional & Validated)*/
export async function createWordSet(input: CreateWordSetInput) {
  const validatedData = createWordSetSchema.parse(input);

  /*If saving words fails, the whole set is rolled back*/
  return await db.transaction(async (tx) => {
    const [newSet] = await tx
      .insert(wordSets)
      .values({ title: validatedData.title })
      .returning();

    /*Prepare the words arrays with the new Set ID*/
    const wordsToInsert = validatedData.words.map((word) => ({
      wordSetId: newSet.id,
      englishWord: word.englishWord,
      ukrainianTranslation: word.ukrainianTranslation,
    }));

    /*Insert all words in bulk*/
    await tx.insert(words).values(wordsToInsert);

    return newSet;
  });
}