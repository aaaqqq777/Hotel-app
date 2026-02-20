import { useState, useRef, useEffect } from 'react';
import styles from './ImageSection.module.css';

interface ImageSectionProps {
  images: string[];
  videoUrl?: string;
}

export default function ImageSection({ images, videoUrl }: ImageSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number>(0);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  // 自动轮播功能
  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // 触摸开始时暂停自动轮播
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    
    if (diff > 50) {
      // 向左滑动
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -50) {
      // 向右滑动
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    // 触摸结束后重新开始自动轮播
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 2000);
    }
  };

  const handlePlayVideo = () => {
    console.log('Playing video:', videoUrl);
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${index === currentIndex ? styles.active : ''}`}
            style={{ transform: `translateX(${index * 100 - currentIndex * 100}%)` }}
          >
            <img src={image} alt={`Hotel image ${index + 1}`} className={styles.image} />
            {index === 0 && videoUrl && (
              <div
                className={styles.playButton}
                onClick={handlePlayVideo}
              >
                ▶
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.pagination}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.paginationDot} ${index === currentIndex ? styles.active : ''}`}
          />
        ))}
        <div className={styles.imageCount}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}