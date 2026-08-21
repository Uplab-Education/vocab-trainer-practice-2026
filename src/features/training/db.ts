import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions, trainingAnswers } from "@/db/schema/progress";
import { wordSets, words } from "@/db/schema/word-sets";

/*Start or resume a training session for a specific user and word set*/
export async function startOrResumeSession(userId: string, wordSetId: string) {
  /*Search for an active session for this word set*/
  const [existingSession] = await db
    .select()
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.userId, userId),
        eq(trainingSessions.wordSetId, wordSetId),
        eq(trainingSessions.status, "in_progress")
      )
    )
    .limit(1);

  if (existingSession) {
    return existingSession;
  }

  /*If no active session exists, create a new one*/
  const [newSession] = await db
    .insert(trainingSessions)
    .values({
      userId,
      wordSetId,
      status: "in_progress",
      currentIndex: 0,
    })
    .returning();

  return newSession;
}

/*Save the user's answer and update the card index*/
export async function saveAnswerAndUpdateProgress(
  sessionId: string,
  wordId: string,
  isCorrect: boolean,
  nextIndex: number
) {
  /*Save the user's answer for the current word*/
  await db.insert(trainingAnswers).values({
    sessionId,
    wordId,
    isCorrect,
  });

  /*Update the progress in the training session (currentIndex)*/
  await db
    .update(trainingSessions)
    .set({ 
      currentIndex: nextIndex,
      updatedAt: new Date() 
    })
    .where(eq(trainingSessions.id, sessionId));
}

/*End a training session (mark it as completed)*/
export async function completeSession(sessionId: string) {
  await db
    .update(trainingSessions)
    .set({ 
      status: "completed",
      updatedAt: new Date() 
    })
    .where(eq(trainingSessions.id, sessionId));
}

/*Fetch all active sessions for a user directly from DB(PostgreSQL)*/
export async function getActiveSessionsForUser(userId: string) {
  const active = await db
    .select({
      id: wordSets.id,
      title: wordSets.title,
      currentIndex: trainingSessions.currentIndex,
    })
    .from(trainingSessions)
    .innerJoin(wordSets, eq(trainingSessions.wordSetId, wordSets.id))
    .where(
      and(
        eq(trainingSessions.userId, userId),
        eq(trainingSessions.status, "in_progress")
      )
    );

  /*Fetch total words for each active session*/
  const sessionsWithTotals = await Promise.all(
    active.map(async (session) => {
      const setWords = await db.select().from(words).where(eq(words.wordSetId, session.id));
      return {
        ...session,
        totalWords: setWords.length > 0 ? setWords.length : 1
      };
    })
  );

  return sessionsWithTotals;
}

/*Reset an active session to the beginning and clear previous answers*/
export async function resetSessionProgress(sessionId: string) {
  /*Delete previous answers for this specific session so stats don't duplicate*/
  await db.delete(trainingAnswers).where(eq(trainingAnswers.sessionId, sessionId));

  /*Reset the current index back to 0*/
  await db
    .update(trainingSessions)
    .set({ 
      currentIndex: 0,
      updatedAt: new Date() 
    })
    .where(eq(trainingSessions.id, sessionId));
}