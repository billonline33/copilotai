"use client";

import { useState, useEffect } from "react";
import styles from "./VideoReward.module.scss";

interface VideoRewardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fun, educational videos suitable for 7-year-olds
const KIDS_VIDEOS = [
  {
    id: "counting-song",
    title: "Number Song 1-20 for Children",
    embedId: "D0Ajq682yrA", // YouTube video ID
    description: "Learn counting from 1 to 20 with a catchy song!",
  },
  {
    id: "shapes-song",
    title: "Learn Shapes Song",
    embedId: "3yKVaEaC3Z8",
    description: "Fun song about different shapes!",
  },
  {
    id: "addition-song",
    title: "Addition Song",
    embedId: "Kzem0QKJYaQ",
    description: "Learn addition with a fun song!",
  },
  {
    id: "subtraction-song",
    title: "Subtraction Song",
    embedId: "m_BF5KfqLFo",
    description: "Practice subtraction with music!",
  },
  {
    id: "times-tables",
    title: "Times Tables Song",
    embedId: "StpWkdD1Qr4",
    description: "Fun way to learn multiplication!",
  },
];

export default function VideoReward({ isOpen, onClose }: VideoRewardProps) {
  const [selectedVideo, setSelectedVideo] = useState(KIDS_VIDEOS[0]);
  const [watchTime, setWatchTime] = useState(0);
  const maxWatchTime = 180; // 3 minutes limit

  useEffect(() => {
    if (isOpen) {
      // Select a random video
      const randomVideo =
        KIDS_VIDEOS[Math.floor(Math.random() * KIDS_VIDEOS.length)];
      setSelectedVideo(randomVideo);
      setWatchTime(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && watchTime < maxWatchTime) {
      timer = setTimeout(() => {
        setWatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, watchTime, maxWatchTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    setWatchTime(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🎉 Great Job, Bianca! 🎉</h2>
          <p>You got 10 correct answers! Enjoy your video reward!</p>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className={styles.video}
            />
          </div>
          <div className={styles.videoInfo}>
            <h3>{selectedVideo.title}</h3>
            <p>{selectedVideo.description}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.timer}>
            <span>
              Watch time: {formatTime(watchTime)} / {formatTime(maxWatchTime)}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${(watchTime / maxWatchTime) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.newVideoButton}
              onClick={() => {
                const randomVideo =
                  KIDS_VIDEOS[Math.floor(Math.random() * KIDS_VIDEOS.length)];
                setSelectedVideo(randomVideo);
                setWatchTime(0);
              }}
            >
              🎲 Random Video
            </button>
            <button className={styles.continueButton} onClick={handleClose}>
              Continue Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
