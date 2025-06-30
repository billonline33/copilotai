// Math Practice Page - Main Component
"use client";

import { useState } from "react";
import styles from "./math-practice.module.scss";
import type { MathPracticeSettings } from "../types/math-practice";

export default function MathPracticePage() {
  const [settings, setSettings] = useState<MathPracticeSettings>({
    pattern: 10,
    direction: "forward",
    startNumber: "0",
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Math Practice for Bianca! 🌟</h1>
        <p>Let&apos;s practice counting patterns together!</p>
      </header>

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
              onChange={(e) => handleSettingChange("direction", e.target.value)}
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

          <button className={styles.startButton}>Start Practice! 🚀</button>
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
    </div>
  );
}
