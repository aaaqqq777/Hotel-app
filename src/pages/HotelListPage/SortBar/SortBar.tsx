import { useState } from 'react'
import { DownOutline } from 'antd-mobile-icons'
import styles from './SortBar.module.css'
import { Popup } from 'antd-mobile'

export type SortType = 'price-asc' | 'price-desc' | 'rating' | 'default'

interface SortBarProps {
  currentSort: SortType
  onSortChange: (sort: SortType) => void
  onFilterClick?: () => void
  selectedPrice?: string
  onPriceChange?: (price: string) => void
  selectedRating?: string
  onRatingChange?: (rating: string) => void
  selectedScore?: string
  onScoreChange?: (score: string) => void
}

const sortOptions = [
  { label: '推荐排序', value: 'default' as SortType },
  { label: '价格低到高', value: 'price-asc' as SortType },
  { label: '价格高到低', value: 'price-desc' as SortType },
  { label: '评分从高到低', value: 'rating' as SortType },
]

const ratingOptions = ['全部', '5星', '4星', '3星及以下']
const priceRangeOptions = ['全部', '300以下', '300-500', '500以上']
const scoreOptions = ['全部', '4.8分以上', '4.5分以上', '4.0分以上']
const distanceOptions = ['全部', '1公里内', '3公里内', '5公里内', '10公里内']

