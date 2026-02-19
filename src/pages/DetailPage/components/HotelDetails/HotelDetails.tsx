import { EnvironmentOutline, StarOutline } from 'antd-mobile-icons';
import styles from './HotelDetails.module.css';

interface Tag {
  icon: string;
  text: string;
}

interface HotelDetailsProps {
  hotelName: string;
  starRating: number;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  tags?: Tag[];
}

export default function HotelDetails({ 
  hotelName, 
  starRating, 
  rating, 
  reviewCount, 
  address, 
  distance, 
  tags 
}: HotelDetailsProps) {
  // 使用传入的标签或默认标签
  const hotelTags = tags || [
    { icon: '🏢', text: '2020年开业' },
    { icon: '🎨', text: '新中式风' },
    { icon: '🅿️', text: '免费停车' },
    { icon: '🌊', text: '一线江景' },
    { icon: '🍵', text: '江景下午茶' },
  ];

  return (
    <div className={styles.container}>
      {/* 酒店名称和星级 */}
      <div className={styles.header}>
        <h2 className={styles.hotelName}>{hotelName}</h2>
        <div className={styles.stars}>
          {Array.from({ length: starRating }).map((_, index) => (
            <StarOutline key={index} className={styles.star} />
          ))}
        </div>
      </div>

      {/* 酒店标签 */}
      <div className={styles.tagsContainer}>
        {hotelTags.map((tag, index) => (
          <div key={index} className={styles.tagItem}>
            <span className={styles.tagIcon}>{tag.icon}</span>
            <span className={styles.tagText}>{tag.text}</span>
          </div>
        ))}
      </div>

      {/* 评价和位置信息 */}
      <div className={styles.infoRow}>
        {/* 评价信息 */}
        <div className={styles.ratingContainer}>
          <div className={styles.ratingBox}>
            <span className={styles.ratingValue}>{rating}</span>
            <span className={styles.ratingLabel}>超棒</span>
            <span className={styles.reviewCount}>{reviewCount}条 &gt;</span>
          </div>
          <p className={styles.ratingDesc}>"中式风格装修，舒适安逸"</p>
        </div>

        {/* 位置信息 */}
        <div className={styles.locationContainer}>
          <EnvironmentOutline className={styles.locationIcon} />
          <div className={styles.locationInfo}>
            <span className={styles.distanceText}>{distance} | {address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}