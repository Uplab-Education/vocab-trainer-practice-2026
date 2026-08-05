"use client";

import { useState } from "react";
import Link from "next/link";
import { type Word, type WordSet } from "@/features/word-sets/data";

// Fisher-Yates shuffle implementation for unbiased randomness
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to generate options (moved outside so it doesn't get recreated on every render)
const generateOptions = (currentWord: Word, allWords: Word[]) => {
  if (!currentWord) return [];
  // Take all words except the current one
  const otherWords = allWords.filter((w) => w.id !== currentWord.id);
  // Shuffle the other words to get random incorrect options
  const shuffledOthers = shuffleArray(otherWords);
  // Take the first 3 as incorrect options
  const incorrectOptions = shuffledOthers.slice(0, 3).map((w) => w.ukrainianTranslation);
  
  // Add the correct translation and shuffle again
  const allOptions = [...incorrectOptions, currentWord.ukrainianTranslation];
  return shuffleArray(allOptions);
};

export function TrainingClient({ wordSet, initialOptions }: { wordSet: WordSet, initialOptions: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Generate initial options lazily inside useState
  const [options, setOptions] = useState<string[]>(initialOptions);

  /* Only run ONCE when the component mounts on the client to prevent SSR hydration mismatches */
  // Wrap setIsMounted in a setTimeout to make the state update asynchronous
  /* This resolves the strict linter error about "synchronous setState inside an effect"
  while keeping the SSR hydration safety completely intact. */

  const currentWord = wordSet.words[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    if (answer === currentWord.ukrainianTranslation) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < wordSet.words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      
      // Generate new options synchronously in the event handler
      setOptions(generateOptions(wordSet.words[nextIndex], wordSet.words));
    } else {
      setIsFinished(true); // Clean processing of the last question
    }
  };

  // Wait until client has mounted to render (To completely avoids the hydration)

  // Training completion screen
  if (isFinished) {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Training Complete!</h2>
        <p className="text-lg text-slate-600 mb-8">
          You scored <span className="font-bold text-slate-900">{score}</span> out of {wordSet.words.length}.
        </p>
        <Link
          href={`/word-sets/${wordSet.id}`}
          className="inline-flex justify-center rounded-md bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Back to Word Set
        </Link>
      </div>
    );
  }

  // Calculating progress for a scale
  const progress = ((currentIndex + 1) / wordSet.words.length) * 100;

  return (
    <div className="mx-auto max-w-2xl py-8 px-4 w-full">
      {/* Hidden aria-live region to announce correct/incorrect to screen readers */}
      <div aria-live="polite" className="sr-only">
        {selectedAnswer 
          ? (selectedAnswer === currentWord.ukrainianTranslation ? "Correct answer selected." : "Incorrect answer selected.") 
          : "Choose the correct translation."}
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>{wordSet.title}</span>
          <span>{currentIndex + 1} / {wordSet.words.length}</span>
        </div>
        <div 
          className="w-full bg-slate-200 rounded-full h-2"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Training progress"
        >
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Key word */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Select the correct translation</h3>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{currentWord.englishWord}</h1>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentWord.ukrainianTranslation;
          
          let buttonStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300";
          let icon = null;
          
          if (selectedAnswer) {
            if (isCorrect) {
              buttonStyle = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
              icon = (
                <svg className="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              );
            } else if (isSelected) {
              buttonStyle = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
              icon = (
                <svg className="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              );
            } else {
              buttonStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              aria-pressed={isSelected}
              className={`flex items-center justify-center px-6 py-4 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
            >
              <span>{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* "Next" button (appears only after selection) */}
      <div className="h-12">
        {selectedAnswer && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="rounded-md bg-slate-950 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              {currentIndex < wordSet.words.length - 1 ? "Next Word" : "Finish Training"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}