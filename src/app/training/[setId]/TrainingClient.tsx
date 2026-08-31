"use client";

import { useState, useEffect } from "react";
import { generateOptions, type DBTrainingSet } from "@/features/word-sets/training";
import { Button } from "@/components/ui/button";
import { TrainingProgress } from "@/components/training/TrainingProgress";
import { TrainingSummary, type AnswerRecord } from "@/components/training/TrainingSummary";
import { AnswerButton, getAnswerState } from "@/components/training/AnswerButton";
import { checkAnswer } from "@/features/training/logic";
import { initializeSessionAction, saveAnswerAction, completeSessionAction, resetSessionAction } from "@/features/training/actions";

export function TrainingClient({ wordSet, initialOptions }: { wordSet: DBTrainingSet, initialOptions: string[] }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<AnswerRecord[]>([]);
  const [options, setOptions] = useState<string[]>(initialOptions);
  
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /*Retrieve or create session from Database on mount*/
  useEffect(() => {
    async function loadSession() {
      try {
        const session = await initializeSessionAction(wordSet.id);
        setSessionId(session.id);

        if (session.status === "completed") {
          setIsFinished(true);
        } else if (session.currentIndex > 0 && session.currentIndex < wordSet.words.length) {
          setCurrentIndex(session.currentIndex);
          /*Generate new options for the current word*/
          setOptions(generateOptions(wordSet.words[session.currentIndex], wordSet.words));
        }
      } catch (error) {
        console.error("Failed to initialize training session:", error);
      } finally {
        setIsMounted(true);
        setIsLoading(false);
      }
    }

    loadSession();
  }, [wordSet]);

  const currentWord = wordSet.words[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; 
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer || !sessionId) return;
    
    const isCorrect = checkAnswer(selectedAnswer, currentWord.ukrainianTranslation);
    setResults((prev) => [
      ...prev,
      { word: currentWord, selected: selectedAnswer, isCorrect }
    ]);

    const isLastWord = currentIndex >= wordSet.words.length - 1;
    const nextIndex = isLastWord ? currentIndex : currentIndex + 1;

    /*Save the answer to the database and update the session's current index*/
    await saveAnswerAction(sessionId, currentWord.id, isCorrect, nextIndex);

    if (!isLastWord) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setOptions(generateOptions(wordSet.words[nextIndex], wordSet.words));
    } else {
      /*If it's the last word, mark the session as completed in the database*/
      await completeSessionAction(sessionId);
      setIsFinished(true); 
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      if (sessionId) {
        /*Reset the session in the database and start over*/
        await resetSessionAction(sessionId);
      } else {
        const session = await initializeSessionAction(wordSet.id);
        setSessionId(session.id);
      }
      
      /*Reset local state for a fresh start*/
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setResults([]);
      setIsFinished(false);
      setOptions(generateOptions(wordSet.words[0], wordSet.words));
    } catch (error) {
      console.error("Failed to restart session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-24">
        <p className="text-slate-500">Loading your training session...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <TrainingSummary 
        results={results} 
        total={wordSet.words.length} 
        wordSetId={wordSet.id} 
        onRetry={handleRetry} 
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 px-4 w-full">
      {/*Hidden aria-live region to announce correct/incorrect to screen readers*/}
      <div aria-live="polite" className="sr-only">
        {selectedAnswer 
          ? (checkAnswer(selectedAnswer, currentWord.ukrainianTranslation) ? "Correct answer selected." : "Incorrect answer selected.") 
          : "Choose the correct translation."}
      </div>

      {/*Button "Restart Training"*/}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">Active Session</span>
        <button 
          onClick={handleRetry} 
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          title="Restart session from the beginning"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Restart Training
        </button>
      </div>

      <TrainingProgress 
        title={wordSet.title} 
        current={currentIndex + 1} 
        total={wordSet.words.length} 
      />

      {/*Key word*/}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Select the correct translation</h3>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{currentWord.englishWord}</h1>
      </div>

      {/*Answer options*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option, index) => (
          <AnswerButton
            key={`${option}-${index}`}
            option={option}
            state={getAnswerState(option, selectedAnswer, currentWord.ukrainianTranslation)}
            onSelect={handleAnswer}
          />
        ))}
      </div>

      {/* "Next" button (appears only after selection)*/}
      <div className="h-12">
        {selectedAnswer && (
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex < wordSet.words.length - 1 ? "Next Word" : "Finish Training"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}