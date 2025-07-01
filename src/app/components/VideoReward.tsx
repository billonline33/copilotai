"use client";

import { useState, useEffect } from "react";
import styles from "./VideoReward.module.scss";

interface VideoRewardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fun, entertaining videos suitable for 7-year-olds (short and fun!)
const KIDS_VIDEOS = [
  {
    id: "baby-shark",
    title: "Baby Shark Dance",
    embedId: "XqZsoesa55w", // Pinkfong - Baby Shark (very popular with kids)
    description: "Dance along with Baby Shark!",
  },
  {
    id: "wheels-on-bus",
    title: "The Wheels on the Bus",
    embedId: "e_04ZrNroTo", // Super Simple Songs - fun animation
    description: "Sing along with the wheels on the bus!",
  },
  {
    id: "if-youre-happy",
    title: "If You&apos;re Happy and You Know It",
    embedId: "l4WNrvVjiTw", // Super Simple Songs - interactive song
    description: "Clap your hands and stomp your feet!",
  },
  {
    id: "head-shoulders",
    title: "Head Shoulders Knees and Toes",
    embedId: "h4eueDYPTIg", // Super Simple Songs - movement song
    description: "Move your body with this fun song!",
  },
  {
    id: "old-macdonald",
    title: "Old MacDonald Had a Farm",
    embedId: "_6HzoUcx3eo", // Super Simple Songs - animal sounds
    description: "Learn about farm animals and their sounds!",
  },
  {
    id: "bingo-song",
    title: "BINGO Dog Song",
    embedId: "9mmF8zOlh_g", // Super Simple Songs - spelling fun
    description: "Spell BINGO with this catchy tune!",
  },
  // User's custom video selections
  {
    id: "fun-video-1",
    title: "Fun Video Adventure 1",
    embedId: "DsUPVERZFlI", // User selected
    description: "A special fun video just for you!",
  },
  {
    id: "fun-video-2",
    title: "Fun Video Adventure 2",
    embedId: "DEWsqAmoty8", // User selected
    description: "Another awesome video to enjoy!",
  },
  {
    id: "fun-video-3",
    title: "Fun Video Adventure 3",
    embedId: "f6FBy3z3wqc", // User selected
    description: "Get ready for more fun!",
  },
  {
    id: "fun-video-4",
    title: "Fun Video Adventure 4",
    embedId: "MIWtPBIQeyQ", // User selected
    description: "Amazing video time!",
  },
  {
    id: "fun-video-5",
    title: "Fun Video Adventure 5",
    embedId: "DgTGDFpT-QE", // User selected
    description: "Super fun video break!",
  },
  {
    id: "fun-video-6",
    title: "Fun Video Adventure 6",
    embedId: "7Z4jAH1iBeQ", // User selected
    description: "Exciting video reward!",
  },
  {
    id: "fun-video-7",
    title: "Fun Video Adventure 7",
    embedId: "BJHm_pUE7bs", // User selected
    description: "Wonderful video entertainment!",
  },
  {
    id: "fun-video-8",
    title: "Fun Video Adventure 8",
    embedId: "xgG2FMEF5yU", // User selected
    description: "Fantastic video surprise!",
  },
];

export default function VideoReward({ isOpen, onClose }: VideoRewardProps) {
  const [selectedVideo, setSelectedVideo] = useState(KIDS_VIDEOS[0]);
  const [watchTime, setWatchTime] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const maxWatchTime = 120; // 2 minutes limit for fun videos

  useEffect(() => {
    if (isOpen) {
      // Select a random video
      const randomVideo =
        KIDS_VIDEOS[Math.floor(Math.random() * KIDS_VIDEOS.length)];
      setSelectedVideo(randomVideo);
      setWatchTime(0);
      setVideoError(false); // Reset error state
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
          <h2>🎉 Amazing Work, Bianca! 🎉</h2>
          <p>You got 10 correct answers! Time for a fun video break!</p>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            {!videoError ? (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&iv_load_policy=3`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className={styles.video}
                onError={() => setVideoError(true)}
              />
            ) : (
              <div className={styles.videoError}>
                <div className={styles.errorIcon}>📺</div>
                <h3>Oops! Video not available</h3>
                <p>
                  Some videos can&apos;t be played in our app, but you&apos;ve
                  still earned your reward!
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.embedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.watchOnYouTube}
                >
                  🔗 Watch on YouTube
                </a>
              </div>
            )}
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
            {process.env.NODE_ENV === "development" && (
              <button
                className={styles.newVideoButton}
                onClick={() => {
                  const randomVideo =
                    KIDS_VIDEOS[Math.floor(Math.random() * KIDS_VIDEOS.length)];
                  setSelectedVideo(randomVideo);
                  setWatchTime(0);
                  setVideoError(false); // Reset error state
                }}
              >
                🎲 Random Video
              </button>
            )}
            <button className={styles.continueButton} onClick={handleClose}>
              Continue Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
