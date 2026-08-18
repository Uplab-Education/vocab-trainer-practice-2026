import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/*Table for Word Sets*/
export const wordSets = pgTable("word_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/*Table for Words*/
export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordSetId: uuid("word_set_id")
    .references(() => wordSets.id, { onDelete: "cascade" })
    .notNull(),
  englishWord: text("english_word").notNull(),
  ukrainianTranslation: text("ukrainian_translation").notNull(),
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
