import { useState, useMemo } from 'react'
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
      // 尝试解析JSON格式的标签参数
      searchTags = JSON.parse(tagsStr);
      // 确保解析结果是数组
      if (!Array.isArray(searchTags)) {
        searchTags = [];
      }
    } catch (error) {
      // 如果解析失败，尝试使用逗号分隔的方式
      searchTags = tagsStr ? tagsStr.split(',').filter(Boolean) : [];
    }
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
    // navigate(`/detailpage`)
  }

  const handleBackToSearch = () => {
    navigate('/')
  }

  const handleOpenFilter = () => {
    // 移除导航代码，因为SortBar组件已经内置了筛选面板
    console.log('打开筛选面板');
  };

  // 处理日期变更
  const handleDateChange = (startDate: Date, endDate: Date) => {
    console.log('用户选择了新的日期:', startDate, endDate);
    
    // 重新构造搜索参数
    const params = new URLSearchParams();
    if (location) params.set('city', location);
    if (keyword) params.set('keyword', keyword);
    if (tagsStr) params.set('tags', tagsStr);
    
    // 将新选择的日期转换为JSON字符串
    const dates = [startDate.toISOString(), endDate.toISOString()];
    params.set('dates', JSON.stringify(dates));
    
    // 重新导航到当前页面，带上新的日期参数
    navigate(`/Hotellist?${params.toString()}`);
  };

  // 处理城市变更
  const handleCityChange = (city: string) => {
    console.log('用户选择了新的城市:', city);
    
    // 重新构造搜索参数
    const params = new URLSearchParams();
    params.set('city', city);
    if (keyword) params.set('keyword', keyword);
    if (tagsStr) params.set('tags', tagsStr);
    if (datesStr) params.set('dates', datesStr);
    
    // 重新导航到当前页面，带上新的城市参数
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

      {/* 非固定显示未选中的标签 */}
      {selectedTags.length === 0 && (
        <div className={styles.tagsContainer}>
          <QuickTagsBar
            tags={QUICK_TAGS}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </div>
      )}

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
  )
}

export default HotelListPage