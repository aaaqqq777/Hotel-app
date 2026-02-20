import { Tag } from 'antd-mobile'
import styles from './QuickTagsBar.module.css'

interface QuickTagsBarProps {
  tags: Array<{ label: string; value: string }>
  selectedTags: string[]
  onTagClick: (tagValue: string) => void
  showOnlySelected?: boolean
}

export default function QuickTagsBar({
  tags,
  selectedTags,
  onTagClick,
  showOnlySelected = false,
}: QuickTagsBarProps) {
  // 排序标签：选中的标签在前，未选中的在后
  const sortedTags = [...tags].sort((a, b) => {
    const aSelected = selectedTags.includes(a.value)
    const bSelected = selectedTags.includes(b.value)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })

  // 过滤出选中的标签和未选中的标签
  const selectedTagObjects = sortedTags.filter(tag => selectedTags.includes(tag.value))
  const unselectedTagObjects = sortedTags.filter(tag => !selectedTags.includes(tag.value))

  return (
    <div className={styles.container}>
      {/* 选中的标签 */}
      {selectedTagObjects.length > 0 && (
        <div className={styles.selectedTagsWrapper}>
          {selectedTagObjects.map((tag) => (
            <Tag
              key={tag.value}
              color="primary"
              onClick={() => {
                console.log('Selected tag clicked:', tag.value);
                onTagClick(tag.value);
              }}
              className={styles.tag}
            >
              {tag.label}
            </Tag>
          ))}
        </div>
      )}

      {/* 未选中的标签（仅在非showOnlySelected模式下显示） */}
      {!showOnlySelected && unselectedTagObjects.length > 0 && (
        <div className={styles.unselectedTagsWrapper}>
          {unselectedTagObjects.map((tag) => (
            <Tag
              key={tag.value}
              color="default"
              onClick={() => {
                console.log('Unselected tag clicked:', tag.value);
                onTagClick(tag.value);
              }}
              className={styles.tag}
            >
              {tag.label}
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
