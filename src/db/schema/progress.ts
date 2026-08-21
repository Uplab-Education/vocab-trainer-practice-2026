import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { wordSets } from "./word-sets";

/*Table for storing active and completed training sessions*/
export const trainingSessions = pgTable("training_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  wordSetId: text("word_set_id")
    .references(() => wordSets.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status", { enum: ["in_progress", "completed"] }).default("in_progress").notNull(),
  currentIndex: integer("current_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*Table for storing answers to training sessions (correct/incorrect)*/
export const trainingAnswers = pgTable("training_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => trainingSessions.id, { onDelete: "cascade" })
    .notNull(),
  wordId: text("word_id").notNull(), 
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});