import { Card, Tag } from 'antd-mobile'
import { EnvironmentOutline, VideoOutline } from 'antd-mobile-icons'
import styles from './HotelCard.module.css'
import type { Hotel } from '../../../data/types'

interface HotelCardProps {
  hotel: Hotel
  onViewDetail: (hotelId: string) => void
}

const tagLabels: Record<string, string> = {
  family: '亲子酒店',
  luxury: '豪华酒店',
  parking: '免费停车',
  wifi: 'WiFi免费',
  breakfast: '有早餐',
  pool: '游泳池',
  laundry: '自助洗衣',
  points: '2.5倍积分',
}

export default function HotelCard({ hotel, onViewDetail }: HotelCardProps) {
  // 安全地处理评分信息
  const ratingLevel = !hotel.rating 
    ? '暂无评分' 
    : typeof hotel.rating === 'number' && !isNaN(hotel.rating)
      ? hotel.rating >= 4.5 ? '很棒' : hotel.rating >= 4.0 ? '不错' : '一般'
      : '暂无评分';

  // 安全地处理标签
  const displayTags = Array.isArray(hotel.tags) 
    ? hotel.tags.slice(0, 3).map(tag => tagLabels[tag] || tag)
    : [];

  // 安全地处理数值字段
  const price = typeof hotel.price === 'number' ? hotel.price : 0;
  const discountPrice = typeof hotel.discountPrice === 'number' ? hotel.discountPrice : 0;
  const discountAmount = typeof hotel.discountAmount === 'number' ? hotel.discountAmount : 0;
  const reviewCount = typeof hotel.reviewCount === 'number' ? hotel.reviewCount : 0;

  return (
    <Card className={styles.card} onClick={() => onViewDetail(hotel.id)}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img 
            src={hotel.image || '/placeholder-image.jpg'} 
            alt={hotel.name || '酒店图片'} 
            className={styles.image}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // 备用图片
            }} 
          />
          {hotel.hasVideo && (
            <div className={styles.videoIcon}>
              <VideoOutline />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{hotel.name || '酒店名称'}</h3>
            <span className={styles.hotelType}>{hotel.hotelType || ''}</span>
          </div>
          
          <div className={styles.ratingContainer}>
            <span className={styles.ratingScore}>
              {typeof hotel.rating === 'number' && !isNaN(hotel.rating) 
                ? hotel.rating.toFixed(1) 
                : '暂无评分'}
            </span>
            <span className={styles.ratingLevel}>{ratingLevel}</span>
            <span className={styles.reviewCount}>{reviewCount}条评价</span>
          </div>
          
          <div className={styles.location}>
            <EnvironmentOutline />
            <span>{hotel.locationInfo || hotel.location || '位置信息'}</span>
          </div>
          
          {displayTags.length > 0 && (
            <div className={styles.tags}>
              {displayTags.map((tag, index) => (
                <Tag 
                  key={`${tag}-${index}`} 
                  color={index === 0 ? 'gold' : 'default'} 
                  className={styles.tag}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          
          <div className={styles.description}>
            <span className={styles.descriptionLink}>{hotel.description || '酒店描述'}</span>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <span className={styles.originalPrice}>¥{price}</span>
              <span className={styles.currency}>¥</span>
              <span className={styles.discountAmount}>{discountPrice}</span>
              <span className={styles.unit}>起</span>
            </div>
            <div className={styles.discountInfo}>
              <span className={styles.discountBadge}>{hotel.discountTag || '优惠'}</span>
              <span className={styles.discountText}>2项优惠{discountAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
