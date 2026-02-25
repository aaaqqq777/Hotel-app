import { Button } from 'antd-mobile';
import styles from './RoomList.module.css';
import type { RoomType } from '../../../../types/hotel';
interface RoomListProps {
  rooms: RoomType[];
  onRoomSelect: (roomId: string) => void;
}

export default function RoomList({ rooms, onRoomSelect }: RoomListProps) {
  // 添加安全检查
  const safeRooms = Array.isArray(rooms) && rooms.length > 0 ? rooms : [];

  if (safeRooms.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>房型列表</h3>
        </div>
        <div className={styles.emptyState}>
          <p>暂无可用房型</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>房型列表</h3>
      </div>
      
      <div className={styles.roomList}>
        {safeRooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImage}>
              <img src={room.image} alt={room.name} />
              {room.price?.discount && (
                <div className={styles.discountBadge}>
                  {(room.price.discount * 10).toFixed(1)}折
                </div>
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
              
              <p className={styles.roomDescription}>{room.description || '优秀的房间'}</p>
              
              <div className={styles.roomFooter}>
                <div className={styles.priceInfo}>
                  <div className={styles.price}>
                    <span className={styles.priceSymbol}>¥</span>
                    <span className={styles.priceValue}>{room.price.current}</span>
                    <span className={styles.priceUnit}>起/晚</span>
                  </div>
                  {room.price.original && (
                    <div className={styles.originalPrice}>¥{room.price.original}</div>
                  )}
                </div>
                
                <Button 
                  className={styles.selectButton}
                  onClick={() => onRoomSelect(room.id)}
                >
                  选择
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}