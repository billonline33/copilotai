// Math Practice Feature - Type Definitions

export type QuestionType = "sequence" | "fill-blank" | "next-prev";
export type CountingDirection = "forward" | "backward";

export interface MathQuestion {
  id: string;
  type: QuestionType;
  pattern: number; // 2, 3, 5, 10
  direction: CountingDirection;
  startNumber: number;
  sequence: number[];
  missingIndices: number[];
  userAnswers: (number | null)[];
  correctAnswers: number[];
}

export interface Progress {
  sessionId: string;
  timestamp: Date;
  questionsAnswered: number;
  correctAnswers: number;
  totalPoints: number;
  patterns: Record<string, number>; // pattern -> correct count
  achievements: string[];
}

export interface QuestionConfig {
  pattern: number;
  direction: CountingDirection;
  startNumber: number;
  questionType: QuestionType;
  sequenceLength?: number; // Optional sequence length for the question
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Form input types
export interface MathPracticeSettings {
  pattern: number;
  direction: CountingDirection;
  startNumber: string;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
