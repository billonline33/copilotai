"use client";

import { useState } from "react";
import styles from "./MathQuestion.module.scss";
import type { MathQuestion } from "../types/math-practice";
import {
  validateAnswers,
  sanitizeNumberInput,
  getQuestionDescription,
} from "../utils/mathQuestionGenerator";

interface ValidationResult {
  isCorrect: boolean;
  correctCount: number;
  totalCount: number;
  feedback: string[];
}

interface MathQuestionProps {
  question: MathQuestion;
  onAnswerSubmit: (isCorrect: boolean, correctCount: number) => void;
  onNextQuestion: () => void;
}

export default function MathQuestionComponent({
  question,
  onAnswerSubmit,
  onNextQuestion,
}: MathQuestionProps) {
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(question.missingIndices.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [inputValues, setInputValues] = useState<string[]>(
    new Array(question.missingIndices.length).fill("")
  );

  const handleInputChange = (answerIndex: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[answerIndex] = value;
    setInputValues(newInputValues);

    const sanitizedValue = sanitizeNumberInput(value);
    const newAnswers = [...userAnswers];
    newAnswers[answerIndex] = sanitizedValue;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const result = validateAnswers(userAnswers, question.correctAnswers);
    setValidationResult(result);
    setShowFeedback(true);
    onAnswerSubmit(result.isCorrect, result.correctCount);
  };

  const handleNextQuestion = () => {
    setUserAnswers(new Array(question.missingIndices.length).fill(null));
    setInputValues(new Array(question.missingIndices.length).fill(""));
    setShowFeedback(false);
    setValidationResult(null);
    onNextQuestion();
  };

  const isAnswerComplete = userAnswers.every((answer) => answer !== null);

  // Create display sequence with input fields for missing numbers
  const renderSequence = () => {
    const displayItems: React.ReactElement[] = [];
    let missingIndexCounter = 0;

    question.sequence.forEach((num, index) => {
      const isMissing = question.missingIndices.includes(index);

      if (isMissing) {
        const answerIndex = missingIndexCounter;
        missingIndexCounter++;

        displayItems.push(
          <div key={`input-${index}`} className={styles.inputWrapper}>
            <input
              type="text"
              value={inputValues[answerIndex]}
              onChange={(e) => handleInputChange(answerIndex, e.target.value)}
              className={`${styles.numberInput} ${
                showFeedback
                  ? userAnswers[answerIndex] ===
                    question.correctAnswers[answerIndex]
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
              placeholder="?"
              disabled={showFeedback}
              aria-label={`Missing number ${answerIndex + 1}`}
            />
          </div>
        );
      } else {
        displayItems.push(
          <div key={`number-${index}`} className={styles.numberDisplay}>
            {num}
          </div>
        );
      }

      // Add arrow between numbers (except after the last one)
      if (index < question.sequence.length - 1) {
        displayItems.push(
          <div key={`arrow-${index}`} className={styles.arrow}>
            {question.direction === "forward" ? "→" : "←"}
          </div>
        );
      }
    });

    return displayItems;
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>
        <h3>{getQuestionDescription(question)}</h3>
        <div className={styles.patternInfo}>
          Counting by <strong>{question.pattern}s</strong> {question.direction}{" "}
          from <strong>{question.startNumber}</strong>
        </div>
      </div>

      <div className={styles.sequenceContainer}>{renderSequence()}</div>

      {!showFeedback && (
        <div className={styles.actionButtons}>
          <button
            onClick={handleSubmit}
            disabled={!isAnswerComplete}
            className={`${styles.submitButton} ${
              !isAnswerComplete ? styles.disabled : ""
            }`}
          >
            Check My Answer! 🎯
          </button>
        </div>
      )}

      {showFeedback && validationResult && (
        <div className={styles.feedbackContainer}>
          <div
            className={`${styles.resultHeader} ${
              validationResult.isCorrect ? styles.success : styles.partial
            }`}
          >
            {validationResult.isCorrect ? (
              <div className={styles.celebration}>
                <span className={styles.celebrationIcon}>🎉</span>
                <h4>Excellent work, Bianca!</h4>
                <span className={styles.celebrationIcon}>⭐</span>
              </div>
            ) : (
              <h4>Good try! Let&apos;s see how you did:</h4>
            )}
          </div>

          <div className={styles.scoreDisplay}>
            You got <strong>{validationResult.correctCount}</strong> out of{" "}
            <strong>{validationResult.totalCount}</strong> correct!
          </div>

          {!validationResult.isCorrect && (
            <div className={styles.correctAnswers}>
              <h5>The correct answers are:</h5>
              <div className={styles.answersList}>
                {question.correctAnswers.map((answer, index) => (
                  <div key={index} className={styles.correctAnswer}>
                    Missing number {index + 1}: <strong>{answer}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleNextQuestion} className={styles.nextButton}>
            Try Another Question! 🚀
          </button>
        </div>
      )}
    </div>
  );
}
