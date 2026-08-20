"use client";

import { useState, useEffect } from "react";
import { generateOptions, type DBTrainingSet } from "@/features/word-sets/training";
import { Button } from "@/components/ui/button";
import { TrainingProgress } from "@/components/training/TrainingProgress";
import { TrainingSummary, type AnswerRecord } from "@/components/training/TrainingSummary";
import { AnswerButton, getAnswerState } from "@/components/training/AnswerButton";
import { checkAnswer } from "@/features/training/logic";

export function TrainingClient({ wordSet, initialOptions }: { wordSet: DBTrainingSet, initialOptions: string[] }) {
  const STORAGE_KEY = `vocab_training_session_${wordSet.id}`;
/*Initialize basic state variables for the training session*/
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<AnswerRecord[]>([]);
  const [options, setOptions] = useState<string[]>(initialOptions);
  
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  /*Retrieve saved session from localStorage on mount*/
  useEffect(() => {
    /*Zero-delay timeout to ensure this runs after the initial render*/
    const timer = setTimeout(() => {
      try {
        const savedSession = localStorage.getItem(STORAGE_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setCurrentIndex(parsed.currentIndex);
          setSelectedAnswer(parsed.selectedAnswer);
          setResults(parsed.results);
          setOptions(parsed.options);
        }
      } catch (error) {
        console.error("Failed to parse training session:", error);
      } finally {
        setIsMounted(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [STORAGE_KEY]);

  /*Save session to localStorage whenever relevant state changes*/
  useEffect(() => {
    if (!isMounted) return;

    if (isFinished) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const sessionData = {
        currentIndex,
        selectedAnswer,
        results,
        options,
        title: wordSet.title,
        totalWords: wordSet.words.length,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    }
  }, [isMounted, isFinished, currentIndex, selectedAnswer, results, options, STORAGE_KEY, wordSet]);

  const currentWord = wordSet.words[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; 
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    const isCorrect = checkAnswer(selectedAnswer, currentWord.ukrainianTranslation);
    setResults((prev) => [
      ...prev,
      { word: currentWord, selected: selectedAnswer, isCorrect }
    ]);

    if (currentIndex < wordSet.words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setOptions(generateOptions(wordSet.words[nextIndex], wordSet.words));
    } else {
      setIsFinished(true); 
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResults([]);
    setIsFinished(false);
    setOptions(generateOptions(wordSet.words[0], wordSet.words));
    localStorage.removeItem(STORAGE_KEY);
  };

  // Prevent hydration errors by not rendering the interactive part on the server
  if (!isMounted) {
    return null;
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

      {/* "Next" button(appears only after selection)*/}
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