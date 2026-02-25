import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBlock } from 'antd-mobile'
import styles from './HotelListPage.module.css'
import Header from './Header/Header'
import QuickTagsBar from './QuickTagsBar/QuickTagsBar'
import SortBar from './SortBar/SortBar'
import type { SortType } from './SortBar/SortBar'
import HotelCard from './HotelCard/HotelCard'
import type { HotelListItem } from '../../types/hotel'
import { QUICK_TAGS } from '../../types/filtertag'
import { useHotelListData } from './hooks/useHotelListData'

function HotelListPage() {
  const navigate = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 使用自定义Hook获取数据和方法
  const {
    hotels,
    isLoading,
    isInitialLoading,
    hasMore,
    loadFirstPage,
    loadMoreHotels,
    location,
    keyword,
    formattedDateRange,
    roomCount,
    guestCount,
    setRoomCount,
    setGuestCount,
    selectedTags,
    setSelectedTags,
    allSelectedTags,
  } = useHotelListData();

  // 状态管理：排序筛选
  const [sortType, setSortType] = useState<SortType>('default')
  const [selectedPrice, setSelectedPrice] = useState('价格')
  const [selectedRating, setSelectedRating] = useState('星级')
  const [selectedScore, setSelectedScore] = useState('评分')
  const [isScrolled, setIsScrolled] = useState(false)

  // 滚动事件监听
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 滚动监听回调 - 移到 loadMoreHotels 之后定义
  const lastHotelRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreHotels()
      }
    })
    if (node) observerRef.current.observe(node)
  }, [isLoading, hasMore, loadMoreHotels])

  // 当过滤条件、排序或房间/客人数量变化时，重新加载第一页
  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage, roomCount, guestCount])

  // 处理快捷标签点击
  const handleTagClick = (tagValue: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagValue)
        ? prev.filter((tag) => tag !== tagValue)
        : [...prev, tagValue]
    )
  }

  // 处理查看酒店详情
  const handleViewDetail = (hotelId: string) => {
    navigate(`/detailpage?id=${hotelId}`)
  }

  const handleOpenFilter = () => {
    console.log('打开筛选面板');
  };

  // 处理日期变更
  const handleDateChange = (startDate: Date, endDate: Date) => {
    console.log('用户选择了新的日期:', startDate, endDate);
    
    const params = new URLSearchParams();
    if (location) params.set('city', location);
    if (keyword) params.set('keyword', keyword);
    params.set('roomCount', roomCount.toString());
    params.set('guestCount', guestCount.toString());
    
    const dates = [startDate.toISOString(), endDate.toISOString()];
    params.set('dates', JSON.stringify(dates));
    
    navigate(`/Hotellist?${params.toString()}`);
  };

  // 处理城市变更
  const handleCityChange = (city: string) => {
    console.log('用户选择了新的城市:', city);
    
    const params = new URLSearchParams();
    params.set('city', city);
    if (keyword) params.set('keyword', keyword);
    params.set('roomCount', roomCount.toString());
    params.set('guestCount', guestCount.toString());
    
    navigate(`/Hotellist?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      {/* 固定头部：Header */}
      <div className={styles.stickyHeader}>
        <Header 
          location={location}
          checkInDate={formattedDateRange}
          roomCount={roomCount ?? 1}
          guestCount={guestCount ?? 1}
          onRoomCountChange={setRoomCount}
          onGuestCountChange={setGuestCount}
          onOpenFilter={handleOpenFilter}
          onDateChange={handleDateChange}
          onCityChange={handleCityChange}
        />

        {/* 固定排序栏：SortBar */}
        <SortBar 
          currentSort={sortType} 
          onSortChange={setSortType}
          onFilterClick={handleOpenFilter}
          selectedPrice={selectedPrice}
          onPriceChange={setSelectedPrice}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          selectedScore={selectedScore}
          onScoreChange={setSelectedScore}
        />

        {/* 固定显示选中的标签 */}
        {selectedTags.length > 0 && (
          <div className={styles.selectedTagsContainer}>
            <QuickTagsBar
            tags={QUICK_TAGS.map(tag => ({ label: tag.name, value: tag.id }))}
            selectedTags={allSelectedTags}
            onTagClick={handleTagClick}
            showOnlySelected={true}
          />
          </div>
        )}
      </div>

      {/* 根据滚动状态显示标签：回到顶部时显示所有标签，滑动时只显示选中标签 */}
      <div className={styles.tagsContainer}>
        <QuickTagsBar
          tags={QUICK_TAGS.map(tag => ({ label: tag.name, value: tag.id }))}
          selectedTags={allSelectedTags}
          onTagClick={handleTagClick}
          showOnlySelected={isScrolled}
        />
      </div>

      {/* 酒店列表 */}
      <div className={styles.hotelList}>
        {isInitialLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>正在加载酒店...</div>
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className={styles.hotelGrid}>
              {hotels.map((hotel: HotelListItem, index) => (
                <div
                  key={hotel.id}
                  ref={index === hotels.length - 1 ? lastHotelRef : null}
                >
                  <HotelCard
                    hotel={hotel}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              ))}
            </div>
            {/* 加载更多状态 */}
            <div className={styles.loadMoreContainer}>
              {isLoading && (
                <div className={styles.loadingMore}>
                  <div className={styles.spinnerSmall}></div>
                  <span className={styles.loadingMoreText}>加载中...</span>
                </div>
              )}
              {!hasMore && !isLoading && (
                <div className={styles.noMoreText}>没有更多酒店了</div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <ErrorBlock description="没有找到匹配的酒店" />
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelListPage