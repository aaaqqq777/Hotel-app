import { useState } from 'react';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { Popup } from 'antd-mobile';
import styles from './HotelDetails.module.css';

interface HotelDetailsProps {
  hotelName: string;
  starRating: number;
  rating: number | undefined;
  reviewCount: number;
  address: string;
  distance: string;
  tags?: { icon: string; text: string }[];
}

export default function HotelDetails({
  hotelName,
  starRating,
  rating,
  reviewCount,
  address,
  distance,
  tags,
}: HotelDetailsProps) {
  const hotelType = '舒适型';
  const openingDate = '2024年10月开业';

  const getRatingLevel = (r: number | undefined) => {
    if (!r || r === 0) return '暂无评分';
    if (r >= 4.5) return '超棒';
    if (r >= 4.0) return '很棒';
    if (r >= 3.5) return '不错';
    return '尚可';
  };
  const ratingLevel = getRatingLevel(rating);
  const [reviewPopupVisible, setReviewPopupVisible] = useState(false);

  const renderStars = (level: number) =>
    '★'.repeat(Math.min(level, 5)) + '☆'.repeat(Math.max(5 - level, 0));

  return (
    <div className={styles.container}>
      {/* 酒店名称 + 星级 */}
      <div className={styles.header}>
        <div className={styles.nameRow}>
          <h2 className={styles.hotelName}>{hotelName}</h2>
          {starRating > 0 && (
            <span className={styles.stars}>{renderStars(starRating)}</span>
          )}
        </div>
        <div className={styles.typeRow}>
          <span className={styles.hotelType}>{hotelType}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.openingDate}>{openingDate}</span>
        </div>
      </div>

      {/* 设施标签横滑 */}
      {tags && tags.length > 0 && (
        <div className={styles.facilityScroll}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.facilityItem}>
              <span className={styles.facilityIcon}>{tag.icon}</span>
              <span className={styles.facilityText}>{tag.text}</span>
            </div>
          ))}
          <div className={styles.facilityItem}>
            <span className={styles.facilityIcon}>📋</span>
            <span className={styles.facilityLink}>设施政策</span>
          </div>
        </div>
      )}

      {/* 评分 + 位置 */}
      <div className={styles.infoRow}>
        <div className={styles.ratingCard} onClick={() => setReviewPopupVisible(true)}>
          <div className={styles.ratingTop}>
            <span className={styles.ratingValue}>{rating || '0.0'}</span>
            <span className={styles.ratingLevel}>{ratingLevel}</span>
          </div>
          <div className={styles.ratingMeta}>{reviewCount}条 &gt;</div>
          <div className={styles.ratingDesc}>"干净卫生，安静舒适"</div>
        </div>

        <div className={styles.locationCard}>
          <div className={styles.locationRow}>
            <span className={styles.locationLabel}>距上海新国际博览中心B</span>
          </div>
          <div className={styles.locationRow}>
            <span className={styles.locationMeta}>驾车{distance || '—'}，约...</span>
          </div>
          <div className={styles.addressRow}>
            <span className={styles.addressText}>{address}</span>
            <span className={styles.copyBtn}>📋</span>
          </div>
          <div className={styles.mapRow}>
            <EnvironmentOutline className={styles.mapIcon} />
            <span className={styles.mapText}>地图</span>
          </div>
        </div>
      </div>

      

      {/* 评价弹窗 */}
      <Popup
        visible={reviewPopupVisible}
        onMaskClick={() => setReviewPopupVisible(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>评价详情</h3>
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4>总体评分</h4>
              <p>{rating} ({ratingLevel})</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4>评价数量</h4>
              <p>{reviewCount}条评价</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4>评价标签</h4>
              <p>干净卫生，安静，服务好，位置便利</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4>用户评价</h4>
              <p>酒店环境很好，服务态度也很棒，房间干净整洁，交通便利，下次还会再来。</p>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}