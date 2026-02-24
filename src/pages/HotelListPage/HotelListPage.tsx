import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ErrorBlock } from 'antd-mobile'
import styles from './HotelListPage.module.css'
import Header from './Header/Header'
import QuickTagsBar from './QuickTagsBar/QuickTagsBar'
import SortBar from './SortBar/SortBar'
import type { SortType } from './SortBar/SortBar'
import HotelCard from './HotelCard/HotelCard'
import type { Hotel } from '../../data/types'
import { QUICK_TAGS } from '../../data/hotels'
import { useInfiniteHotelList, type HotelListParams } from '../../hooks/useHotelQueries'

function HotelListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 状态管理：排序和快捷标签筛选
  const [sortType, setSortType] = useState<SortType>(() => {
    const param = searchParams.get('sort') || 'default'
    return param as SortType
  })
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagsParam = searchParams.get('tags') || '[]'
    try {
      return JSON.parse(tagsParam)
    } catch {
      return tagsParam.split(',').filter(Boolean)
    }
  })
  const [selectedPrice, setSelectedPrice] = useState(() => searchParams.get('price') || '价格')
  const [selectedRating, setSelectedRating] = useState(() => searchParams.get('rating') || '星级')
  const [selectedScore, setSelectedScore] = useState(() => searchParams.get('score') || '评分')
  const [isScrolled, setIsScrolled] = useState(false)

  // 解析价格范围
  const parsePriceRange = (priceStr: string) => {
    if (!priceStr || priceStr === '价格' || priceStr === '全部') {
      return { minPrice: undefined, maxPrice: undefined }
    }
    
    if (priceStr === '200以下') {
      return { minPrice: undefined, maxPrice: '200' }
    }
    if (priceStr === '200-500') {
      return { minPrice: '200', maxPrice: '500' }
    }
    if (priceStr === '500以上') {
      return { minPrice: '500', maxPrice: undefined }
    }
    
    const match = priceStr.match(/^(\d+)-(\d+)$/)
    if (match) {
      const min = parseInt(match[1])
      const max = parseInt(match[2])
      return {
        minPrice: min === 0 ? undefined : match[1],
        maxPrice: max === 99999 ? undefined : match[2]
      }
    }
    
    return { minPrice: undefined, maxPrice: undefined }
  }

  // 获取搜索参数
  const location = searchParams.get('city') || searchParams.get('location') || ''
  const keyword = searchParams.get('keyword') || ''
  const tagsStr = searchParams.get('tags') || ''
  const datesStr = searchParams.get('dates') || ''

  // 构建API参数
  const buildApiParams = useCallback((): HotelListParams => {
    const { minPrice, maxPrice } = parsePriceRange(selectedPrice)
    
    return {
      city: location || '上海',
      keyword: keyword || undefined,
      star: selectedRating !== '星级' ? selectedRating.replace(/\D/g, '') : undefined,
      sort: sortType === 'default' ? undefined : sortType,
      minPrice,
      maxPrice,
      page: '1',
      limit: '5',
    }
  }, [location, keyword, selectedPrice, selectedRating, sortType])

  // 使用无限查询获取酒店列表
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch } = useInfiniteHotelList(buildApiParams())
  
  // 将分页数据扁平化为单一数组
  const hotels = data?.pages?.flatMap(page => page.list) || []

  // 滚动事件监听
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 解析日期参数
  const formattedDateRange = useMemo(() => {
    if (!datesStr) return '';
    try {
      const dates = JSON.parse(datesStr);
      if (Array.isArray(dates) && dates.length === 2) {
        const checkIn = new Date(dates[0]);
        const checkOut = new Date(dates[1]);
        if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
          const formatDate = (date: Date) => {
            return `${date.getMonth() + 1}/${date.getDate()}`;
          };
          return `住${formatDate(checkIn)} 离${formatDate(checkOut)}`;
        }
      }
    } catch (error) {
      console.error('Failed to parse dates:', error);
    }
    return '';
  }, [datesStr]);





  // 滚动监听回调 - 检测是否到达底部，加载更多数据
  const lastHotelRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return
    
    if (node) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      
      observer.observe(node)
      
      return () => {
        observer.disconnect()
      }
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  // 当筛选条件变化时，更新URL参数并重新获取数据
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set('city', location);
    if (keyword) params.set('keyword', keyword);
    if (datesStr) params.set('dates', datesStr);
    if (selectedTags.length > 0) params.set('tags', JSON.stringify(selectedTags));
    if (sortType !== 'default') params.set('sort', sortType);
    if (selectedPrice !== '价格') params.set('price', selectedPrice);
    if (selectedRating !== '星级') params.set('rating', selectedRating);
    if (selectedScore !== '评分') params.set('score', selectedScore);
    
    // 只有当URL真正变化时才导航，避免无限循环
    const currentUrl = window.location.search;
    const newUrl = `?${params.toString()}`;
    if (currentUrl !== newUrl) {
      navigate(`/Hotellist${newUrl}`, { replace: true }); // 使用 replace 避免历史记录堆积
    }
    
    // 同时重新获取数据
    refetch()
  }, [location, keyword, datesStr, selectedTags, sortType, selectedPrice, selectedRating, selectedScore, navigate, refetch])

  // 处理快捷标签点击
  const handleTagClick = (tagValue: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagValue)
        ? prev.filter((tag) => tag !== tagValue)
        : [...prev, tagValue]
    );
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
    
    // 更新 datesStr 状态，这将通过 useEffect 触发 URL 更新
    const dates = [startDate.toISOString(), endDate.toISOString()];
    const params = new URLSearchParams(window.location.search);
    params.set('dates', JSON.stringify(dates));
    navigate(`/Hotellist?${params.toString()}`, { replace: true });
  };

  // 处理城市变更
  const handleCityChange = (city: string) => {
    console.log('用户选择了新的城市:', city);
    
    const params = new URLSearchParams();
    params.set('city', city);
    if (keyword) params.set('keyword', keyword);
    if (tagsStr) params.set('tags', tagsStr);
    if (datesStr) params.set('dates', datesStr);
    
    navigate(`/Hotellist?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      {/* 固定头部：Header */}
      <div className={styles.stickyHeader}>
        <Header 
          location={location}
          checkInDate={formattedDateRange}
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
              tags={QUICK_TAGS}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
              showOnlySelected={true}
            />
          </div>
        )}
      </div>

      {/* 根据滚动状态显示标签：回到顶部时显示所有标签，滑动时只显示选中标签 */}
      <div className={styles.tagsContainer}>
        <QuickTagsBar
          tags={QUICK_TAGS}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          showOnlySelected={isScrolled}
        />
      </div>

      {/* 酒店列表 */}
      <div className={styles.hotelList}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>正在加载酒店...</div>
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className={styles.hotelGrid}>
                {hotels.map((hotel: Hotel, index) => (
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
                {isFetchingNextPage && (
                  <div className={styles.loadingMore}>
                    <div className={styles.spinnerSmall}></div>
                    <span className={styles.loadingMoreText}>加载中...</span>
                  </div>
                )}
                {!hasNextPage && !isFetchingNextPage && (
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
