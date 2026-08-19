import { db } from "@/db";
import { wordSets, words } from "@/db/schema/word-sets";
import { eq } from "drizzle-orm";

export type AdminWordSetPayload = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  words: {
    englishWord: string;
    ukrainianTranslation: string;
    exampleSentence?: string;
  }[];
};

/*Fetch all word sets (including all associated words)*/
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

/*Delete a word set and its associated words (cascade delete)*/
export async function deleteWordSetById(id: string) {
  await db.delete(wordSets).where(eq(wordSets.id, id));
}

/*Create a new word set with its words (Transactional)*/
export async function createWordSet(data: AdminWordSetPayload) {
  // Generate a clean ID from the title (e.g., "My Set" -> "my-set")
  const setId = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return await db.transaction(async (tx) => {
    const [newSet] = await tx
      .insert(wordSets)
      .values({ 
        id: setId,
        title: data.title,
        description: data.description
      })
      .returning();

    if (data.words && data.words.length > 0) {
      const wordsToInsert = data.words.map((word, index) => ({
        id: `word-${setId}-${index + 1}`,
        wordSetId: newSet.id,
        englishWord: word.englishWord,
        ukrainianTranslation: word.ukrainianTranslation,
        exampleSentence: word.exampleSentence || "",
        category: data.category,
        difficulty: data.difficulty,
      }));

      await tx.insert(words).values(wordsToInsert);
    }

    return newSet;
  });
}

/*Update an existing word set and replace its words (Transactional)*/
export async function updateWordSet(id: string, data: AdminWordSetPayload) {
  return await db.transaction(async (tx) => {
    /*Update the word set's title and description*/
    await tx.update(wordSets).set({
      title: data.title,
      description: data.description,
    }).where(eq(wordSets.id, id));

    if (data.words && data.words.length > 0) {
      /*Delete existing words for this word set before inserting new ones*/
      await tx.delete(words).where(eq(words.wordSetId, id));

      /*Insert the new words for this word set*/
      const wordsToInsert = data.words.map((w, index) => ({
        id: `word-${id}-${index + 1}`,
        wordSetId: id,
        englishWord: w.englishWord,
        ukrainianTranslation: w.ukrainianTranslation,
        exampleSentence: w.exampleSentence || "",
        category: data.category,
        difficulty: data.difficulty,
      }));

      await tx.insert(words).values(wordsToInsert);
    }
  });
}