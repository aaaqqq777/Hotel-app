import { useState, useRef, useEffect } from 'react';
import styles from './ImageSection.module.css';

interface ImageSectionProps {
  images: string[];
  videoUrl?: string;
}

export default function ImageSection({ images, videoUrl }: ImageSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -50) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 2000);
    }
  };

  const handlePlayVideo = () => {
    console.log('Playing video:', videoUrl);
  };

  // 无图片时显示占位
  if (!images || images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          {/* <span className={styles.placeholderIcon}>🏨</span> */}
          <span className={styles.placeholderText}>暂无酒店图片</span>
        </div>
      </div>
    );
  }

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
            className={styles.carouselItem}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          >
            <img src={image} alt={`Hotel image ${index + 1}`} className={styles.image} />
            {index === 0 && videoUrl && (
              <div className={styles.playButton} onClick={handlePlayVideo}>
                ▶
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 分页指示器 */}
      {images.length > 1 && (
        <div className={styles.pagination}>
          {images.map((_, index) => (
            <div
              key={index}
              className={`${styles.paginationDot} ${index === currentIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      )}

      {/* 图片计数 */}
      <div className={styles.imageCount}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}