import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Empty } from 'antd-mobile'
import styles from './HotelListPage.module.css'
import Header from './Header/Header'
import QuickTagsBar from './QuickTagsBar/QuickTagsBar'
import SortBar from './SortBar/SortBar'
import type { SortType } from './SortBar/SortBar'
import HotelCard from './HotelCard/HotelCard'
import type { Hotel } from '../../data/types'
import { QUICK_TAGS } from '../../data/hotels'
import { searchHotelList, type HotelListResponse, type HotelListParams } from '../../api/hotelsearch/hotelsearch'

function HotelListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 状态管理：排序和快捷标签筛选
  const [sortType, setSortType] = useState<SortType>('default')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState('价格')
  const [selectedRating, setSelectedRating] = useState('星级')
  const [selectedScore, setSelectedScore] = useState('评分')
  const [isScrolled, setIsScrolled] = useState(false)

  // 分页相关状态
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [pageSize] = useState(5)

  // 滚动事件监听
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 获取搜索参数
  const location = searchParams.get('city') || searchParams.get('location') || ''
  const keyword = searchParams.get('keyword') || ''
  const tagsStr = searchParams.get('tags') || ''
  const datesStr = searchParams.get('dates') || ''

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

  // 合并搜索参数中的标签和用户选中的快捷标签
  const allSelectedTags = useMemo(() => {
    let searchTags: string[] = [];
    try {
      searchTags = JSON.parse(tagsStr);
      if (!Array.isArray(searchTags)) {
        searchTags = [];
      }
    } catch (error) {
      searchTags = tagsStr ? tagsStr.split(',').filter(Boolean) : [];
    }
    return [...new Set([...searchTags, ...selectedTags])]
  }, [tagsStr, selectedTags])

  // 过滤参数
  const filterParams = useMemo(() => ({
    keyword,
    starLevel: selectedRating === '全部' ? '' : selectedRating,
    priceRange: selectedPrice === '全部' ? '' : selectedPrice,
    tags: allSelectedTags,
  }), [keyword, selectedRating, selectedPrice, allSelectedTags])

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

  // 重置并加载第一页数据
  const loadFirstPage = useCallback(async () => {
    setIsLoading(true)
    setIsInitialLoading(true)
    try {
      const { minPrice, maxPrice } = parsePriceRange(selectedPrice)
      
      const apiParams: HotelListParams = {
        city: location || '上海',
        keyword: keyword || undefined,
        star: selectedRating !== '星级' ? selectedRating.replace(/\D/g, '') : undefined,
        sort: sortType === 'default' ? undefined : sortType,
        minPrice,
        maxPrice,
        page: '1',
        limit: pageSize.toString(),
      }
      
      const response: HotelListResponse = await searchHotelList(apiParams)
      
      const hotelList: Hotel[] = response.data.list.map(item => ({
        id: item._id,
        name: item.name_cn,
        imageUrl: item.cover_image,
        price: item.min_price,
        rating: item.score,
        location: item.location?.address || item.location?.district || '',
        starLevel: item.star_rating,
        reviewCount: 100,
        distance: '距离市中心3公里',
        mapUrl: ''
      }))
      
      setHotels(hotelList)
      setCurrentPage(parseInt(apiParams.page || '1'))
      setHasMore(response.data.list.length + (parseInt(apiParams.page || '1') - 1) * parseInt(apiParams.limit || '10') < response.data.total)
    } catch (error) {
      console.error('Failed to load hotels:', error)
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }, [location, keyword, sortType, pageSize, selectedRating, selectedPrice])

  // 加载更多数据
  const loadMoreHotels = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const { minPrice, maxPrice } = parsePriceRange(selectedPrice)
      
      const apiParams: HotelListParams = {
        city: location || '上海',
        keyword: keyword || undefined,
        star: selectedRating !== '星级' ? selectedRating.replace(/\D/g, '') : undefined,
        sort: sortType === 'default' ? undefined : sortType,
        minPrice,
        maxPrice,
        page: (currentPage + 1).toString(),
        limit: pageSize.toString(),
      }
      
      const response: HotelListResponse = await searchHotelList(apiParams)
      
      const hotelList: Hotel[] = response.data.list.map(item => ({
        id: item._id,
        name: item.name_cn,
        imageUrl: item.cover_image,
        price: item.min_price,
        rating: item.score,
        location: item.location?.address || item.location?.district || '',
        starLevel: item.star_rating,
        reviewCount: 100,
        distance: '距离市中心3公里',
        mapUrl: ''
      }))
      
      setHotels(prev => [...prev, ...hotelList])
      setCurrentPage(parseInt(apiParams.page || '1'))
      setHasMore(response.data.list.length + (parseInt(apiParams.page || '1') - 1) * parseInt(apiParams.limit || '10') < response.data.total)
    } catch (error) {
      console.error('Failed to load more hotels:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, location, keyword, sortType, currentPage, pageSize, selectedRating, selectedPrice])

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

  // 当过滤条件或排序变化时，重新加载第一页
  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

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
    if (tagsStr) params.set('tags', tagsStr);
    
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
        {isInitialLoading ? (
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
            <Empty description="没有找到匹配的酒店" />
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelListPage
