"use server";

import { db } from "@/db";
import { wordSets, words } from "@/db/schema/word-sets";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ParsedWord = {
  englishWord: string;
  ukrainianTranslation: string;
  exampleSentence?: string;
};

/*For deleting a word set and its associated words (cascade delete)*/
export async function deleteWordSet(id: string) {
  await db.delete(wordSets).where(eq(wordSets.id, id));
  
  revalidatePath("/admin");
  revalidatePath("/word-sets");
}

/*For creating a brand new word set*/
export async function createWordSet(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;
  const wordsJson = formData.get("words") as string;

  /*Automatically generate a nice ID from the title(e.g., "My New Set"->"my-new-set")*/
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  /*Use a transaction to ensure that the word set and its words are created together*/
  await db.transaction(async (tx) => {
    /*Insert the new word set into the database*/
    await tx.insert(wordSets).values({
      id,
      title,
      description,
    });

    /*Add words if provided (expecting a JSON string of words)*/
    if (wordsJson) {
      const wordsList: ParsedWord[] = JSON.parse(wordsJson);
      if (wordsList.length > 0) {
        const wordsToInsert = wordsList.map((w, index) => ({
          /*Generate a simple and readable ID for each word*/
          id: `word-${id}-${index + 1}`,
          wordSetId: id,
          englishWord: w.englishWord,
          ukrainianTranslation: w.ukrainianTranslation,
          exampleSentence: w.exampleSentence || "",
          category: category,
          difficulty: difficulty,
        }));
        await tx.insert(words).values(wordsToInsert);
      }
    }
  });

  revalidatePath("/admin");
  revalidatePath("/word-sets");
  redirect("/admin");
}

/*For updating a word set's title, description, and its words*/
export async function updateWordSet(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;
  const wordsJson = formData.get("words") as string;

  /*Use a transaction to ensure data integrity when updating the word set and its words*/
  await db.transaction(async (tx) => {
    /*Update the word set's title and description*/
    await tx.update(wordSets).set({
      title,
      description,
    }).where(eq(wordSets.id, id));

    // Update the words: for simplicity, deleting old words and inserting new ones
    if (wordsJson) {
      const wordsList: ParsedWord[] = JSON.parse(wordsJson);

      await tx.delete(words).where(eq(words.wordSetId, id));

      if (wordsList.length > 0) {
        const wordsToInsert = wordsList.map((w, index) => ({
          /*Generate a simple and readable ID for each word*/
          id: `word-${id}-${index + 1}`,
          wordSetId: id,
          englishWord: w.englishWord,
          ukrainianTranslation: w.ukrainianTranslation,
          exampleSentence: w.exampleSentence || "",
          category: category,
          difficulty: difficulty,
        }));
        await tx.insert(words).values(wordsToInsert);
      }
    }
  });

  revalidatePath("/admin");
  revalidatePath("/word-sets");
  revalidatePath(`/word-sets/${id}`);
  redirect("/admin");
}