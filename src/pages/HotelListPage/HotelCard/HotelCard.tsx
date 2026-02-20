import { Card, Tag } from 'antd-mobile'
import { StarFill, EnvironmentOutline, VideoOutline } from 'antd-mobile-icons'
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
  laundry: '自助洗衣',
  points: '2.5倍积分',
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

  // 模拟酒店类型
  const hotelType = '舒适型';

  // 模拟位置信息
  const locationInfo = '浦江镇地区 | 近上海新国际博览中心B';

  // 模拟酒店描述
  const hotelDescription = '新品全季-近东方体育中心、世博、迪士尼';

  return (
    <Card className={styles.card} onClick={() => onViewDetail(hotel.id)}>
      <div className={styles.container}>
        {/* 左边：酒店图片 */}
        <div className={styles.imageContainer}>
          <img src={hotel.image} alt={hotel.name} className={styles.image} />
          {/* 视频图标 */}
          <div className={styles.videoIcon}>
            <VideoOutline />
          </div>
        </div>

        {/* 右边：酒店信息 */}
        <div className={styles.content}>
          {/* 酒店名称和类型 */}
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{hotel.name}</h3>
            <span className={styles.hotelType}>{hotelType}</span>
          </div>
          
          {/* 评分和评价数量 */}
          <div className={styles.ratingContainer}>
            <span className={styles.ratingScore}>{rating}</span>
            <span className={styles.ratingLevel}>{ratingLevel}</span>
            <span className={styles.reviewCount}>{reviewCount}条评价</span>
          </div>
          
          {/* 位置信息 */}
          <div className={styles.location}>
            <span>{locationInfo}</span>
          </div>
          
          {/* 标签 */}
          <div className={styles.tags}>
            <Tag color="gold" className={styles.tag}>
              2.5倍积分
            </Tag>
            <Tag color="default" className={styles.tag}>
              免费停车
            </Tag>
            <Tag color="default" className={styles.tag}>
              自助洗衣
            </Tag>
          </div>
          
          {/* 酒店描述链接 */}
          <div className={styles.description}>
            <a href="#" className={styles.descriptionLink}>{hotelDescription}</a>
          </div>

          {/* 价格信息 */}
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <span className={styles.originalPrice}>¥{hotel.price}</span>
              <span className={styles.currency}>¥</span>
              <span className={styles.discountAmount}>{discountPrice}</span>
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
