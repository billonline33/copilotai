"use client";

import { useState } from "react";
import styles from "./Badge.module.scss";

interface BadgeProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    dateEarned?: string;
  };
  size?: "small" | "medium" | "large";
  showAnimation?: boolean;
}

export default function Badge({
  achievement,
  size = "medium",
  showAnimation = false,
}: BadgeProps) {
  const [isAnimating, setIsAnimating] = useState(showAnimation);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div
      className={`
        ${styles.badge} 
        ${styles[size]} 
        ${achievement.earned ? styles.earned : styles.locked}
        ${isAnimating ? styles.animating : ""}
      `}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{achievement.icon}</span>
        {!achievement.earned && <div className={styles.lockOverlay}>🔒</div>}
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{achievement.title}</h4>
        <p className={styles.description}>{achievement.description}</p>
        {achievement.earned && achievement.dateEarned && (
          <span className={styles.dateEarned}>
            Earned: {new Date(achievement.dateEarned).toLocaleDateString()}
          </span>
        )}
      </div>

      {isAnimating && (
        <div className={styles.unlockAnimation}>
          <div className={styles.sparkles}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.sparkle} ${styles[`sparkle${i + 1}`]}`}
              >
                ✨
              </div>
            ))}
          </div>
          <div className={styles.unlockText}>Achievement Unlocked!</div>
        </div>
      )}
    </div>
  );
}
