"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
  createWordSet as repoCreateWordSet, 
  updateWordSet as repoUpdateWordSet, 
  deleteWordSetById 
} from "@/features/word-sets/repository";

export async function deleteWordSet(id: string) {
  await deleteWordSetById(id);
  
  revalidatePath("/admin");
  revalidatePath("/word-sets");
}

export async function createWordSet(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;
  const wordsJson = formData.get("words") as string;

  let wordsList = [];
  if (wordsJson) {
    try {
      wordsList = JSON.parse(wordsJson);
    } catch (error) {
      console.error("Failed to parse words JSON:", error);
      throw new Error("Invalid format for words data.");
    }
  }

  /*Pass the logic to the Data Access Layer (repository)*/
  await repoCreateWordSet({
    title,
    description,
    category,
    difficulty,
    words: wordsList
  });

  revalidatePath("/admin");
  revalidatePath("/word-sets");
  redirect("/admin");
}

export async function updateWordSet(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;
  const wordsJson = formData.get("words") as string;

  let wordsList = [];
  if (wordsJson) {
    try {
      wordsList = JSON.parse(wordsJson);
    } catch (error) {
      console.error("Failed to parse words JSON:", error);
      throw new Error("Invalid format for words data.");
    }
  }

  /*Pass the logic to the Data Access Layer (repository)*/
  await repoUpdateWordSet(id, {
    title,
    description,
    category,
    difficulty,
    words: wordsList
  });

  revalidatePath("/admin");
  revalidatePath("/word-sets");
  revalidatePath(`/word-sets/${id}`);
  redirect("/admin");
}