import { Button } from 'antd-mobile';
import { useState, useEffect } from 'react';
import styles from './HotelReviews.module.css';

interface Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
  images?: string[];
}

interface HotelReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export default function HotelReviews({ rating, reviewCount, reviews }: HotelReviewsProps) {
  const [ratingData, setRatingData] = useState<{ star: number; percent: number }[]>([]);

  useEffect(() => {
    // 在 useEffect 中生成随机数据，避免在渲染过程中调用不纯函数
    const data = [5, 4, 3, 2, 1].map((star) => ({
      star,
      percent: Math.floor(Math.random() * 100)
    }));
    setRatingData(data);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>用户评价</h3>
        <Button className={styles.viewButton}>查看全部 {reviewCount} 条</Button>
      </div>
      
      <div className={styles.ratingSummary}>
        <div className={styles.ratingMain}>
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.ratingLabel}>分</span>
        </div>
        <div className={styles.ratingDetails}>
          {ratingData.map((item) => (
            <div key={item.star} className={styles.ratingItem}>
              <span className={styles.ratingStar}>{item.star}分</span>
              <div className={styles.ratingBar}>
                <div className={styles.ratingBarFill} style={{ width: `${item.percent}%` }} />
              </div>
              <span className={styles.ratingPercent}>{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span className={styles.userName}>{review.userName}</span>
              <span className={styles.reviewDate}>{review.date}</span>
              <div className={styles.reviewRating}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={`${styles.star} ${index < review.rating ? styles.active : ''}`}>★</span>
                ))}
              </div>
            </div>
            <p className={styles.reviewContent}>{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className={styles.reviewImages}>
                {review.images.map((image, index) => (
                  <img key={index} src={image} alt={`Review image ${index + 1}`} className={styles.reviewImage} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}