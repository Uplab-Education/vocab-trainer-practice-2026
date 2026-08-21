import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions, trainingAnswers } from "@/db/schema/progress";
import { wordSets } from "@/db/schema/word-sets";

export async function getDashboardStats(userId: string) {
  /*Fetch all answers for the user to calculate accuracy, learned words, and needs review*/
  const userAnswers = await db
    .select({
      wordId: trainingAnswers.wordId,
      isCorrect: trainingAnswers.isCorrect,
      createdAt: trainingAnswers.createdAt,
    })
    .from(trainingAnswers)
    .innerJoin(trainingSessions, eq(trainingAnswers.sessionId, trainingSessions.id))
    .where(eq(trainingSessions.userId, userId));

  /*Accuracy: Calculate the percentage of correct answers*/
  const totalAnswers = userAnswers.length;
  const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  /*Learned Words and Needs Review: Count unique words based on correctness*/
  const uniqueLearnedWords = new Set(userAnswers.filter((a) => a.isCorrect).map((a) => a.wordId)).size;
  const uniqueNeedsReview = new Set(userAnswers.filter((a) => !a.isCorrect).map((a) => a.wordId)).size;

  /*Daily Practice Count: Count how many words the user has practiced today (based on the createdAt timestamp of their answers)*/
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Скидаємо час до початку дня
  const wordsPracticedToday = userAnswers.filter((a) => new Date(a.createdAt) >= today).length;

  /*Count active sessions (in_progress) for the user to determine how many sets are currently being trained on*/
  const activeSessions = await db
    .select({ wordSetId: trainingSessions.wordSetId })
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.userId, userId),
        eq(trainingSessions.status, "in_progress")
      )
    );
  /*To not count duplicates and only count unique active sets*/
  const activeSets = new Set(activeSessions.map((s) => s.wordSetId)).size;

  /*Get recent sessions (last 5) with their scores*/
  const recentSessionsData = await db
    .select({
      id: trainingSessions.id,
      date: trainingSessions.updatedAt,
      wordSetTitle: wordSets.title,
    })
    .from(trainingSessions)
    .innerJoin(wordSets, eq(trainingSessions.wordSetId, wordSets.id))
    .where(eq(trainingSessions.userId, userId))
    .orderBy(desc(trainingSessions.updatedAt))
    .limit(5);

  /*Calculate score for each recent session (correct/total)*/
  const recentSessions = await Promise.all(
    recentSessionsData.map(async (session) => {
      const sessionAnswers = await db
        .select()
        .from(trainingAnswers)
        .where(eq(trainingAnswers.sessionId, session.id));

      const correct = sessionAnswers.filter((a) => a.isCorrect).length;
      const total = sessionAnswers.length;

      return {
        id: session.id,
        date: session.date,
        wordSetTitle: session.wordSetTitle,
        score: `${correct}/${total}`,
      };
    })
  );

  return {
    learnedWords: uniqueLearnedWords,
    accuracy,
    wordsPracticedToday,
    activeSets,
    needsReview: uniqueNeedsReview,
    recentSessions,
  };
}