import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/*Table for Word Sets*/
export const wordSets = pgTable("word_sets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*Table for Words*/
export const words = pgTable("words", {
  id: text("id").primaryKey(),
  wordSetId: text("word_set_id")
    .references(() => wordSets.id, { onDelete: "cascade" })
    .notNull(),
  englishWord: text("english_word").notNull(),
  ukrainianTranslation: text("ukrainian_translation").notNull(),
  category: text("category"),
  difficulty: text("difficulty"),
  exampleSentence: text("example_sentence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*Define Relations (for easy querying later)*/
export const wordSetsRelations = relations(wordSets, ({ many }) => ({
  words: many(words),
}));

export const wordsRelations = relations(words, ({ one }) => ({
  wordSet: one(wordSets, {
    fields: [words.wordSetId],
    references: [wordSets.id],
  }),
}));
