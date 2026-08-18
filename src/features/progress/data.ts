export type RecentSession = {
  id: string;
  date: string;
  setName: string;
  score: string;
};

export type ProgressStats = {
  learnedWords: number;
  accuracy: number;
  dailyGoal: {
    current: number;
    target: number;
  };
  activeSets: number;
  hardWords: number;
  recentSessions: RecentSession[];
};

// Starter progress data to simulate an active user
export const starterProgressData: ProgressStats = {
  learnedWords: 142,
  accuracy: 85,
  dailyGoal: {
    current: 12,
    target: 20,
  },
  activeSets: 3,
  hardWords: 18,
  recentSessions: [
    { id: "1", date: "Today", setName: "Travel & Transport", score: "18/20" },
    { id: "2", date: "Yesterday", setName: "Basic Greetings", score: "10/10" },
    { id: "3", date: "3 days ago", setName: "Food & Dining", score: "12/15" },
  ],
};

// Empty state data to test the zero-progress scenario
export const emptyProgressData: ProgressStats = {
  learnedWords: 0,
  accuracy: 0,
  dailyGoal: {
    current: 0,
    target: 20,
  },
  activeSets: 0,
  hardWords: 0,
  recentSessions: [],
};