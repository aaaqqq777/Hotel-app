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
  return (
    <Card className={styles.card}>
      {/* 酒店图片 */}
      <img src={hotel.image} alt={hotel.name} className={styles.image} />

      {/* 酒店信息 */}
      <div className={styles.content}>
        {/* 标题和星级 */}
        <div className={styles.header}>
          <h3 className={styles.name}>{hotel.name}</h3>
          <div className={styles.rating}>
            {Array.from({ length: hotel.starLevel }).map((_, i) => (
              <StarFill key={i} className={styles.star} />
            ))}
            <span className={styles.ratingText}>({hotel.starLevel}星)</span>
          </div>
        </div>

        {/* 位置 */}
        <div className={styles.location}>
          <EnvironmentOutline className={styles.icon} />
          <span>{hotel.location}</span>
        </div>

        {/* 描述 */}
        <p className={styles.description}>{hotel.description}</p>

        {/* 标签 */}
        {hotel.tags.length > 0 && (
          <div className={styles.tags}>
            {hotel.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} color="primary" className={styles.tag}>
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

        {/* 底部：价格和按钮 */}
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.currency}>¥</span>
            <span className={styles.amount}>{hotel.price}</span>
            <span className={styles.unit}>/晚</span>
          </div>
          <Button
            size="small"
            color="primary"
            onClick={() => onViewDetail(hotel.id)}
            className={styles.btn}
          >
            查看详情
          </Button>
        </div>
      </div>
    </Card>
  )
}
