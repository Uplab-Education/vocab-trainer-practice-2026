"use client";

import { useState } from "react";
import { type WordSet } from "@/features/word-sets/data";
import { generateOptions } from "@/features/word-sets/training";
import { Button } from "@/components/ui/button";
import { TrainingProgress } from "@/components/training/TrainingProgress";
import { TrainingSummary, type AnswerRecord } from "@/components/training/TrainingSummary";
import { AnswerButton, getAnswerState } from "@/components/training/AnswerButton";
import { checkAnswer } from "@/features/training/logic";

export function TrainingClient({ wordSet, initialOptions }: { wordSet: WordSet, initialOptions: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  //Track detailed answers instead of just a score number
  const [results, setResults] = useState<AnswerRecord[]>([]);
  
  const [options, setOptions] = useState<string[]>(initialOptions);

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
  };

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
      {/* Hidden aria-live region to announce correct/incorrect to screen readers */}
      <div aria-live="polite" className="sr-only">
        {selectedAnswer 
          ? (selectedAnswer === currentWord.ukrainianTranslation ? "Correct answer selected." : "Incorrect answer selected.") 
          : "Choose the correct translation."}
      </div>

      <TrainingProgress 
        title={wordSet.title} 
        current={currentIndex + 1} 
        total={wordSet.words.length} 
      />

      {/* Key word */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Select the correct translation</h3>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{currentWord.englishWord}</h1>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option) => (
          <AnswerButton
            key={option}
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