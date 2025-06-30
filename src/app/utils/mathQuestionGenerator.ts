// Math Practice Utilities - Question Generation Logic

import type {
  MathQuestion,
  QuestionConfig,
  QuestionType,
  CountingDirection,
} from "../types/math-practice";

/**
 * Generate a number sequence based on pattern, direction, and starting number
 * @param pattern - The counting pattern (2, 3, 5, 10)
 * @param direction - Forward or backward counting
 * @param startNumber - The starting number
 * @param length - How many numbers to generate
 * @returns Array of numbers in sequence
 */
export function generateSequence(
  pattern: number,
  direction: CountingDirection,
  startNumber: number,
  length: number = 12 // Increased default length for more numbers
): number[] {
  const sequence: number[] = [];
  let current = startNumber;

  for (let i = 0; i < length; i++) {
    sequence.push(current);
    if (direction === "forward") {
      current += pattern;
    } else {
      current -= pattern;
    }
  }

  return sequence;
}

/**
 * Generate random indices for missing numbers in a sequence
 * @param sequenceLength - Total length of the sequence
 * @param questionType - Type of question to generate
 * @returns Array of indices where numbers should be missing
 *
 * Note: Index 0 (first position) is never included in missing indices
 * to ensure the sequence always starts with a visible number
 */
export function generateMissingIndices(
  sequenceLength: number,
  questionType: QuestionType
): number[] {
  const indices: number[] = [];

  switch (questionType) {
    case "fill-blank":
      // 2-4 missing numbers, never include first position (index 0)
      const numGaps = Math.floor(Math.random() * 3) + 2; // 2-4 gaps
      const availableIndices = Array.from(
        { length: sequenceLength - 1 }, // Exclude first position
        (_, i) => i + 1 // Start from index 1
      );

      for (let i = 0; i < numGaps && availableIndices.length > 0; i++) {
        const randomIdx = Math.floor(Math.random() * availableIndices.length);
        indices.push(availableIndices[randomIdx]);
        availableIndices.splice(randomIdx, 1);
      }
      indices.sort((a, b) => a - b);
      break;

    case "sequence":
      // 2-4 missing numbers, avoid first position
      const numSequenceGaps = Math.floor(Math.random() * 3) + 2; // 2-4 gaps
      const sequenceAvailableIndices = Array.from(
        { length: sequenceLength - 2 }, // Exclude first and last positions
        (_, i) => i + 1 // Start from index 1
      );

      for (
        let i = 0;
        i < numSequenceGaps && sequenceAvailableIndices.length > 0;
        i++
      ) {
        const randomIdx = Math.floor(
          Math.random() * sequenceAvailableIndices.length
        );
        indices.push(sequenceAvailableIndices[randomIdx]);
        sequenceAvailableIndices.splice(randomIdx, 1);
      }
      indices.sort((a, b) => a - b);
      break;

    case "next-prev":
      // 2-4 missing numbers, avoid first position
      const numPrevGaps = Math.floor(Math.random() * 3) + 2; // 2-4 gaps
      const prevAvailableIndices = Array.from(
        { length: sequenceLength - 1 }, // Exclude first position
        (_, i) => i + 1 // Start from index 1
      );

      for (let i = 0; i < numPrevGaps && prevAvailableIndices.length > 0; i++) {
        const randomIdx = Math.floor(
          Math.random() * prevAvailableIndices.length
        );
        indices.push(prevAvailableIndices[randomIdx]);
        prevAvailableIndices.splice(randomIdx, 1);
      }
      indices.sort((a, b) => a - b);
      break;
  }

  return indices;
}

/**
 * Create a math question with missing numbers
 * @param config - Question configuration
 * @returns Complete MathQuestion object
 */
export function createMathQuestion(config: QuestionConfig): MathQuestion {
  const { pattern, direction, startNumber, questionType } = config;

  // Generate the complete sequence with more numbers
  const fullSequence = generateSequence(pattern, direction, startNumber, 12);

  // Determine which numbers will be missing
  const missingIndices = generateMissingIndices(
    fullSequence.length,
    questionType
  );

  // Create the sequence with gaps
  const sequence = fullSequence.map((num, index) =>
    missingIndices.includes(index) ? null : num
  );

  // Store correct answers
  const correctAnswers = missingIndices.map((index) => fullSequence[index]);

  return {
    id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: questionType,
    pattern,
    direction,
    startNumber,
    sequence: sequence.map((num) => num ?? 0), // Replace nulls with 0 for display
    missingIndices,
    userAnswers: new Array(missingIndices.length).fill(null),
    correctAnswers,
  };
}

/**
 * Validate user answers against correct answers
 * @param userAnswers - Array of user's answers
 * @param correctAnswers - Array of correct answers
 * @returns Object with validation results
 */
export function validateAnswers(
  userAnswers: (number | null)[],
  correctAnswers: number[]
): {
  isCorrect: boolean;
  correctCount: number;
  totalCount: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let correctCount = 0;

  userAnswers.forEach((userAnswer, index) => {
    const correctAnswer = correctAnswers[index];

    if (userAnswer === null) {
      feedback.push(`Question ${index + 1}: Please enter an answer`);
    } else if (userAnswer === correctAnswer) {
      correctCount++;
      feedback.push(`Question ${index + 1}: Correct! ✓`);
    } else {
      feedback.push(
        `Question ${index + 1}: Not quite right. The answer is ${correctAnswer}`
      );
    }
  });

  const isCorrect = correctCount === correctAnswers.length;

  return {
    isCorrect,
    correctCount,
    totalCount: correctAnswers.length,
    feedback,
  };
}

/**
 * Generate a friendly question description
 * @param question - The math question
 * @returns Human-readable question description
 */
export function getQuestionDescription(question: MathQuestion): string {
  const { pattern, direction, startNumber, type } = question;
  const directionText = direction === "forward" ? "up" : "down";

  switch (type) {
    case "fill-blank":
      return `Fill in the missing number when counting by ${pattern}s ${directionText} from ${startNumber}`;
    case "sequence":
      return `Complete the sequence by filling in the missing numbers (counting by ${pattern}s ${directionText})`;
    case "next-prev":
      return `What comes ${
        direction === "forward" ? "next" : "before"
      } when counting by ${pattern}s?`;
    default:
      return `Count by ${pattern}s ${directionText} from ${startNumber}`;
  }
}

/**
 * Sanitize user input to ensure it's a valid number
 * @param input - User input string
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumberInput(input: string): number | null {
  // Remove any non-digit characters except minus sign
  const cleaned = input.replace(/[^-\d]/g, "");

  if (cleaned === "" || cleaned === "-") {
    return null;
  }

  const num = parseInt(cleaned, 10);

  // Check if it's a reasonable number for a 7-year-old
  if (isNaN(num) || num < -1000 || num > 1000) {
    return null;
  }

  return num;
}