export default function SortBar({ 
  currentSort, 
  onSortChange, 
  selectedPrice = '价格',
  onPriceChange,
  selectedRating = '星级',
  onRatingChange,
  selectedScore = '评分',
  onScoreChange
}: SortBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [customPriceMin, setCustomPriceMin] = useState<string>('')
  const [customPriceMax, setCustomPriceMax] = useState<string>('')
  
  const [tempRating, setTempRating] = useState<string>(selectedRating)
  const [tempPrice, setTempPrice] = useState<string>(selectedPrice)
  const [tempScore, setTempScore] = useState<string>(selectedScore)
  const [tempCustomPriceMin, setTempCustomPriceMin] = useState<string>('')
  const [tempCustomPriceMax, setTempCustomPriceMax] = useState<string>('')

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || '推荐排序'

  const getPriceDisplayLabel = (price: string) => {
    if (!price || price === '价格') return '价格'
    if (priceRangeOptions.includes(price)) return price
    
    const match = price.match(/^(\d+)-(\d+)$/)
    if (match) {
      const min = parseInt(match[1])
      const max = parseInt(match[2])
      
      if (min === 0 && max === 99999) {
        return '全部'
      } else if (min === 0) {
        return `${max}以下`
      } else if (max === 99999) {
        return `${min}以上`
      } else {
        return `${min}-${max}`
      }
    }
    
    return '价格'
  }

  const handleSortSelect = (value: SortType) => {
    onSortChange(value)
    setOpenMenu(null)
  }

  const handleOptionSelect = (value: string, type: 'price' | 'rating' | 'score' | 'distance') => {
    if (type === 'price') {
      onPriceChange?.(value)
    }
    if (type === 'rating') onRatingChange?.(value)
    if (type === 'score') onScoreChange?.(value)
    setOpenMenu(null)
  }

  const handleCustomPriceApply = () => {
    const min = customPriceMin ? parseInt(customPriceMin) : 0
    const max = customPriceMax ? parseInt(customPriceMax) : 99999
    if (min > max) {
      return
    }
    const customPriceStr = `${min}-${max}`
    onPriceChange?.(customPriceStr)
    setOpenMenu(null)
    setFilterVisible(false)
  }

  const handleFilterClick = () => {
    setTempRating(selectedRating)
    setTempPrice(selectedPrice)
    setTempScore(selectedScore)
    setTempCustomPriceMin('')
    setTempCustomPriceMax('')
    setFilterVisible(true)
  };

  const handleFilterClose = () => {
    setFilterVisible(false)
  }

  const handleFilterConfirm = () => {
    let finalPrice = tempPrice
    
    if (tempCustomPriceMin || tempCustomPriceMax) {
      const min = tempCustomPriceMin ? parseInt(tempCustomPriceMin) : 0
      const max = tempCustomPriceMax ? parseInt(tempCustomPriceMax) : 99999
      if (min <= max) {
        finalPrice = `${min}-${max}`
      }
    }
    
    onRatingChange?.(tempRating)
    onPriceChange?.(finalPrice)
    onScoreChange?.(tempScore)
    setFilterVisible(false)
  }

  const DropdownButton = ({ 
    label, 
    menuKey, 
    options, 
    onSelect, 
  }: {
    label: string
    menuKey: string
    options: any[]
    onSelect: (value: string) => void
  }) => (
    <div className={styles.dropdownWrapper}>
      <button
        className={styles.dropdownBtn}
        onClick={() => setOpenMenu(openMenu === menuKey ? null : menuKey)}
      >
        <span className={styles.btnText}>{label}</span>
        <DownOutline className={styles.downIcon} />
      </button>

      {openMenu === menuKey && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt}
              className={styles.dropdownItem}
              onClick={() => onSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        {/* 推荐排序 */}
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
          >
            <span className={styles.btnText}>{currentLabel}</span>
            <DownOutline className={styles.downIcon} />
          </button>

          {openMenu === 'sort' && (
            <div className={styles.dropdown}>
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={styles.dropdownItem}
                  onClick={() => handleSortSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 品牌价格 */}
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setOpenMenu(openMenu === 'price' ? null : 'price')}
          >
            <span className={styles.btnText}>{getPriceDisplayLabel(selectedPrice)}</span>
            <DownOutline className={styles.downIcon} />
          </button>

          {openMenu === 'price' && (
            <div className={styles.dropdown}>
              {priceRangeOptions.map((opt) => (
                <div
                  key={opt}
                  className={styles.dropdownItem}
                  onClick={() => handleOptionSelect(opt, 'price')}
                >
                  {opt}
                </div>
              ))}
              
              <div className={styles.customPriceInput}>
                <div className={styles.customPriceRow}>
                  <input
                    type="number"
                    placeholder="最低价"
                    value={customPriceMin}
                    onChange={(e) => setCustomPriceMin(e.target.value)}
                    className={styles.customPriceInputField}
                  />
                  <span className={styles.customPriceSeparator}>-</span>
                  <input
                    type="number"
                    placeholder="最高价"
                    value={customPriceMax}
                    onChange={(e) => setCustomPriceMax(e.target.value)}
                    className={styles.customPriceInputField}
                  />
                </div>
                <button 
                  className={styles.customPriceApply}
                  onClick={handleCustomPriceApply}
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 星级筛选
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setOpenMenu(openMenu === 'rating' ? null : 'rating')}
          >
            <span className={styles.btnText}>{selectedRating}</span>
            <DownOutline className={styles.downIcon} />
          </button>

          {openMenu === 'rating' && (
            <div className={styles.dropdown}>
              {ratingOptions.map((opt) => (
                <div
                  key={opt}
                  className={styles.dropdownItem}
                  onClick={() => handleOptionSelect(opt, 'rating')}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 评分筛选 
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setOpenMenu(openMenu === 'score' ? null : 'score')}
          >
            <span className={styles.btnText}>{selectedScore}</span>
            <DownOutline className={styles.downIcon} />
          </button>

          {openMenu === 'score' && (
            <div className={styles.dropdown}>
              {scoreOptions.map((opt) => (
                <div
                  key={opt}
                  className={styles.dropdownItem}
                  onClick={() => handleOptionSelect(opt, 'score')}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* 位置距离 */}
        <DropdownButton
          label="位置距离"
          menuKey="distance"
          options={distanceOptions}
          onSelect={(value) => handleOptionSelect(value, 'distance')}
        />

        {/* 筛选 */}
        <button 
          className={styles.dropdownBtn}
          onClick={handleFilterClick}
          title="筛选"
        >
          <span className={styles.btnText}>筛选</span>
          <DownOutline className={styles.downIcon} />
        </button>

      </div>

      {/* 筛选面板 */}
      <Popup
        visible={filterVisible}
        onMaskClick={handleFilterClose}
        position="bottom"
        bodyStyle={{ 
          borderTopLeftRadius: '16px', 
          borderTopRightRadius: '16px', 
          height: '70%'
        }}
      >
        <div className={styles.filterPanelContent}>
          <div className={styles.filterPanelHeader}>
            <h3 className={styles.filterPanelTitle}>筛选条件</h3>
            <button 
              onClick={handleFilterClose}
              className={styles.filterPanelCloseBtn}
            >
              关闭
            </button>
          </div>

          {/* 星级筛选 */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>酒店星级</h4>
            <div className={styles.filterOptions}>
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  className={tempRating === rating ? styles.filterOptionBtnActive : styles.filterOptionBtn}
                  onClick={() => setTempRating(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* 价格范围筛选 */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>价格范围</h4>
            <div className={styles.filterOptionsWithMargin}>
              {priceRangeOptions.map((price) => (
                <button
                  key={price}
                  className={tempPrice === price && !(tempCustomPriceMin || tempCustomPriceMax) ? styles.filterOptionBtnActive : styles.filterOptionBtn}
                  onClick={() => {
                    setTempPrice(price)
                    setTempCustomPriceMin('')
                    setTempCustomPriceMax('')
                  }}
                >
                  {price}
                </button>
              ))}
            </div>
            
            <div className={styles.filterPanelCustomPrice}>
              <div className={styles.filterPanelCustomPriceRow}>
                <input
                  type="number"
                  placeholder="最低价"
                  value={tempCustomPriceMin}
                  onChange={(e) => setTempCustomPriceMin(e.target.value)}
                  className={styles.filterPanelCustomPriceInput}
                />
                <span className={styles.filterPanelCustomPriceSeparator}>-</span>
                <input
                  type="number"
                  placeholder="最高价"
                  value={tempCustomPriceMax}
                  onChange={(e) => setTempCustomPriceMax(e.target.value)}
                  className={styles.filterPanelCustomPriceInput}
                />
              </div>
            </div>
          </div>

          {/* 评分筛选 */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>用户评分</h4>
            <div className={styles.filterOptions}>
              {scoreOptions.map((score) => (
                <button
                  key={score}
                  className={tempScore === score ? styles.filterOptionBtnActive : styles.filterOptionBtn}
                  onClick={() => setTempScore(score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* 确认按钮 */}
          <button
            className={styles.filterPanelConfirmBtn}
            onClick={handleFilterConfirm}
          >
            确定
          </button>
        </div>
      </Popup>
    </div>
  )
}
