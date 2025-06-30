// Math Practice Page - Main Component
"use client";

import { useState } from "react";
import styles from "./math-practice.module.scss";
import type {
  MathPracticeSettings,
  MathQuestion,
  QuestionType,
} from "../types/math-practice";
import { createMathQuestion } from "../utils/mathQuestionGenerator";
import MathQuestionComponent from "../components/MathQuestion";
import RewardSystem from "../components/RewardSystem";
import ProgressTracker from "../components/ProgressTracker";
import VideoReward from "../components/VideoReward";

export default function MathPracticePage() {
  const [settings, setSettings] = useState<MathPracticeSettings>({
    pattern: 10,
    direction: "forward",
    startNumber: "0",
  });

  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    totalPoints: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showVideoReward, setShowVideoReward] = useState(false);

  const handleSettingChange = (
    key: keyof MathPracticeSettings,
    value: string | number
  ) => {
    // Clear any previous error when user makes changes
    setErrorMessage("");

    // Validate start number
    if (key === "startNumber" && typeof value === "string") {
      const num = parseInt(value);
      if (value !== "" && (isNaN(num) || num < 0 || num > 1000)) {
        setErrorMessage("Please enter a number between 0 and 1000");
        return;
      }
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateNewQuestion = () => {
    try {
      const questionTypes: QuestionType[] = [
        "fill-blank",
        "sequence",
        "next-prev",
      ];
      const randomType =
        questionTypes[Math.floor(Math.random() * questionTypes.length)];

      const startNum = parseInt(settings.startNumber) || 0;

      // Validate that we can generate a valid question
      if (startNum < 0 || startNum > 1000) {
        setErrorMessage("Starting number must be between 0 and 1000");
        return;
      }

      const question = createMathQuestion({
        pattern: settings.pattern,
        direction: settings.direction,
        startNumber: startNum,
        questionType: randomType,
      });

      setCurrentQuestion(question);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error generating question:", error);
      setErrorMessage(
        "Oops! Something went wrong. Please try different settings."
      );
    }
  };

  const handleStartPractice = () => {
    setIsPlaying(true);
    setSessionStats({
      questionsAnswered: 0,
      correctAnswers: 0,
      totalPoints: 0,
    });
    generateNewQuestion();
  };

  const handleAnswerSubmit = (isCorrect: boolean, correctCount: number) => {
    const points = correctCount * 10; // 10 points per correct answer

    setSessionStats((prev) => ({
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + correctCount,
      totalPoints: prev.totalPoints + points,
    }));
  };

  const handleNextQuestion = () => {
    generateNewQuestion();
  };

  const handleBackToSettings = () => {
    setIsPlaying(false);
    setCurrentQuestion(null);
  };

  const handleVideoReward = () => {
    setShowVideoReward(true);
  };

  const handleCloseVideoReward = () => {
    setShowVideoReward(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Math Practice for Bianca! 🌟</h1>
        <p>Let&apos;s practice counting patterns together!</p>
      </header>

      {!isPlaying ? (
        <div className={styles.mainContent}>
          <section
            className={styles.settingsSection}
            aria-labelledby="settings-heading"
          >
            <h2 id="settings-heading">Choose Your Practice</h2>

            <div className={styles.settingGroup}>
              <label htmlFor="pattern">Count by:</label>
              <select
                id="pattern"
                value={settings.pattern}
                onChange={(e) =>
                  handleSettingChange("pattern", Number(e.target.value))
                }
                className={styles.select}
                aria-describedby="pattern-help"
              >
                <option value={2}>2s (2, 4, 6, 8...)</option>
                <option value={3}>3s (3, 6, 9, 12...)</option>
                <option value={5}>5s (5, 10, 15, 20...)</option>
                <option value={10}>10s (10, 20, 30, 40...)</option>
              </select>
              <div id="pattern-help" className={styles.srOnly}>
                Choose which counting pattern you want to practice
              </div>
              <div className={styles.helpText}>
                Start with 10s - they&apos;re the easiest! 🌟
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label htmlFor="direction">Direction:</label>
              <select
                id="direction"
                value={settings.direction}
                onChange={(e) =>
                  handleSettingChange("direction", e.target.value)
                }
                className={styles.select}
                aria-describedby="direction-help"
                title="Choose to count up (forward) or down (backward)"
              >
                <option value="forward">Forward (going up)</option>
                <option value="backward">Backward (going down)</option>
              </select>
              <div id="direction-help" className={styles.srOnly}>
                Choose whether to count up or down
              </div>
              <div className={styles.helpText}>
                Try forward first, then challenge yourself with backward! 🔄
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label htmlFor="startNumber">Start from number:</label>
              <input
                id="startNumber"
                type="number"
                value={settings.startNumber}
                onChange={(e) =>
                  handleSettingChange("startNumber", e.target.value)
                }
                className={`${styles.numberInput} ${
                  errorMessage ? styles.error : ""
                }`}
                placeholder="e.g., 67"
                min="0"
                max="1000"
                aria-describedby="start-help"
                title="Enter a number between 0 and 1000"
              />
              <div id="start-help" className={styles.srOnly}>
                Enter the number you want to start counting from
              </div>
              <div className={styles.helpText}>
                Try 0, 10, or 20 for easier practice! 🎯
              </div>
            </div>

            {errorMessage && (
              <div className={styles.errorMessage} role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              onClick={handleStartPractice}
              className={styles.startButton}
              aria-label="Start the math practice session"
            >
              Start Practice! 🚀
            </button>
          </section>

          <section className={styles.practiceSection}>
            <div className={styles.placeholder}>
              <p>
                Select your settings and click &quot;Start Practice!&quot; to
                begin
              </p>
              <div className={styles.preview}>
                <strong>Preview:</strong> Counting by {settings.pattern}s{" "}
                {settings.direction} from {settings.startNumber || "0"}
              </div>
            </div>
          </section>

          {/* Progress Tracker on settings page */}
          <ProgressTracker currentSession={sessionStats} />
        </div>
      ) : (
        <div className={styles.practiceMode} role="main" aria-live="polite">
          <div className={styles.practiceHeader}>
            <div
              className={styles.statsBar}
              role="status"
              aria-label="Current session statistics"
            >
              <div className={styles.stat}>
                <span className={styles.statLabel}>Questions:</span>
                <span
                  className={styles.statValue}
                  aria-label={`${sessionStats.questionsAnswered} questions answered`}
                >
                  {sessionStats.questionsAnswered}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Correct:</span>
                <span
                  className={styles.statValue}
                  aria-label={`${sessionStats.correctAnswers} correct answers`}
                >
                  {sessionStats.correctAnswers}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Points:</span>
                <span
                  className={styles.statValue}
                  aria-label={`${sessionStats.totalPoints} points earned`}
                >
                  {sessionStats.totalPoints}
                </span>
              </div>
            </div>
            <button
              onClick={handleBackToSettings}
              className={styles.backButton}
              aria-label="Go back to practice settings"
            >
              ← Back to Settings
            </button>
          </div>

          {/* Reward System during practice */}
          <RewardSystem
            points={sessionStats.totalPoints}
            correctAnswers={sessionStats.correctAnswers}
            questionsAnswered={sessionStats.questionsAnswered}
            onVideoReward={handleVideoReward}
          />

          {currentQuestion && (
            <MathQuestionComponent
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
            />
          )}
        </div>
      )}
      
      {/* Video Reward Modal */}
      <VideoReward 
        isOpen={showVideoReward}
        onClose={handleCloseVideoReward}
      />
    </div>
  );
}
