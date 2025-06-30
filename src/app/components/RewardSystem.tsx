"use client";

import { useState, useEffect } from "react";
import styles from "./RewardSystem.module.scss";
import Badge from "./Badge";

interface RewardSystemProps {
  points: number;
  correctAnswers: number;
  questionsAnswered: number;
  onCelebration?: () => void;
  onVideoReward?: () => void;
  clearSessionAchievements?: boolean; // New prop to clear session achievements
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  type: "points" | "questions" | "accuracy" | "correct";
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_answer",
    title: "Getting Started!",
    description: "Answer your first question",
    icon: "🌟",
    threshold: 1,
    type: "questions",
  },
  {
    id: "five_questions",
    title: "Practice Star",
    description: "Answer 5 questions",
    icon: "⭐",
    threshold: 5,
    type: "questions",
  },
  {
    id: "ten_correct",
    title: "Video Time! 🎬",
    description: "10 correct answers! Enjoy your video reward!",
    icon: "🎬",
    threshold: 10,
    type: "correct",
  },
  {
    id: "twenty_correct",
    title: "Double Video Time! 🌟",
    description: "20 correct answers! Another video for you!",
    icon: "�",
    threshold: 20,
    type: "correct",
  },
  {
    id: "first_points",
    title: "Point Collector",
    description: "Earn your first 10 points",
    icon: "💎",
    threshold: 10,
    type: "points",
  },
  {
    id: "fifty_points",
    title: "Point Master",
    description: "Earn 50 points",
    icon: "👑",
    threshold: 50,
    type: "points",
  },
  {
    id: "hundred_points",
    title: "Math Champion",
    description: "Earn 100 points",
    icon: "🎉",
    threshold: 100,
    type: "points",
  },
];

export default function RewardSystem({
  points,
  correctAnswers,
  questionsAnswered,
  onCelebration,
  onVideoReward,
  clearSessionAchievements,
}: RewardSystemProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(
    null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bianca-achievements");
    if (saved) {
      try {
        setUnlockedAchievements(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading achievements:", error);
      }
    }
  }, []);

  // Clear session-specific achievements when starting a new session
  useEffect(() => {
    if (clearSessionAchievements) {
      console.log("🔄 Clearing session achievements for new practice session");
      const saved = localStorage.getItem("bianca-achievements");
      if (saved) {
        try {
          const currentAchievements = JSON.parse(saved);
          // Remove session-specific achievements (correct answer based)
          const sessionAchievements = ["ten_correct", "twenty_correct"];
          const filteredAchievements = currentAchievements.filter(
            (id: string) => !sessionAchievements.includes(id)
          );

          // Update localStorage and state
          localStorage.setItem(
            "bianca-achievements",
            JSON.stringify(filteredAchievements)
          );
          setUnlockedAchievements(filteredAchievements);
          console.log("🔄 Cleared achievements:", sessionAchievements);
        } catch (error) {
          console.error("Error clearing session achievements:", error);
        }
      }
    }
  }, [clearSessionAchievements]);

  // Check for new achievements
  useEffect(() => {
    console.log("RewardSystem - checking achievements with:", {
      points,
      correctAnswers,
      questionsAnswered,
    });

    const checkAchievements = () => {
      for (const achievement of ACHIEVEMENTS) {
        if (unlockedAchievements.includes(achievement.id)) continue;

        let shouldUnlock = false;
        switch (achievement.type) {
          case "points":
            shouldUnlock = points >= achievement.threshold;
            break;
          case "questions":
            shouldUnlock = questionsAnswered >= achievement.threshold;
            break;
          case "correct":
            shouldUnlock = correctAnswers >= achievement.threshold;
            console.log(
              `Checking ${achievement.id}: correctAnswers=${correctAnswers} >= threshold=${achievement.threshold} = ${shouldUnlock}`
            );
            break;
          case "accuracy":
            const accuracy =
              questionsAnswered > 0
                ? (correctAnswers / questionsAnswered) * 100
                : 0;
            shouldUnlock = accuracy >= achievement.threshold;
            break;
        }

        if (shouldUnlock) {
          console.log(`🎉 Achievement unlocked: ${achievement.id}`);
          const newUnlocked = [...unlockedAchievements, achievement.id];
          setUnlockedAchievements(newUnlocked);
          setNewAchievement(achievement);
          setShowCelebration(true);

          // Save to localStorage
          localStorage.setItem(
            "bianca-achievements",
            JSON.stringify(newUnlocked)
          );

          // Trigger video reward for specific achievements
          if (
            (achievement.id === "ten_correct" ||
              achievement.id === "twenty_correct") &&
            onVideoReward
          ) {
            console.log("🎬 Triggering video reward for:", achievement.id);
            onVideoReward();
          }

          // Trigger celebration callback
          if (onCelebration) {
            onCelebration();
          }

          // Hide celebration after 4 seconds for video rewards, 3 seconds for others
          const delay = achievement.type === "correct" ? 4000 : 3000;
          setTimeout(() => {
            setShowCelebration(false);
            setNewAchievement(null);
          }, delay);

          break; // Only show one achievement at a time
        }
      }
    };

    checkAchievements();
  }, [
    points,
    correctAnswers,
    questionsAnswered,
    unlockedAchievements,
    onCelebration,
    onVideoReward,
  ]);

  const accuracy =
    questionsAnswered > 0
      ? Math.round((correctAnswers / questionsAnswered) * 100)
      : 0;

  return (
    <div className={styles.rewardContainer}>
      {/* Current Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💯</div>
          <div className={styles.statValue}>{points}</div>
          <div className={styles.statLabel}>Points</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{correctAnswers}</div>
          <div className={styles.statLabel}>Correct</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{accuracy}%</div>
          <div className={styles.statLabel}>Accuracy</div>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className={styles.achievementsSection}>
        <h3>Your Achievements</h3>
        <div className={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const isNewlyUnlocked =
              newAchievement?.id === achievement.id && showCelebration;

            return (
              <Badge
                key={achievement.id}
                achievement={{
                  ...achievement,
                  earned: isUnlocked,
                  dateEarned: isUnlocked ? new Date().toISOString() : undefined,
                }}
                size="small"
                showAnimation={isNewlyUnlocked}
              />
            );
          })}
        </div>
      </div>

      {/* New Achievement Celebration */}
      {showCelebration && newAchievement && (
        <div className={styles.celebrationOverlay}>
          <div className={styles.celebrationCard}>
            <div className={styles.celebrationIcon}>{newAchievement.icon}</div>
            <h2>Achievement Unlocked!</h2>
            <h3>{newAchievement.title}</h3>
            <p>{newAchievement.description}</p>
            <div className={styles.celebrationConfetti}>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className={styles.confetti} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
