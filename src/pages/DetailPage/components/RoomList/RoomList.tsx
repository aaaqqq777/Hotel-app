import styles from './RoomList.module.css';
import type { RoomType } from '../../../../types/hotel';

interface RoomListProps {
  rooms: RoomType[];
  onRoomSelect: (roomId: string) => void;
}

export default function RoomList({ rooms, onRoomSelect }: RoomListProps) {
  const safeRooms = Array.isArray(rooms) && rooms.length > 0 ? rooms : [];

  if (safeRooms.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>房型列表</h3>
        <div className={styles.emptyState}>暂无可用房型</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>房型列表</h3>

      <div className={styles.roomList}>
        {safeRooms.map((room) => (
          <div key={room.id} className={styles.roomCard} onClick={() => onRoomSelect(room.id)}>
            {/* 左图 */}
            <div className={styles.roomImage}>
              <img src={room.image} alt={room.name} />
            </div>

            {/* 右信息 */}
            <div className={styles.roomInfo}>
              <h4 className={styles.roomName}>{room.name}</h4>

              <p className={styles.roomDesc}>{room.description || '舒适房间'}</p>

              {room.tags && room.tags.length > 0 && (
                <div className={styles.roomTags}>
                  {room.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}

              <div className={styles.roomFooter}>
                <div className={styles.priceArea}>
                  {room.price.original && (
                    <span className={styles.originalPrice}>¥{room.price.original}</span>
                  )}
                  <div className={styles.currentPrice}>
                    <span className={styles.priceSymbol}>¥</span>
                    <span className={styles.priceValue}>{room.price.current}</span>
                    <span className={styles.priceUnit}>起</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}