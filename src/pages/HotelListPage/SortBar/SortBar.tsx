import { useState, useRef } from 'react'
import { DownOutline, UnorderedListOutline } from 'antd-mobile-icons'
import styles from './SortBar.module.css'

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
  { label: '默认排序', value: 'default' as SortType },
  { label: '价格低到高', value: 'price-asc' as SortType },
  { label: '价格高到低', value: 'price-desc' as SortType },
]

const ratingOptions = ['全部', '5星', '4星', '3星及以下']
const priceRangeOptions = ['全部', '100以下', '100-300', '300-600', '600以上']
const scoreOptions = ['全部', '4.8分以上', '4.5分以上', '4.0分以上']

export default function SortBar({ 
  currentSort, 
  onSortChange, 
  onFilterClick,
  selectedPrice = '价格',
  onPriceChange,
  selectedRating = '星级',
  onRatingChange,
  selectedScore = '评分',
  onScoreChange
}: SortBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || '排序'

  const handleSortSelect = (value: SortType) => {
    onSortChange(value)
    setOpenMenu(null)
  }

  const handleOptionSelect = (value: string, type: 'price' | 'rating' | 'score') => {
    if (type === 'price') onPriceChange?.(value)
    if (type === 'rating') onRatingChange?.(value)
    if (type === 'score') onScoreChange?.(value)
    setOpenMenu(null)
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
        {/* 价格 */}
        <DropdownButton
          label={selectedPrice}
          menuKey="price"
          options={priceRangeOptions}
          onSelect={(value) => handleOptionSelect(value, 'price')}
        />

        {/* 星级 */}
        <DropdownButton
          label={selectedRating}
          menuKey="rating"
          options={ratingOptions}
          onSelect={(value) => handleOptionSelect(value, 'rating')}
        />

        {/* 评分
        <DropdownButton
          label={selectedScore}
          menuKey="score"
          options={scoreOptions}
          onSelect={(value) => handleOptionSelect(value, 'score')}
        /> */}

        {/* 排序 */}
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
      

      {/* 高级筛选按钮 */}
      <button className={styles.buttonGroup} onClick={onFilterClick} title="筛选">
        <UnorderedListOutline />
      </button>
      </div>
    </div>
  )
}
