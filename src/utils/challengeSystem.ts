/**
 * Challenge System
 * Manages coding challenges, quizzes, and learning content
 */

export interface Challenge {
  id: string;
  skillId: string;
  type: 'code' | 'quiz' | 'game';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  completed: boolean;
}

export interface CodeChallenge extends Challenge {
  type: 'code';
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: { input: string; expected: string }[];
}

export interface QuizChallenge extends Challenge {
  type: 'quiz';
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface GameChallenge extends Challenge {
  type: 'game';
  gameType: 'debugger' | 'builder' | 'asteroids';
}

const STORAGE_KEY = 'skillverse_challenges';

// Sample challenges for each skill
export const challengeData: (CodeChallenge | QuizChallenge | GameChallenge)[] = [
  // HTML Challenges
  {
    id: 'html-1',
    skillId: 'html',
    type: 'code',
    title: 'Create Your First HTML Page',
    description: 'Build a simple HTML page with a title and paragraph',
    difficulty: 'beginner',
    xpReward: 50,
    completed: false,
    starterCode: '<!-- Write your HTML here -->\n',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>This is my first page!</p>\n</body>\n</html>',
    hints: [
      'Start with <!DOCTYPE html>',
      'Use <html>, <head>, and <body> tags',
      'Add a <title> inside <head>',
      'Use <h1> for heading and <p> for paragraph'
    ],
    testCases: [
      { input: 'structure', expected: 'html,head,body' },
      { input: 'elements', expected: 'title,h1,p' }
    ]
  },
  {
    id: 'html-quiz-1',
    skillId: 'html',
    type: 'quiz',
    title: 'HTML Basics Quiz',
    description: 'Test your HTML knowledge',
    difficulty: 'beginner',
    xpReward: 30,
    completed: false,
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language - it\'s the standard markup language for web pages.'
      },
      {
        question: 'Which tag is used for the largest heading?',
        options: ['<heading>', '<h6>', '<head>', '<h1>'],
        correctAnswer: 3,
        explanation: '<h1> creates the largest heading, while <h6> creates the smallest.'
      }
    ]
  },
  // CSS Challenges
  {
    id: 'css-1',
    skillId: 'css',
    type: 'code',
    title: 'Center a Div',
    description: 'Use CSS to center a div element on the page',
    difficulty: 'beginner',
    xpReward: 50,
    completed: false,
    starterCode: '.container {\n  /* Add your CSS here */\n}\n',
    solution: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}',
    hints: [
      'Use flexbox for easy centering',
      'Set display to flex',
      'Use justify-content and align-items',
      'Set height to 100vh for full viewport'
    ],
    testCases: [
      { input: 'display', expected: 'flex' },
      { input: 'centering', expected: 'center,center' }
    ]
  },
  {
    id: 'css-game-1',
    skillId: 'css',
    type: 'game',
    title: 'Galaxy Builder',
    description: 'Position planets using CSS grid and flexbox',
    difficulty: 'intermediate',
    xpReward: 100,
    completed: false,
    gameType: 'builder'
  },
  // JavaScript Challenges
  {
    id: 'js-1',
    skillId: 'javascript',
    type: 'code',
    title: 'Create a Function',
    description: 'Write a function that adds two numbers',
    difficulty: 'beginner',
    xpReward: 50,
    completed: false,
    starterCode: 'function add(a, b) {\n  // Write your code here\n}\n',
    solution: 'function add(a, b) {\n  return a + b;\n}',
    hints: [
      'Use the return keyword',
      'Add the two parameters together',
      'Parameters are a and b'
    ],
    testCases: [
      { input: 'add(2, 3)', expected: '5' },
      { input: 'add(10, 20)', expected: '30' }
    ]
  },
  {
    id: 'js-game-1',
    skillId: 'javascript',
    type: 'game',
    title: 'Planet Debugger',
    description: 'Fix broken code snippets to repair planets',
    difficulty: 'intermediate',
    xpReward: 100,
    completed: false,
    gameType: 'debugger'
  }
];

/**
 * Get challenges for a specific skill
 */
export const getChallengesForSkill = (skillId: string): (CodeChallenge | QuizChallenge | GameChallenge)[] => {
  const completed = getCompletedChallenges();
  return challengeData
    .filter(c => c.skillId === skillId)
    .map(c => ({ ...c, completed: completed.has(c.id) }));
};

/**
 * Get all challenges
 */
export const getAllChallenges = (): (CodeChallenge | QuizChallenge | GameChallenge)[] => {
  const completed = getCompletedChallenges();
  return challengeData.map(c => ({ ...c, completed: completed.has(c.id) }));
};

/**
 * Get completed challenges from localStorage
 */
export const getCompletedChallenges = (): Set<string> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
};

/**
 * Mark a challenge as completed
 */
export const completeChallenge = (challengeId: string): void => {
  const completed = getCompletedChallenges();
  completed.add(challengeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
};

/**
 * Get challenge statistics
 */
export const getChallengeStats = () => {
  const completed = getCompletedChallenges();
  const total = challengeData.length;
  const totalXP = challengeData.reduce((sum, c) => completed.has(c.id) ? sum + c.xpReward : sum, 0);
  
  return {
    completed: completed.size,
    total,
    completionRate: Math.round((completed.size / total) * 100),
    totalXPEarned: totalXP
  };
};
