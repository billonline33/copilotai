"use client";

import { useState, useEffect } from "react";
import styles from "./ProgressTracker.module.scss";

interface ProgressTrackerProps {
  currentSession: {
    questionsAnswered: number;
    correctAnswers: number;
    totalPoints: number;
  };
}

interface HistoricalProgress {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  totalPoints: number;
  patterns: Record<string, { correct: number; total: number }>;
}

export default function ProgressTracker({
  currentSession,
}: ProgressTrackerProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalProgress[]>(
    []
  );
  const [showHistory, setShowHistory] = useState(false);

  // Load historical data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bianca-progress-history");
    if (saved) {
      try {
        setHistoricalData(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading progress history:", error);
      }
    }
  }, []);

  // Save current session when it ends
  const saveCurrentSession = () => {
    if (currentSession.questionsAnswered === 0) return;

    const today = new Date().toISOString().split("T")[0];
    const newEntry: HistoricalProgress = {
      date: today,
      questionsAnswered: currentSession.questionsAnswered,
      correctAnswers: currentSession.correctAnswers,
      totalPoints: currentSession.totalPoints,
      patterns: {}, // Could be enhanced to track pattern-specific performance
    };

    const existingTodayIndex = historicalData.findIndex(
      (entry) => entry.date === today
    );
    let newData: HistoricalProgress[];

    if (existingTodayIndex >= 0) {
      // Update today's entry
      newData = [...historicalData];
      newData[existingTodayIndex] = {
        ...newData[existingTodayIndex],
        questionsAnswered:
          newData[existingTodayIndex].questionsAnswered +
          currentSession.questionsAnswered,
        correctAnswers:
          newData[existingTodayIndex].correctAnswers +
          currentSession.correctAnswers,
        totalPoints:
          newData[existingTodayIndex].totalPoints + currentSession.totalPoints,
      };
    } else {
      // Add new entry
      newData = [...historicalData, newEntry].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    setHistoricalData(newData);
    localStorage.setItem("bianca-progress-history", JSON.stringify(newData));
  };

  // Calculate totals
  const totalQuestions =
    historicalData.reduce((sum, entry) => sum + entry.questionsAnswered, 0) +
    currentSession.questionsAnswered;
  const totalCorrect =
    historicalData.reduce((sum, entry) => sum + entry.correctAnswers, 0) +
    currentSession.correctAnswers;
  const totalPoints =
    historicalData.reduce((sum, entry) => sum + entry.totalPoints, 0) +
    currentSession.totalPoints;
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const currentAccuracy =
    currentSession.questionsAnswered > 0
      ? Math.round(
          (currentSession.correctAnswers / currentSession.questionsAnswered) *
            100
        )
      : 0;

  // Calculate streak (consecutive days with practice)
  const calculateStreak = () => {
    if (historicalData.length === 0)
      return currentSession.questionsAnswered > 0 ? 1 : 0;

    let streak = currentSession.questionsAnswered > 0 ? 1 : 0;
    const today = new Date();

    for (let i = 0; i < historicalData.length; i++) {
      const entryDate = new Date(historicalData[i].date);
      const daysDiff = Math.floor(
        (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const practiceStreak = calculateStreak();

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h3>Your Progress Journey</h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={styles.toggleButton}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* Current Session */}
      <div className={styles.currentSession}>
        <h4>Today&apos;s Practice</h4>
        <div className={styles.sessionStats}>
          <div className={styles.sessionStat}>
            <span className={styles.statNumber}>
              {currentSession.questionsAnswered}
            </span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.sessionStat}>
            <span className={styles.statNumber}>
              {currentSession.correctAnswers}
            </span>
            <span className={styles.statLabel}>Correct</span>
          </div>
          <div className={styles.sessionStat}>
            <span className={styles.statNumber}>{currentAccuracy}%</span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
          <div className={styles.sessionStat}>
            <span className={styles.statNumber}>
              {currentSession.totalPoints}
            </span>
            <span className={styles.statLabel}>Points</span>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className={styles.overallProgress}>
        <h4>Overall Progress</h4>
        <div className={styles.progressGrid}>
          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>🎯</div>
            <div className={styles.progressValue}>{totalQuestions}</div>
            <div className={styles.progressLabel}>Total Questions</div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>✅</div>
            <div className={styles.progressValue}>{totalCorrect}</div>
            <div className={styles.progressLabel}>Correct Answers</div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>📊</div>
            <div className={styles.progressValue}>{overallAccuracy}%</div>
            <div className={styles.progressLabel}>Overall Accuracy</div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>🔥</div>
            <div className={styles.progressValue}>{practiceStreak}</div>
            <div className={styles.progressLabel}>Day Streak</div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>💎</div>
            <div className={styles.progressValue}>{totalPoints}</div>
            <div className={styles.progressLabel}>Total Points</div>
          </div>
        </div>
      </div>

      {/* Accuracy Progress Bar */}
      <div className={styles.accuracyProgress}>
        <div className={styles.accuracyLabel}>
          <span>Accuracy Progress</span>
          <span>{overallAccuracy}%</span>
        </div>
        <div className={styles.accuracyBar}>
          <div
            className={styles.accuracyFill}
            style={{ width: `${overallAccuracy}%` }}
          />
        </div>
        <div className={styles.accuracyMilestones}>
          <span className={overallAccuracy >= 50 ? styles.reached : ""}>
            50%
          </span>
          <span className={overallAccuracy >= 75 ? styles.reached : ""}>
            75%
          </span>
          <span className={overallAccuracy >= 90 ? styles.reached : ""}>
            90%
          </span>
          <span className={overallAccuracy >= 95 ? styles.reached : ""}>
            95%
          </span>
        </div>
      </div>

      {/* Historical Data */}
      {showHistory && (
        <div className={styles.historySection}>
          <h4>Practice History</h4>
          {historicalData.length === 0 ? (
            <p className={styles.noHistory}>
              No practice history yet. Keep practicing to build your progress!
            </p>
          ) : (
            <div className={styles.historyList}>
              {historicalData.slice(0, 7).map((entry) => {
                const accuracy =
                  entry.questionsAnswered > 0
                    ? Math.round(
                        (entry.correctAnswers / entry.questionsAnswered) * 100
                      )
                    : 0;
                const date = new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div key={entry.date} className={styles.historyEntry}>
                    <div className={styles.historyDate}>{date}</div>
                    <div className={styles.historyStats}>
                      <span>{entry.questionsAnswered} questions</span>
                      <span>{entry.correctAnswers} correct</span>
                      <span>{accuracy}% accuracy</span>
                      <span>{entry.totalPoints} points</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Save Session Button */}
      {currentSession.questionsAnswered > 0 && (
        <div className={styles.saveSection}>
          <button onClick={saveCurrentSession} className={styles.saveButton}>
            💾 Save Today&apos;s Progress
          </button>
        </div>
      )}
    </div>
  );
}
