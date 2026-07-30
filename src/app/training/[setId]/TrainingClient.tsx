"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Word = {
  id: string;
  englishWord: string;
  ukrainianTranslation: string;
};

type WordSet = {
  id: string;
  title: string;
  words: Word[];
};

// Helper function to generate options (moved outside so it doesn't get recreated on every render)
const generateOptions = (currentWord: Word, allWords: Word[]) => {
  if (!currentWord) return [];
  // Take all words except the current one
  const otherWords = allWords.filter((w) => w.id !== currentWord.id);
  // Shuffle the other words to get random incorrect options
  const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
  // Take the first 3 as incorrect options
  const incorrectOptions = shuffledOthers.slice(0, 3).map((w) => w.ukrainianTranslation);
  
  // Add the correct translation and shuffle again
  const allOptions = [...incorrectOptions, currentWord.ukrainianTranslation];
  return allOptions.sort(() => 0.5 - Math.random());
};

export function TrainingClient({ wordSet }: { wordSet: WordSet }) {
  const [isMounted, setIsMounted] = useState(false); // Added for hydration safety
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Generate initial options lazily inside useState
  const [options, setOptions] = useState<string[]>(() => {
    if (wordSet.words.length > 0) {
      return generateOptions(wordSet.words[0], wordSet.words);
    }
    return [];
  });

  /* Only run ONCE when the component mounts on the client to prevent SSR hydration mismatches */
  useEffect(() => {
    // Wrap setIsMounted in a setTimeout to make the state update asynchronous
    /* This resolves the strict linter error about "synchronous setState inside an effect"
    while keeping the SSR hydration safety completely intact. */
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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
  if (!isMounted) {
    return null; 
  }

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
          className="inline-flex justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
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
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>{wordSet.title}</span>
          <span>{currentIndex + 1} / {wordSet.words.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Key word */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Select the correct translation</h3>
        <p className="text-4xl sm:text-5xl font-bold text-slate-900">{currentWord.englishWord}</p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentWord.ukrainianTranslation;
          
          let buttonStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300";
          
          if (selectedAnswer) {
            if (isCorrect) {
              buttonStyle = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
            } else if (isSelected) {
              buttonStyle = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
            } else {
              buttonStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`px-6 py-4 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* "Next" button (appears only after selection) */}
      <div className="h-12">
        {selectedAnswer && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={handleNext}
              className="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              {currentIndex < wordSet.words.length - 1 ? "Next Word" : "Finish Training"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}