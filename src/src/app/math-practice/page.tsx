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

  const handleSettingChange = (
    key: keyof MathPracticeSettings,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateNewQuestion = () => {
    const questionTypes: QuestionType[] = [
      "fill-blank",
      "sequence",
      "next-prev",
    ];
    const randomType =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];

    const startNum = parseInt(settings.startNumber) || 0;

    const question = createMathQuestion({
      pattern: settings.pattern,
      direction: settings.direction,
      startNumber: startNum,
      questionType: randomType,
    });

    setCurrentQuestion(question);
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Math Practice for Bianca! 🌟</h1>
        <p>Let&apos;s practice counting patterns together!</p>
      </header>

      {!isPlaying ? (
        <div className={styles.mainContent}>
          <section className={styles.settingsSection}>
            <h2>Choose Your Practice</h2>

            <div className={styles.settingGroup}>
              <label htmlFor="pattern">Count by:</label>
              <select
                id="pattern"
                value={settings.pattern}
                onChange={(e) =>
                  handleSettingChange("pattern", Number(e.target.value))
                }
                className={styles.select}
              >
                <option value={2}>2s (2, 4, 6, 8...)</option>
                <option value={3}>3s (3, 6, 9, 12...)</option>
                <option value={5}>5s (5, 10, 15, 20...)</option>
                <option value={10}>10s (10, 20, 30, 40...)</option>
              </select>
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
              >
                <option value="forward">Forward (going up)</option>
                <option value="backward">Backward (going down)</option>
              </select>
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
                className={styles.numberInput}
                placeholder="e.g., 67"
                min="0"
                max="1000"
              />
            </div>

            <button
              onClick={handleStartPractice}
              className={styles.startButton}
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
        </div>
      ) : (
        <div className={styles.practiceMode}>
          <div className={styles.practiceHeader}>
            <div className={styles.statsBar}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Questions:</span>
                <span className={styles.statValue}>
                  {sessionStats.questionsAnswered}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Correct:</span>
                <span className={styles.statValue}>
                  {sessionStats.correctAnswers}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Points:</span>
                <span className={styles.statValue}>
                  {sessionStats.totalPoints}
                </span>
              </div>
            </div>
            <button
              onClick={handleBackToSettings}
              className={styles.backButton}
            >
              ← Back to Settings
            </button>
          </div>

          {currentQuestion && (
            <MathQuestionComponent
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
            />
          )}
        </div>
      )}
    </div>
  );
}
