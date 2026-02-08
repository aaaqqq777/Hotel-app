import { useState } from 'react';
import { Button, DatePicker, Input, Space } from 'antd-mobile';
import { LocationOutline } from 'antd-mobile-icons';
import type { SearchData } from '../../../../../hooks/useSearchLogic'; // 导入类型
import styles from './DomesticSearch.module.css';

// 定义该组件接收的 Props：一个 onSearch 函数
interface DomesticSearchFormProps {
  onSearch: (data: Partial<SearchData>) => void;
}

export default function DomesticSearch({ onSearch }: DomesticSearchFormProps) {
  // --- 只管理自己内部的状态 ---
  const [city, setCity] = useState('北京');
  const [keyword, setKeyword] = useState('');
  const [dates, setDates] = useState<[Date, Date] | null>(null);

  const handleInternalSearch = () => {
    // --- 汇总自己内部的数据 ---
    const formData: Partial<SearchData> = {
      searchType: 'domestic',
      city,
      keyword,
      dates: dates ?? undefined, // 如果 dates 是 null，则传 undefined
    };
    // --- 调用上层传递的 onSearch 函数，把数据交出去 ---
    onSearch(formData);
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" block style={{'--gap': '12px'}}>
        {/* 城市选择和定位 */}
        <div className={styles.inputGroup}>
          <Input placeholder="选择城市" value={city} onChange={setCity} />
          <Button fill="none" className={styles.locationBtn}>
            <LocationOutline /> 我的位置
          </Button>
        </div>

        {/* 酒店名输入 */}
        <Input placeholder="酒店/品牌/地标" value={keyword} onChange={setKeyword} />

        {/* 日期选择
        <DatePicker.RangePicker value={dates} onChange={setDates}>
          {(value) => (
            <Button block>
              {value && value.length === 2
                ? `${value[0].toLocaleDateString('zh-CN')} ~ ${value[1].toLocaleDateString('zh-CN')}`
                : '选择入住和离开日期'}
            </Button>
          )}
        </DatePicker.RangePicker> */}
        
        {/* 品牌、价格、标签等可以继续在这里添加 */}
        
        {/* 查询按钮 */}
        <Button color="primary" block size="large" onClick={handleInternalSearch}>
          查 询
        </Button>
      </Space>
    </div>
  );
}

