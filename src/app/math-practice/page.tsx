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
  // Configuration constants
  const TOTAL_QUESTIONS_PER_SESSION = 24;
  const SEQUENCE_LENGTH_PER_QUESTION = 24; // Each question shows 8 numbers with 2-4 gaps

  const [settings, setSettings] = useState<MathPracticeSettings>({
    pattern: 10,
    direction: "forward",
    startNumber: "0",
  });

  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(
    null
  );
  const [allQuestions, setAllQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    totalPoints: 0,
    totalQuestions: TOTAL_QUESTIONS_PER_SESSION, // Total questions in a session
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showVideoReward, setShowVideoReward] = useState(false);
  const [clearSessionAchievements, setClearSessionAchievements] =
    useState(false);

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

  const generateAllQuestions = () => {
    try {
      const questions: MathQuestion[] = [];
      const questionTypes: QuestionType[] = [
        "fill-blank",
        "sequence",
        "next-prev",
      ];

      const startNum = parseInt(settings.startNumber) || 0;

      // Validate that we can generate valid questions
      if (startNum < 0 || startNum > 1000) {
        setErrorMessage("Starting number must be between 0 and 1000");
        return;
      }

      // Generate questions for the entire session
      for (let i = 0; i < TOTAL_QUESTIONS_PER_SESSION; i++) {
        const randomType =
          questionTypes[Math.floor(Math.random() * questionTypes.length)];

        // Vary the starting number slightly for each question
        const questionStartNum = startNum + i * settings.pattern;

        const question = createMathQuestion({
          pattern: settings.pattern,
          direction: settings.direction,
          startNumber: questionStartNum,
          questionType: randomType,
          sequenceLength: SEQUENCE_LENGTH_PER_QUESTION, // Consistent sequence length
        });

        questions.push(question);
      }

      setAllQuestions(questions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(questions[0]);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error generating questions:", error);
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
      totalQuestions: TOTAL_QUESTIONS_PER_SESSION,
    });

    // Clear session achievements for a fresh start
    setClearSessionAchievements(true);

    // Reset the clear flag after a brief moment
    setTimeout(() => {
      setClearSessionAchievements(false);
    }, 100);

    // Generate all questions for the session at the start
    generateAllQuestions();
  };

  const handleAnswerSubmit = (isCorrect: boolean, correctCount: number) => {
    const points = correctCount * 10; // 10 points per correct answer

    setSessionStats((prev) => {
      const newStats = {
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + correctCount,
        totalPoints: prev.totalPoints + points,
        totalQuestions: prev.totalQuestions, // Keep the total questions
      };

      // Debug logging
      console.log("Answer submitted:", { isCorrect, correctCount });
      console.log("New session stats:", newStats);

      return newStats;
    });
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < allQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
    } else {
      // End of session - show completion message
      console.log(
        `Session completed! All ${TOTAL_QUESTIONS_PER_SESSION} questions answered.`
      );
      setCurrentQuestion(null);
      // Could add a completion modal or redirect here
    }
  };

  const handleBackToSettings = () => {
    setIsPlaying(false);
    setCurrentQuestion(null);
  };

  const handleVideoReward = () => {
    console.log("🎬 handleVideoReward called - opening video modal");
    setShowVideoReward(true);
  };

  const handleCloseVideoReward = () => {
    console.log("🎬 handleCloseVideoReward called - closing video modal");
    setShowVideoReward(false);
  };

  // For testing - manually trigger video reward
  const handleTestVideoReward = () => {
    console.log("🧪 Test button clicked - opening video modal directly");
    setShowVideoReward(true);
  };

  // For testing - manually set 10 correct answers
  const handleTest10Correct = () => {
    console.log("🧪 Setting 10 correct answers for testing");
    setSessionStats((prev) => ({
      ...prev,
      correctAnswers: 10,
    }));
  };

  // For testing - manually clear all achievements
  const handleClearAchievements = () => {
    console.log("🧪 Clearing all achievements for testing");
    localStorage.removeItem("bianca-achievements");
    setClearSessionAchievements(true);
    setTimeout(() => {
      setClearSessionAchievements(false);
    }, 100);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Math Practice for Bianca! 🌟</h1>
        <p>Let&apos;s practice counting patterns together!</p>
      </header>

      {/* Test buttons for video reward (development only) - Moved to top for easy access */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            margin: "10px 0",
            textAlign: "center",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
            🧪 Development Testing Tools
          </p>
          <button
            onClick={handleTestVideoReward}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              margin: "0 5px",
            }}
          >
            🎬 Test Video Modal
          </button>
          <button
            onClick={handleTest10Correct}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4ecdc4",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              margin: "0 5px",
            }}
          >
            🎯 Set 10 Correct
          </button>
          <button
            onClick={handleClearAchievements}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffa500",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              margin: "0 5px",
            }}
          >
            🧹 Clear Achievements
          </button>
        </div>
      )}

      {/* Practice Session Container - Moved to top for easy access */}
      {isPlaying && (
        <div className={styles.practiceMode} role="main" aria-live="polite">
          <div className={styles.practiceHeader}>
            <div
              className={styles.statsBar}
              role="status"
              aria-label="Current session statistics"
            >
              <div className={styles.stat}>
                <span className={styles.statLabel}>Progress:</span>
                <span
                  className={styles.statValue}
                  aria-label={`Question ${currentQuestionIndex + 1} of ${
                    sessionStats.totalQuestions
                  }`}
                >
                  {currentQuestionIndex + 1}/{sessionStats.totalQuestions}
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

          {/* Math Question Container - Now at the top! */}
          {currentQuestion && (
            <MathQuestionComponent
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
            />
          )}

          {/* Reward System during practice */}
          <RewardSystem
            points={sessionStats.totalPoints}
            correctAnswers={sessionStats.correctAnswers}
            questionsAnswered={sessionStats.questionsAnswered}
            onVideoReward={handleVideoReward}
            clearSessionAchievements={clearSessionAchievements}
          />

          {/* Progress bar for question completion */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / sessionStats.totalQuestions) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className={styles.progressText}>
              Question {currentQuestionIndex + 1} of{" "}
              {sessionStats.totalQuestions}
            </span>
          </div>
        </div>
      )}

      {/* Settings Section - Now below practice when not playing */}
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
      ) : null}

      {/* Video Reward Modal */}
      <VideoReward isOpen={showVideoReward} onClose={handleCloseVideoReward} />
    </div>
  );
}
