import { useState, useRef } from 'react'
import { DownOutline, FilterOutline, UnorderedListOutline } from 'antd-mobile-icons'
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
const priceRangeOptions = ['全部', '200以下', '200-500', '500以上']
const scoreOptions = ['全部', '4.8分以上', '4.5分以上', '4.0分以上']
const distanceOptions = ['全部', '1公里内', '3公里内', '5公里内', '10公里内']

export default function SortBar({ 
  currentSort, 
  onSortChange, 
  onFilterClick,
  selectedPrice = '品牌价格',
  onPriceChange,
  selectedRating = '星级',
  onRatingChange,
  selectedScore = '评分',
  onScoreChange
}: SortBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [customPriceMin, setCustomPriceMin] = useState<string>('')
  const [customPriceMax, setCustomPriceMax] = useState<string>('')
  const [showCustomPriceInput, setShowCustomPriceInput] = useState(false)

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || '推荐排序'

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
  }

  const handleFilterClick = () => {
    // 只打开筛选面板，不执行其他操作
    setFilterVisible(true)
    // 移除对onFilterClick的调用，避免可能的冲突
  };

  const handleFilterClose = () => {
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
    <div className={styles.container} ref={containerRef}>
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
            <span className={styles.btnText}>{selectedPrice}</span>
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
        <div style={{ padding: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px'
          }}>
            <h3 style={{ margin: 0 }}>筛选条件</h3>
            <button 
              onClick={handleFilterClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '16px', 
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
          </div>

          {/* 星级筛选 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>酒店星级</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    background: selectedRating === rating ? '#1890ff' : 'white',
                    color: selectedRating === rating ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                  onClick={() => onRatingChange?.(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* 价格范围筛选 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>价格范围</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              {priceRangeOptions.map((price) => (
                <button
                  key={price}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    background: selectedPrice === price ? '#1890ff' : 'white',
                    color: selectedPrice === price ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                  onClick={() => onPriceChange?.(price)}
                >
                  {price}
                </button>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="最低价"
                  value={customPriceMin}
                  onChange={(e) => setCustomPriceMin(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <span style={{ color: '#999' }}>-</span>
                <input
                  type="number"
                  placeholder="最高价"
                  value={customPriceMax}
                  onChange={(e) => setCustomPriceMax(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => {
                  const min = customPriceMin ? parseInt(customPriceMin) : 0
                  const max = customPriceMax ? parseInt(customPriceMax) : 99999
                  if (min > max) {
                    return
                  }
                  const customPriceStr = `${min}-${max}`
                  onPriceChange?.(customPriceStr)
                }}
              >
                确定
              </button>
            </div>
          </div>

          {/* 评分筛选 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>用户评分</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {scoreOptions.map((score) => (
                <button
                  key={score}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    background: selectedScore === score ? '#1890ff' : 'white',
                    color: selectedScore === score ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                  onClick={() => onScoreChange?.(score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* 确认按钮 */}
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={handleFilterClose}
          >
            确定
          </button>
        </div>
      </Popup>
    </div>
  )
}
