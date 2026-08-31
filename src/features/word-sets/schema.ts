import { z } from "zod";

/*Validator for a single word*/
export const wordSchema = z.object({
  englishWord: z.string().min(1, "English word is required").max(100),
  ukrainianTranslation: z.string().min(1, "Ukrainian translation is required").max(100),
});

/*Validator for creating a completely new word set*/
export const createWordSetSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  words: z.array(wordSchema).min(4, "A word set must contain at least 4 words"),
});

export type CreateWordSetInput = z.infer<typeof createWordSetSchema>;
export type WordInput = z.infer<typeof wordSchema>;