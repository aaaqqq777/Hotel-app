import { Button } from 'antd-mobile';
import styles from './RoomList.module.css';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  tags?: string[];
  availability?: number;
  maxOccupancy?: number;
  area?: number;
}

interface RoomListProps {
  rooms: Room[];
  onRoomSelect: (roomId: string) => void;
}

export default function RoomList({ rooms, onRoomSelect }: RoomListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>房型列表</h3>
      </div>
      
      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImage}>
              <img src={room.image} alt={room.name} />
              {room.discount && (
                <div className={styles.discountBadge}>{room.discount}折</div>
              )}
            </div>
            
            <div className={styles.roomInfo}>
              <div className={styles.roomHeader}>
                <h4 className={styles.roomName}>{room.name}</h4>
                {room.tags && room.tags.length > 0 && (
                  <div className={styles.roomTags}>
                    {room.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <p className={styles.roomDescription}>{room.description}</p>
              
              <div className={styles.roomFooter}>
                <div className={styles.priceInfo}>
                  <div className={styles.price}>
                    <span className={styles.priceSymbol}>¥</span>
                    <span className={styles.priceValue}>{room.price}</span>
                    <span className={styles.priceUnit}>起/晚</span>
                  </div>
                  {room.originalPrice && (
                    <div className={styles.originalPrice}>¥{room.originalPrice}</div>
                  )}
                  {room.availability !== undefined && (
                    <div className={styles.availability}>
                      {room.availability > 5 ? (
                        <span className={styles.availabilityHigh}>余房充足</span>
                      ) : room.availability > 0 ? (
                        <span className={styles.availabilityLow}>仅剩{room.availability}间</span>
                      ) : (
                        <span className={styles.availabilityNone}>暂无房</span>
                      )}
                    </div>
                  )}
                </div>
                
                <Button 
                  className={styles.selectButton}
                  onClick={() => onRoomSelect(room.id)}
                  disabled={room.availability === 0}
                >
                  {room.availability === 0 ? '暂无房' : '选择'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}