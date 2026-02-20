import { Card, Tag, Button } from 'antd-mobile'
import { StarFill, EnvironmentOutline } from 'antd-mobile-icons'
import styles from './HotelCard.module.css'
import type { Hotel } from '../../../data/types'

interface HotelCardProps {
  hotel: Hotel
  onViewDetail: (hotelId: string) => void
}

// 标签映射到中文
const tagLabels: Record<string, string> = {
  family: '亲子酒店',
  luxury: '豪华酒店',
  parking: '免费停车',
  wifi: 'WiFi免费',
  breakfast: '有早餐',
  pool: '游泳池',
}

export default function HotelCard({ hotel, onViewDetail }: HotelCardProps) {
  // 计算折扣价格（模拟）
  const discountPrice = Math.floor(hotel.price * 0.85);
  
  // 模拟评价数量
  const reviewCount = Math.floor(Math.random() * 5000) + 100;
  
  // 模拟评分（4.0-4.9之间）
  const rating = (4 + Math.random() * 0.9).toFixed(1);
  
  // 模拟评分等级
  const ratingLevel = Number(rating) >= 4.5 ? '很棒' : Number(rating) >= 4.0 ? '不错' : '一般';

  return (
    <Card className={styles.card} onClick={() => onViewDetail(hotel.id)}>
      <div className={styles.container}>
        {/* 左边：酒店图片 */}
        <div className={styles.imageContainer}>
          <img src={hotel.image} alt={hotel.name} className={styles.image} />
        </div>

        {/* 右边：酒店信息 */}
        <div className={styles.content}>
          {/* 酒店名称 */}
          <h3 className={styles.name}>{hotel.name}</h3>
          
          {/* 评分和评价数量 */}
          <div className={styles.ratingContainer}>
            <Tag color="primary" className={styles.ratingTag}>
              {rating} {ratingLevel}
            </Tag>
            <span className={styles.reviewCount}>{reviewCount}条评价</span>
          </div>
          
          {/* 位置信息 */}
          <div className={styles.location}>
            <EnvironmentOutline className={styles.icon} />
            <span>{hotel.location}</span>
          </div>
          
          {/* 标签 */}
          {hotel.tags.length > 0 && (
            <div className={styles.tags}>
              {hotel.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} color="default" className={styles.tag}>
                  {tagLabels[tag] || tag}
                </Tag>
              ))}
              {hotel.tags.length > 3 && (
                <Tag color="default" className={styles.tag}>
                  +{hotel.tags.length - 3}
                </Tag>
              )}
            </div>
          )}
          
          {/* 价格信息 */}
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <span className={styles.currency}>¥</span>
              <span className={styles.discountAmount}>{discountPrice}</span>
              <span className={styles.originalPrice}>¥{hotel.price}</span>
              <span className={styles.unit}>起</span>
            </div>
            <div className={styles.discountInfo}>
              <span className={styles.discountBadge}>立减券</span>
              <span className={styles.discountText}>2项优惠{Math.floor(hotel.price - discountPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
