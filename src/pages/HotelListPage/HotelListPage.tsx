import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Empty } from 'antd-mobile'
import styles from './HotelListPage.module.css'
import FliterBar from './FliterBar/FilterBar'
import QuickTagsBar from './QuickTagsBar/QuickTagsBar'
import SortBar from './SortBar/SortBar'
import type { SortType } from './SortBar/SortBar'
import HotelCard from './HotelCard/HotelCard'
import type { Hotel } from '../../data/types'
import { QUICK_TAGS } from '../../data/hotels'
import { getProcessedHotels } from '../../services/hotelService'

function HotelListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 状态管理：排序和快捷标签筛选
  const [sortType, setSortType] = useState<SortType>('default')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState('价格')
  const [selectedRating, setSelectedRating] = useState('星级')
  const [selectedScore, setSelectedScore] = useState('评分')

  // 获取搜索参数
  const location = searchParams.get('location') || ''
  const keyword = searchParams.get('keyword') || ''
  const tagsStr = searchParams.get('tags') || ''

  // 合并搜索参数中的标签和用户选中的快捷标签
  const allSelectedTags = useMemo(() => {
    const searchTags = tagsStr ? tagsStr.split(',').filter(Boolean) : []
    return [...new Set([...searchTags, ...selectedTags])]
  }, [tagsStr, selectedTags])

  // 使用 useMemo 优化：依赖参数变化时重新计算处理后的酒店列表
  const processedHotels = useMemo(() => {
    const filterParams = {
      keyword,
      starLevel: selectedRating === '全部' ? '' : selectedRating,
      priceRange: selectedPrice === '全部' ? '' : selectedPrice,
      tags: allSelectedTags,
    }
    return getProcessedHotels(filterParams, sortType)
  }, [keyword, selectedRating, selectedPrice, allSelectedTags, sortType])

  // 处理快捷标签点击

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

  const handleBackToSearch = () => {
    navigate('/')
  }

  const handleOpenFilter = () => {
    navigate('/Hotellist')//TODO: 这里应该跳转到一个真正的筛选页，目前先占位
  }

  return (
    <div className={styles.container}>
      {/* 搜索条件显示 */}
      <div className={styles.searchInfo}>
        <FliterBar 
          location={location}
          checkInDate={searchParams.get('checkIn') || ''}
          onOpenFilter={handleOpenFilter} 
        />

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
        {/* 快捷筛选标签 */}
        <QuickTagsBar
            tags={QUICK_TAGS}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
        />

       

        {/* 酒店列表 */}
        <div className={styles.hotelList}>
            {processedHotels.length > 0 ? (
            <div className={styles.hotelGrid}>
                {processedHotels.map((hotel: Hotel) => (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onViewDetail={handleViewDetail}
                />
                ))}
            </div>
            ) : (
            <div className={styles.emptyState}>
                <Empty description="没有找到匹配的酒店" />
            </div>
            )}
        </div>
    </div>
    </div>
  )
}

export default HotelListPage