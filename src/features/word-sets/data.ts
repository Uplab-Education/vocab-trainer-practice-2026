export type Difficulty = 'easy' | 'medium' | 'hard';

export type Word = {
  id: string;
  englishWord: string;
  ukrainianTranslation: string;
  exampleSentence: string;
  difficulty: Difficulty;
  category: string;
};

export type WordSet = {
  id: string;
  title: string;
  description: string;
  words: Word[];
};

export const starterWordSets: WordSet[] = [
  {
    id: 'set-1',
    title: 'Basic Greetings',
    description: 'Essential words for daily communication.',
    words: [
      {
        id: 'word-1-1',
        englishWord: 'Hello',
        ukrainianTranslation: 'Привіт',
        exampleSentence: 'Hello, how are you today?',
        difficulty: 'easy',
        category: 'Greetings'
      },
      {
        id: 'word-1-2',
        englishWord: 'Goodbye',
        ukrainianTranslation: 'До побачення',
        exampleSentence: 'Goodbye, see you tomorrow!',
        difficulty: 'easy',
        category: 'Greetings'
      },
      {
        id: 'word-1-3',
        englishWord: 'Please',
        ukrainianTranslation: 'Будь ласка',
        exampleSentence: 'Could you help me, please?',
        difficulty: 'easy',
        category: 'Politeness'
      },
      {
        id: 'word-1-4',
        englishWord: 'Sorry',
        ukrainianTranslation: 'Вибачте',
        exampleSentence: 'I am sorry for the delay.',
        difficulty: 'easy',
        category: 'Politeness'
      },
      {
        id: 'word-1-5',
        englishWord: 'Thank you',
        ukrainianTranslation: 'Дякую',
        exampleSentence: 'Thank you for your assistance.',
        difficulty: 'easy',
        category: 'Politeness'
      },
      {
        id: 'word-1-6',
        englishWord: 'Friend',
        ukrainianTranslation: 'Друг',
        exampleSentence: 'He is my best friend.',
        difficulty: 'easy',
        category: 'People'
      },
      {
        id: 'word-1-7',
        englishWord: 'Name',
        ukrainianTranslation: 'Ім\'я',
        exampleSentence: 'What is your name?',
        difficulty: 'easy',
        category: 'Personal Info'
      },
      {
        id: 'word-1-8',
        englishWord: 'Family',
        ukrainianTranslation: 'Сім\'я',
        exampleSentence: 'I have a large family.',
        difficulty: 'easy',
        category: 'People'
      }
    ]
  },
  {
    id: 'set-2',
    title: 'Travel & Transport',
    description: 'Vocabulary useful for traveling and navigation.',
    words: [
      {
        id: 'word-2-1',
        englishWord: 'Airport',
        ukrainianTranslation: 'Аеропорт',
        exampleSentence: 'We need to be at the airport early.',
        difficulty: 'medium',
        category: 'Transport'
      },
      {
        id: 'word-2-2',
        englishWord: 'Ticket',
        ukrainianTranslation: 'Квиток',
        exampleSentence: 'Can I see your train ticket?',
        difficulty: 'easy',
        category: 'Transport'
      },
      {
        id: 'word-2-3',
        englishWord: 'Hotel',
        ukrainianTranslation: 'Готель',
        exampleSentence: 'We booked a room in the city center hotel.',
        difficulty: 'easy',
        category: 'Accommodation'
      },
      {
        id: 'word-2-4',
        englishWord: 'Luggage',
        ukrainianTranslation: 'Багаж',
        exampleSentence: 'Do not leave your luggage unattended.',
        difficulty: 'medium',
        category: 'Travel Items'
      },
      {
        id: 'word-2-5',
        englishWord: 'Passport',
        ukrainianTranslation: 'Паспорт',
        exampleSentence: 'You must show your passport at the border.',
        difficulty: 'easy',
        category: 'Documents'
      },
      {
        id: 'word-2-6',
        englishWord: 'Station',
        ukrainianTranslation: 'Станція / Вокзал',
        exampleSentence: 'I will meet you at the railway station.',
        difficulty: 'easy',
        category: 'Places'
      },
      {
        id: 'word-2-7',
        englishWord: 'Flight',
        ukrainianTranslation: 'Рейс',
        exampleSentence: 'Our flight is delayed by an hour.',
        difficulty: 'medium',
        category: 'Transport'
      },
      {
        id: 'word-2-8',
        englishWord: 'Map',
        ukrainianTranslation: 'Карта',
        exampleSentence: 'Let me check the map to find the museum.',
        difficulty: 'easy',
        category: 'Navigation'
      }
    ]
  },
  {
    id: 'set-3',
    title: 'Food & Dining',
    description: 'Words for meals, ingredients, and eating out.',
    words: [
      {
        id: 'word-3-1',
        englishWord: 'Water',
        ukrainianTranslation: 'Вода',
        exampleSentence: 'Can I have a glass of water?',
        difficulty: 'easy',
        category: 'Drinks'
      },
      {
        id: 'word-3-2',
        englishWord: 'Menu',
        ukrainianTranslation: 'Меню',
        exampleSentence: 'Could you bring us the menu, please?',
        difficulty: 'easy',
        category: 'Restaurant'
      },
      {
        id: 'word-3-3',
        englishWord: 'Breakfast',
        ukrainianTranslation: 'Сніданок',
        exampleSentence: 'I usually have oatmeal for breakfast.',
        difficulty: 'easy',
        category: 'Meals'
      },
      {
        id: 'word-3-4',
        englishWord: 'Dinner',
        ukrainianTranslation: 'Вечеря',
        exampleSentence: 'What are we having for dinner tonight?',
        difficulty: 'easy',
        category: 'Meals'
      },
      {
        id: 'word-3-5',
        englishWord: 'Delicious',
        ukrainianTranslation: 'Смачний',
        exampleSentence: 'This soup is absolutely delicious.',
        difficulty: 'medium',
        category: 'Adjectives'
      },
      {
        id: 'word-3-6',
        englishWord: 'Restaurant',
        ukrainianTranslation: 'Ресторан',
        exampleSentence: 'They opened a new Italian restaurant nearby.',
        difficulty: 'easy',
        category: 'Places'
      },
      {
        id: 'word-3-7',
        englishWord: 'Toilet',
        ukrainianTranslation: 'Туалет',
        exampleSentence: 'Where is the nearest toilet?',
        difficulty: 'medium',
        category: 'Places'
      },
      {
        id: 'word-3-8',
        englishWord: 'Spicy',
        ukrainianTranslation: 'Гострий',
        exampleSentence: 'I do not like very spicy food.',
        difficulty: 'medium',
        category: 'Adjectives'
      }
    ]
  },
  {
    id: 'set-4',
    title: 'Technology & Devices',
    description: 'Modern vocabulary related to tech and the internet.',
    words: [
      {
        id: 'word-4-1',
        englishWord: 'Computer',
        ukrainianTranslation: 'Комп\'ютер',
        exampleSentence: 'I need a new computer for work.',
        difficulty: 'easy',
        category: 'Devices'
      },
      {
        id: 'word-4-2',
        englishWord: 'Screen',
        ukrainianTranslation: 'Екран',
        exampleSentence: 'The screen on my laptop is very bright.',
        difficulty: 'easy',
        category: 'Hardware'
      },
      {
        id: 'word-4-3',
        englishWord: 'Keyboard',
        ukrainianTranslation: 'Клавіатура',
        exampleSentence: 'I spilled coffee on my keyboard.',
        difficulty: 'medium',
        category: 'Hardware'
      },
      {
        id: 'word-4-4',
        englishWord: 'Password',
        ukrainianTranslation: 'Пароль',
        exampleSentence: 'Never share your password with anyone.',
        difficulty: 'medium',
        category: 'Security'
      },
      {
        id: 'word-4-5',
        englishWord: 'Network',
        ukrainianTranslation: 'Мережа',
        exampleSentence: 'The local network is currently down.',
        difficulty: 'medium',
        category: 'Infrastructure'
      },
      {
        id: 'word-4-6',
        englishWord: 'Developer',
        ukrainianTranslation: 'Розробник',
        exampleSentence: 'She works as a frontend developer.',
        difficulty: 'medium',
        category: 'Professions'
      },
      {
        id: 'word-4-7',
        englishWord: 'Database',
        ukrainianTranslation: 'База даних',
        exampleSentence: 'All records are securely stored in the database.',
        difficulty: 'hard',
        category: 'System'
      },
      {
        id: 'word-4-8',
        englishWord: 'Software',
        ukrainianTranslation: 'Програмне забезпечення',
        exampleSentence: 'You should keep your software updated.',
        difficulty: 'medium',
        category: 'System'
      }
    ]
  }
];