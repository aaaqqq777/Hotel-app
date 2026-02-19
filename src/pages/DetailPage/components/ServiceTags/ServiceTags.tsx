import { useState } from 'react';
import styles from './ServiceTags.module.css';

interface ServiceTag {
  id: string;
  name: string;
}

interface ServiceTagsProps {
  tags: ServiceTag[];
  onTagSelect: (tagId: string) => void;
}

export default function ServiceTags({ tags, onTagSelect }: ServiceTagsProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newSelectedTags);
    onTagSelect(tagId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>服务选择</h3>
      </div>
      
      <div className={styles.tagsContainer}>
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`${styles.tagItem} ${selectedTags.includes(tag.id) ? styles.selected : ''}`}
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
}