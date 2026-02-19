import { useState } from 'react';
import { Button } from 'antd-mobile';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';
import styles from './ImageSection.module.css';

interface ImageSectionProps {
  images: string[];
  videoUrl?: string;
}

export default function ImageSection({ images, videoUrl }: ImageSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePlayVideo = () => {
    console.log('Playing video:', videoUrl);
  };

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${index === currentIndex ? styles.active : ''}`}
            style={{ transform: `translateX(${index * 100 - currentIndex * 100}%)` }}
          >
            <img src={image} alt={`Hotel image ${index + 1}`} className={styles.image} />
            {index === 0 && videoUrl && (
              <Button
                className={styles.playButton}
                onClick={handlePlayVideo}
              >
                
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.controls}>
        <Button fill="none" onClick={handlePrev} className={styles.controlButton}>
          <LeftOutline />
        </Button>
        <Button fill="none" onClick={handleNext} className={styles.controlButton}>
          <RightOutline />
        </Button>
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