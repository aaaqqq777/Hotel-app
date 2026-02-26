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
        {safeRooms.map((room) => {
          const remaining = room.availability?.remaining ?? 0;
          const isSoldOut = room.availability?.isSoldOut || remaining <= 0;
          const isTight = !isSoldOut && remaining > 0 && remaining <= 5;

          return (
            <div
              key={room.id}
              className={`${styles.roomCard} ${isSoldOut ? styles.roomCardDisabled : ''}`}
              onClick={() => !isSoldOut && onRoomSelect(room.id)}
            >
              {/* 左图 */}
              <div className={styles.roomImageWrap}>
                <img src={room.image} alt={room.name} className={styles.roomImage} />
                {isSoldOut && (
                  <div className={styles.soldOutOverlay}>已售罄</div>
                )}
              </div>

              {/* 右信息 */}
              <div className={styles.roomInfo}>
                <div className={styles.roomNameRow}>
                  <h4 className={styles.roomName}>{room.name}</h4>
                  {isTight && (
                    <span className={styles.tightTag}>仅剩{remaining}间</span>
                  )}
                </div>

                {/* 床型 面积 人数 */}
              <div className={styles.roomDesc}>
                {room.bedType && <span className={styles.descItem}>{room.bedType}</span>}
                {room.area > 0 && <span className={styles.descItem}>{room.area}m²</span>}
                {room.maxOccupancy && <span className={styles.descItem}>可{room.maxOccupancy}人入住</span>}
                {room.windowStatus && <span className={styles.descItem}>{room.windowStatus}</span>}
                {!room.bedType && !room.area && (
                  <span className={styles.descItem}>{room.description || '舒适房间'}</span>
                )}
              </div>

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

                  {/* 库存状态 */}
                  
                  <div className={styles.stockArea}>
                    
                    {isSoldOut ? (
                      <span className={styles.soldOutText}>已售罄</span>
                    ) : isTight ? (
                      <span className={styles.tightText}>房间紧张</span>
                    ) : (
                      <span className={styles.stockText}>剩余{remaining}间</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}