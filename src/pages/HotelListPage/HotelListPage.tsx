import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    hotels,
    isLoading,
    isInitialLoading,
    hasMore,
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
  } = useHotelListData()

  // ── 筛选状态：从 URL 初始化，返回后自动恢复 ──────────────────
  const [sortType, setSortType] = useState<SortType>(() => {
    const sortBy    = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy === 'price' && sortOrder === 'asc')  return 'price-asc'
    if (sortBy === 'price' && sortOrder === 'desc') return 'price-desc'
    if (sortBy === 'rating')                        return 'rating'
    return 'default'
  })

  const [selectedPrice, setSelectedPrice] = useState<string>(() => {
    const min = searchParams.get('minPrice')
    const max = searchParams.get('maxPrice')
    if (!min && !max)                     return '价格'
    if (min === '0'   && max === '300')   return '300以下'
    if (min === '300' && max === '500')   return '300-500'
    if (min === '500' && max === '99999') return '500以上'
    if (min && max)                       return `${min}-${max}`
    return '价格'
  })

  const [selectedRating, setSelectedRating] = useState<string>(() => {
    const star = searchParams.get('starLevels')
    const map: Record<string, string> = { '5': '5星', '4': '4星', '3': '3星及以下' }
    return map[star || ''] || '星级'
  })

  const [selectedScore, setSelectedScore] = useState<string>(() => {
    const score = searchParams.get('score')
    const map: Record<string, string> = {
      '4.8': '4.8分以上',
      '4.5': '4.5分以上',
      '4.0': '4.0分以上',
    }
    return map[score || ''] || '评分'
  })

  const [isScrolled, setIsScrolled] = useState(false)

  // ── 前端标签过滤 ──────────────────────────────────────────────
  // some：含任意一个选中标签即显示（宽松，推荐）
  // every：必须含所有选中标签才显示（严格）
  const filteredHotels = selectedTags.length === 0
    ? hotels
    : hotels.filter(hotel =>
        selectedTags.some(tag => hotel.tags?.includes(tag))
      )

  // ── 筛选/排序变化 → 写回 URL → 触发重新请求 ─────────────────
  const applyFilter = useCallback((updates: Record<string, string>) => {
    const sp = new URLSearchParams(window.location.search)
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== '全部') {
        sp.set(k, v)
      } else {
        sp.delete(k)
      }
    })
    navigate(`/hotellist?${sp.toString()}`, { replace: true })
  }, [navigate])

  const handleSortChange = (sort: SortType) => {
    setSortType(sort)
    const sortMap: Record<SortType, { sortBy: string; sortOrder: string }> = {
      'default':    { sortBy: '',       sortOrder: '' },
      'price-asc':  { sortBy: 'price',  sortOrder: 'asc' },
      'price-desc': { sortBy: 'price',  sortOrder: 'desc' },
      'rating':     { sortBy: 'rating', sortOrder: 'desc' },
    }
    applyFilter(sortMap[sort])
  }

  const handlePriceChange = (price: string) => {
    setSelectedPrice(price)
    const match = price.match(/^(\d+)-(\d+)$/)
    if (match) {
      applyFilter({ minPrice: match[1], maxPrice: match[2] })
    } else if (price === '300以下') {
      applyFilter({ minPrice: '0', maxPrice: '300' })
    } else if (price === '300-500') {
      applyFilter({ minPrice: '300', maxPrice: '500' })
    } else if (price === '500以上') {
      applyFilter({ minPrice: '500', maxPrice: '99999' })
    } else {
      applyFilter({ minPrice: '', maxPrice: '' })
    }
  }

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating)
    const starMap: Record<string, string> = {
      '5星': '5', '4星': '4', '3星及以下': '3', '全部': '',
    }
    applyFilter({ starLevels: starMap[rating] || '' })
  }

  const handleScoreChange = (score: string) => {
    setSelectedScore(score)
    const scoreMap: Record<string, string> = {
      '4.8分以上': '4.8', '4.5分以上': '4.5', '4.0分以上': '4.0', '全部': '',
    }
    applyFilter({ score: scoreMap[score] || '' })
  }

  // ── 快捷标签：纯前端过滤，不触发 API 请求 ───────────────────
  const handleTagClick = (tagValue: string) => {
    setSelectedTags(prev =>
      prev.includes(tagValue)
        ? prev.filter(t => t !== tagValue)
        : [...prev, tagValue]
    )
  }

  // ── 滚动监听 ──────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── 无限滚动：监听 filteredHotels 最后一个卡片 ───────────────
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

  const handleViewDetail = (hotelId: string) => {
    navigate(`/detailpage?id=${hotelId}`)
  }

  const handleOpenFilter = () => {
    console.log('打开筛选面板')
  }

  const handleDateChange = (startDate: Date, endDate: Date) => {
    const sp = new URLSearchParams(window.location.search)
    sp.set('checkInDate',  startDate.toISOString().split('T')[0])
    sp.set('checkOutDate', endDate.toISOString().split('T')[0])
    navigate(`/hotellist?${sp.toString()}`, { replace: true })
  }

  const handleCityChange = (city: string) => {
    const sp = new URLSearchParams(window.location.search)
    sp.set('city', city)
    navigate(`/hotellist?${sp.toString()}`, { replace: true })
  }

  return (
    <div className={styles.container}>
      {/* 固定头部 */}
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

        <SortBar
          currentSort={sortType}
          onSortChange={handleSortChange}
          onFilterClick={handleOpenFilter}
          selectedPrice={selectedPrice}
          onPriceChange={handlePriceChange}
          selectedRating={selectedRating}
          onRatingChange={handleRatingChange}
          selectedScore={selectedScore}
          onScoreChange={handleScoreChange}
        />

        {/* 有选中标签时固定展示在顶部 */}
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

      {/* 快捷标签栏：滚动后收起未选中的 */}
      <div className={styles.tagsContainer}>
        <QuickTagsBar
          tags={QUICK_TAGS.map(tag => ({ label: tag.name, value: tag.id }))}
          selectedTags={allSelectedTags}
          onTagClick={handleTagClick}
          showOnlySelected={isScrolled}
        />
      </div>

      {/* 酒店列表：使用 filteredHotels 渲染 */}
      <div className={styles.hotelList}>
        {isInitialLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>正在加载酒店...</div>
          </div>
        ) : filteredHotels.length > 0 ? (
          <>
            <div className={styles.hotelGrid}>
              {filteredHotels.map((hotel: HotelListItem, index) => (
                <div
                  key={hotel.id}
                  ref={index === filteredHotels.length - 1 ? lastHotelRef : null}
                >
                  <HotelCard
                    hotel={hotel}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              ))}
            </div>

            <div className={styles.loadMoreContainer}>
              {isLoading && (
                <div className={styles.loadingMore}>
                  <div className={styles.spinnerSmall}></div>
                  <span className={styles.loadingMoreText}>加载中...</span>
                </div>
              )}
              {/* 有标签过滤时不显示"没有更多"，后端可能还有未加载的数据 */}
              {!hasMore && !isLoading && selectedTags.length === 0 && (
                <div className={styles.noMoreText}>没有更多酒店了</div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <ErrorBlock
              description={
                selectedTags.length > 0
                  ? '没有符合该标签的酒店，试试其他标签？'
                  : '没有找到匹配的酒店'
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelListPage