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
  const ratingLevel = hotel.rating >= 4.5 ? '很棒' : hotel.rating >= 4.0 ? '不错' : '一般'

  const displayTags = hotel.tags.slice(0, 3).map(tag => tagLabels[tag] || tag)

  return (
    <Card className={styles.card} onClick={() => onViewDetail(hotel.id)}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src={hotel.image} alt={hotel.name} className={styles.image} />
          {hotel.hasVideo && (
            <div className={styles.videoIcon}>
              <VideoOutline />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{hotel.name}</h3>
            <span className={styles.hotelType}>{hotel.hotelType}</span>
          </div>
          
          <div className={styles.ratingContainer}>
            <span className={styles.ratingScore}>{hotel.rating.toFixed(1)}</span>
            <span className={styles.ratingLevel}>{ratingLevel}</span>
            <span className={styles.reviewCount}>{hotel.reviewCount}条评价</span>
          </div>
          
          <div className={styles.location}>
            <EnvironmentOutline />
            <span>{hotel.locationInfo}</span>
          </div>
          
          {displayTags.length > 0 && (
            <div className={styles.tags}>
              {displayTags.map((tag, index) => (
                <Tag 
                  key={tag} 
                  color={index === 0 ? 'gold' : 'default'} 
                  className={styles.tag}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          
          <div className={styles.description}>
            <span className={styles.descriptionLink}>{hotel.description}</span>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <span className={styles.originalPrice}>¥{hotel.price}</span>
              <span className={styles.currency}>¥</span>
              <span className={styles.discountAmount}>{hotel.discountPrice}</span>
              <span className={styles.unit}>起</span>
            </div>
            <div className={styles.discountInfo}>
              <span className={styles.discountBadge}>{hotel.discountTag}</span>
              <span className={styles.discountText}>2项优惠{hotel.discountAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
