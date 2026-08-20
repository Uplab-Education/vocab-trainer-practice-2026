export type DBTrainingWord = {
  id: string;
  englishWord: string;
  ukrainianTranslation: string;
  category?: string | null;
  difficulty?: string | null;
  exampleSentence?: string | null;
};

export type DBTrainingSet = {
  id: string;
  title: string;
  description?: string | null;
  words: DBTrainingWord[];
};

// Fisher-Yates shuffle implementation for unbiased randomness
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to generate options uses the new TrainingWord type
export const generateOptions = (currentWord: DBTrainingWord, allWords: DBTrainingWord[]) => {
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