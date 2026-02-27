import { Card, Tag } from 'antd-mobile'
import { EnvironmentOutline, VideoOutline } from 'antd-mobile-icons'
import styles from './HotelCard.module.css'
import type { HotelListItem as Hotel } from '../../../types/hotel'

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
  // console.log('HotelCard 渲染，酒店信息:', hotel);
  
  // 安全地处理评分信息
  const ratingLevel = !hotel.score 
    ? '暂无评分' 
    : typeof hotel.score === 'number' && !isNaN(hotel.score)
      ? hotel.score >= 4.5 ? '很棒' : hotel.score >= 4.0 ? '不错' : '一般'
      : '暂无评分';


  // 安全地处理标签
  const displayTags = Array.isArray(hotel.tags) 
    ? hotel.tags.slice(0, 3).map(tag => tagLabels[tag] || tag)
    : [];
  
  // 安全地处理数值字段
  const price = typeof hotel.price?.lowest === 'number' ? hotel.price.lowest : 0;
  const originalPrice = typeof hotel.price?.original === 'number' ? hotel.price.original : 0;
  const discount = typeof hotel.price?.discount === 'number' ? hotel.price.discount : 0;
  const reviewCount = typeof hotel.reviewCount === 'number' ? hotel.reviewCount : 0;

  return (
    <Card className={styles.card} onClick={() => onViewDetail(hotel.id)}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img 
            src={hotel.coverImage || '/placeholder-image.jpg'} 
            alt={hotel.name || '酒店图片'} 
            className={styles.image}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // 备用图片
            }} 
          />
          {/* 使用 images 数组的第一个图像或根据某种逻辑决定是否显示视频图标 */}
          {hotel.images && hotel.images.length > 0 && (
            <div className={styles.videoIcon}>
              <VideoOutline />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{hotel.name || '酒店名称'}</h3>
            <span className={styles.hotelType}>{hotel.starLevel >= 4 ? '豪华型' : hotel.starLevel >= 3 ? '舒适型' : '经济型'}</span>
          </div>
          
          <div className={styles.ratingContainer}>
            
            {ratingLevel !== '暂无评分' && (
              <span className={styles.ratingScore}>
              {/* {typeof hotel.score === 'number' && !isNaN(hotel.score) 
                ? hotel.score.toFixed(1) 
                : '暂无评分'} */}
                {hotel.score}
              </span>
            )}
            <span className={styles.ratingLevel}>{ratingLevel}</span>
            <span className={styles.reviewCount}>{reviewCount}条评价</span>
          </div>
          
          <div className={styles.location}>
            <EnvironmentOutline />
            <span>{hotel.location.address || '位置信息'}</span>
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
            <span className={styles.descriptionLink}>{hotel.name + "，提供优质住宿体验" || '酒店描述'}</span>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.price}>
              {originalPrice > price && (
                <span className={styles.originalPrice}>¥{originalPrice}</span>
              )}
              <span className={styles.currency}>¥</span>
              <span className={styles.discountAmount}>{price}</span>
              <span className={styles.unit}>起</span>
            </div>
            <div className={styles.discountInfo}>
              {discount > 0 ? (
                <span className={styles.discountBadge}>{Math.round(discount * 10)}折</span>
              ) : (
                <span className={styles.discountBadge}>{'优惠'}</span>
              )}
              <span className={styles.discountText}>立减优惠</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
