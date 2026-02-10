import { Tag } from 'antd-mobile'
import styles from './QuickTagsBar.module.css'

interface QuickTagsBarProps {
  tags: Array<{ label: string; value: string }>
  selectedTags: string[]
  onTagClick: (tagValue: string) => void
}

export default function QuickTagsBar({
  tags,
  selectedTags,
  onTagClick,
}: QuickTagsBarProps) {
  return (
    <div className={styles.container}>
      {/* <span className={styles.label}>快捷筛选：</span> */}
      <div className={styles.tagsWrapper}>
        {tags.map((tag) => (
          <Tag
            key={tag.value}
            color={selectedTags.includes(tag.value) ? 'primary' : 'default'}
            onClick={() => onTagClick(tag.value)}
            className={styles.tag}
          >
            {tag.label}
          </Tag>
        ))}
      </div>
    </div>
  )
}
