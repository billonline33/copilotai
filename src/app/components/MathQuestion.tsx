"use client";

import { useState, useEffect, useRef } from "react";
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
  maxNumber: number; // NEW: max number to display
}

export default function MathQuestionComponent({
  question,
  onAnswerSubmit,
  onNextQuestion,
  maxNumber,
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
  const [showBiancaCelebration, setShowBiancaCelebration] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset state when question changes
  useEffect(() => {
    setUserAnswers(new Array(question.missingIndices.length).fill(null));
    setInputValues(new Array(question.missingIndices.length).fill(""));
    setShowFeedback(false);
    setValidationResult(null);
    setShowBiancaCelebration(false);
    // Focus the first input field when question changes
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, [question]);

  // Play celebration sound (if supported)
  const playCelebrationSound = () => {
    try {
      // Create a simple celebration sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      ); // E5
      oscillator.frequency.setValueAtTime(
        783.99,
        audioContext.currentTime + 0.2
      ); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Could not play celebration sound:", error);
    }
  };

  const handleInputChange = (answerIndex: number, value: string) => {
    // Ensure we have valid arrays and index
    if (answerIndex < 0 || answerIndex >= question.missingIndices.length) {
      return;
    }

    const newInputValues = [...inputValues];
    newInputValues[answerIndex] = value || "";
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

    // Play celebration sound and show Bianca's celebration animation for correct answers
    if (result.isCorrect) {
      setShowBiancaCelebration(true);
      playCelebrationSound();

      // Hide Bianca celebration after 4 seconds
      setTimeout(() => {
        setShowBiancaCelebration(false);
      }, 4000);
    }
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
              ref={answerIndex === 0 ? firstInputRef : undefined}
              type="text"
              value={inputValues[answerIndex] || ""}
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
              data-testid={`answer-input-${answerIndex}`}
            />
          </div>
        );
      } else {
        // Only show the number if it is >= 0 and <= maxNumber
        if (typeof num === "number" && num >= 0 && num <= maxNumber) {
          // Only show the first 0, hide all subsequent 0s
          if (num === 0) {
            if (
              !displayItems.some((item) => {
                const children = (item as React.ReactElement).props?.children;
                return typeof children === "number" && children === 0;
              })
            ) {
              displayItems.push(
                <div key={`number-${index}`} className={styles.numberDisplay}>
                  {num}
                </div>
              );
            } else {
              displayItems.push(
                <div
                  key={`number-${index}`}
                  className={styles.numberDisplay}
                  style={{ visibility: "hidden" }}
                />
              );
            }
          } else {
            displayItems.push(
              <div key={`number-${index}`} className={styles.numberDisplay}>
                {num}
              </div>
            );
          }
        } else {
          // If the number is negative or > maxNumber, render nothing (hide it)
          displayItems.push(
            <div
              key={`number-${index}`}
              className={styles.numberDisplay}
              style={{ visibility: "hidden" }}
            />
          );
        }
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
    <div className={styles.questionContainer} data-testid="question-container">
      <div className={styles.questionHeader}>
        <h3>{getQuestionDescription(question)}</h3>
        <div className={styles.patternInfo}>
          Counting by <strong>{question.pattern}s</strong> {question.direction}{" "}
          from <strong>{question.startNumber}</strong>
        </div>
      </div>

      <div
        className={styles.sequenceContainer}
        data-testid="sequence-container"
      >
        {renderSequence()}
      </div>

      {!showFeedback && (
        <div className={styles.actionButtons}>
          <button
            onClick={handleSubmit}
            disabled={!isAnswerComplete}
            className={`${styles.submitButton} ${
              !isAnswerComplete ? styles.disabled : ""
            }`}
            data-testid="submit-answer-button"
          >
            Check My Answer! 🎯
          </button>
        </div>
      )}

      {showFeedback && validationResult && (
        <div
          className={styles.feedbackContainer}
          data-testid="feedback-container"
        >
          <div
            className={`${styles.resultHeader} ${
              validationResult.isCorrect ? styles.success : styles.partial
            }`}
            data-testid="result-header"
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

          <div className={styles.scoreDisplay} data-testid="score-display">
            You got <strong>{validationResult.correctCount}</strong> out of{" "}
            <strong>{validationResult.totalCount}</strong> correct!
          </div>

          {!validationResult.isCorrect && (
            <div
              className={styles.correctAnswers}
              data-testid="correct-answers"
            >
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

          <button
            onClick={handleNextQuestion}
            className={styles.nextButton}
            data-testid="next-question-button"
          >
            Try Another Question! 🚀
          </button>
        </div>
      )}

      {/* Special Bianca Celebration */}
      {showBiancaCelebration && (
        <div className={styles.biancaCelebration}>
          <div className={styles.celebrationContent}>
            <div className={styles.princessIcon}>👸</div>
            <h2 className={styles.celebrationTitle}>Well done Bianca!</h2>
            <div className={styles.celebrationStars}>
              <span>⭐</span>
              <span>🌟</span>
              <span>✨</span>
              <span>💫</span>
              <span>⭐</span>
            </div>
            <p className={styles.celebrationMessage}>
              You&apos;re a math superstar! Keep up the amazing work!
            </p>
            <div className={styles.celebrationSparkles}>
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className={styles.sparkle} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
