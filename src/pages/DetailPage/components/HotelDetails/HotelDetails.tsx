import { useState } from 'react';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { Tag, Popup } from 'antd-mobile';
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
  rating, 
  reviewCount, 
  address, 
  distance,
  tags
}: HotelDetailsProps) {
  // 酒店类型
  const hotelType = '舒适型';
  // 开业时间
  const openingDate = '2024年10月开业';
  // 评价等级
  const ratingLevel = '很棒';
  
  // 评价弹窗状态
  const [reviewPopupVisible, setReviewPopupVisible] = useState(false);

  return (
    <div className={styles.container}>
      {/* 酒店名称和类型 */}
      <div className={styles.header}>
        <h2 className={styles.hotelName}>{hotelName}</h2>
        <div className={styles.typeContainer}>
          <span className={styles.hotelType}>{hotelType}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.openingDate}>{openingDate}</span>
        </div>
      </div>

      {/* 酒店标签 */}
      <div className={styles.tagsContainer}>
        <Tag color="gold" className={styles.tag}>
          2.5倍积分
        </Tag>
        <Tag color="default" className={styles.tag}>
          免费停车
        </Tag>
        <Tag color="default" className={styles.tag}>
          自助洗衣
        </Tag>
        <Tag color="default" className={styles.tag}>
          早餐袋走
        </Tag>
        <div className={styles.facilitiesLink}>
          <a href="#">设施/详情 &gt;</a>
        </div>
      </div>

      {/* 评分和地址地图在同一行 */}
      <div className={styles.infoRow}>
        {/* 评分信息 */}
        <div className={styles.ratingContainer} onClick={() => setReviewPopupVisible(true)}>
          <div className={styles.ratingBox}>
            <span className={styles.ratingValue}>{rating}</span>
            <span className={styles.ratingLevel}>{ratingLevel}</span>
          </div>
          <div className={styles.ratingDesc}>
            <span>干净卫生，安静...</span>
          </div>
          <div className={styles.reviewCount}>{reviewCount}条评价 &gt;</div>
        </div>

        {/* 位置和地图 */}
        <div className={styles.locationContainer}>
          <div className={styles.distanceInfo}>
            <span className={styles.distanceText}>距上海新国际博览中心B</span>
            <span className={styles.distanceValue}>驾车{distance}，约...</span>
          </div>
          <div className={styles.addressInfo}>
            <span className={styles.addressText}>{address}</span>
            <span className={styles.copyIcon}>📋</span>
          </div>
          <div className={styles.mapLink}>
            <EnvironmentOutline className={styles.locationIcon} />
            <span className={styles.mapText}>地图</span>
          </div>
        </div>
      </div>

      {/* 打车按钮 */}
      <div className={styles.taxiButton}>
        <span className={styles.taxiIcon}>🚖</span>
        <span className={styles.taxiText}>打车</span>
      </div>

      {/* 评价详情弹窗 */}
      <Popup
        visible={reviewPopupVisible}
        onMaskClick={() => setReviewPopupVisible(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>评价详情</h3>
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            {/* 这里可以添加评价列表内容 */}
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