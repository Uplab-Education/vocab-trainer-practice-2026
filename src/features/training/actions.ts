"use server";

import { getCurrentUser } from "@/auth/session";
import * as trainingDb from "./db";

export async function initializeSessionAction(wordSetId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be logged in to train.");
  }

  const session = await trainingDb.startOrResumeSession(user.id, wordSetId);
  return session;
}

export async function saveAnswerAction(
  sessionId: string,
  wordId: string,
  isCorrect: boolean,
  nextIndex: number
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await trainingDb.saveAnswerAndUpdateProgress(sessionId, wordId, isCorrect, nextIndex);
  return { success: true };
}

export async function completeSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await trainingDb.completeSession(sessionId);
  return { success: true };
}

export async function resetSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await trainingDb.resetSessionProgress(sessionId);
  return { success: true };
}