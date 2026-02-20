import { useState } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline } from 'antd-mobile-icons';
import type { SearchData } from '../../../hooks/useSearchLogic'; // 导入类型
import styles from './OverseasSearch.module.css';
import { differenceInCalendarDays } from 'date-fns';
import PeriodCalendar from '../../../../../components/PeriodCalendar/PeriodCalendar';

// 定义该组件接收的 Props
interface OverseasSearchFormProps {
  value: Partial<SearchData>;
  onChange: (data: Partial<SearchData>) => void;
  onSearch: () => void;
}

// 模拟国家数据
const COUNTRIES = ['泰国', '日本', '韩国', '新加坡', '马来西亚', '美国', '英国', '法国', '德国', '意大利'];

// 模拟酒店品牌数据
const HOTEL_BRANDS = ['不限', '万豪', '希尔顿', '洲际', '凯悦', '雅高', '香格里拉', '温德姆', '喜达屋', '四季'];

// 模拟酒店星级数据
const HOTEL_RATINGS = ['不限', '5星', '4星', '3星及以下'];

export default function OverseasSearch({ value, onChange, onSearch }: OverseasSearchFormProps) {
  // --- 只管理自己内部的状态 ---
  const [country, setCountry] = useState('泰国'); // 默认国家为泰国
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('不限');
  const [selectedRating, setSelectedRating] = useState('不限');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleDateChange = (newDates: { startDate: Date | null; endDate: Date | null }) => {
    setStartDate(newDates.startDate);
    setEndDate(newDates.endDate);
    // 关键：当用户选择完结束日期后，自动关闭弹窗
    if (newDates.endDate) {
      setCalendarVisible(false);
    }
  };

  const nights = (startDate && endDate) 
    ? differenceInCalendarDays(endDate, startDate) 
    : 0;

  const renderDateText = () => {
    if (startDate && endDate) {
      return (
        <div className={styles.dateText}>
          <div>
            {startDate.getMonth()}月{startDate.getDate()}日入住
            -
            {endDate.getMonth()}月{endDate.getDate()}日离店
            共{nights}晚
          </div>
        </div>
      );
    }
    return '选择入住和离开日期';
  };

  const handleLocation = () => {
    // 模拟定位功能，限制国家名称长度
    const locationName = '当前位置';
    // 限制国家名称长度为8个字符，防止影响图标显示
    const truncatedName = locationName.length > 8 ? locationName.substring(0, 8) + '...' : locationName;
    setCountry(truncatedName);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleInternalSearch = () => {
    // --- 汇总自己内部的数据 ---
    const formData: Partial<SearchData> = {
      searchType: 'overseas',
      city: country, // 使用country作为city字段，保持数据结构一致
      keyword,
      dates: startDate && endDate ? [startDate, endDate] : undefined,
      brand: selectedBrand !== '不限' ? selectedBrand : undefined,
      tags: [
        ...selectedTags,
        ...(selectedRating !== '不限' ? [selectedRating] : [])
      ].filter(Boolean)
    };
    
    // 更新上层状态
    onChange(formData);
    
    // 调用上层传递的 onSearch 函数
    onSearch();
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" block style={{ '--gap': '16px' }}>
        {/* 第一行：国家选择 + 检索词输入 + 定位按钮 */}
        <div className={styles.inputGroup}>
          <Button 
            fill="outline" 
            onClick={() => setCountryVisible(true)}
            style={{ width: '100px' }}
          >
            {country}
          </Button>
          <Input 
            placeholder="酒店名称/地标/关键词" 
            value={keyword} 
            onChange={setKeyword}
            style={{ flex: 1 }}
          />
          <Button 
            fill="none" 
            className={styles.locationBtn}  
            onClick={handleLocation}
            style={{ width: '44px' }} // 保持按钮大小一致
          >
            <LocationOutline />
          </Button>
        </div>

        {/* 第二行：日期选择 */}
        <div className={styles.dateselect} onClick={() => setCalendarVisible(true)}>
          {renderDateText()}
        </div>

        {/* 第三行：酒店品牌标签 */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
            酒店品牌
          </div>
          <Space wrap style={{ '--gap': '8px' }}>
            {HOTEL_BRANDS.map((brand) => (
              <Button
                key={brand}
                fill={selectedBrand === brand ? 'solid' : 'outline'}
                color={selectedBrand === brand ? 'primary' : 'default'}
                size="small"
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Button>
            ))}
          </Space>
        </div>

        {/* 第四行：酒店星级选择 */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
            酒店星级
          </div>
          <Space wrap style={{ '--gap': '8px' }}>
            {HOTEL_RATINGS.map((rating) => (
              <Button
                key={rating}
                fill={selectedRating === rating ? 'solid' : 'outline'}
                color={selectedRating === rating ? 'primary' : 'default'}
                size="small"
                onClick={() => setSelectedRating(rating)}
              >
                {rating}
              </Button>
            ))}
          </Space>
        </div>

        {/* 搜索按钮 */}
        <Button 
          color="primary" 
          block 
          size="large" 
          onClick={handleInternalSearch}
          className="searchBtn"
        >
          查 询
        </Button>

        {/* 日历选择弹窗 */}
        <Popup
          visible={calendarVisible}
          onMaskClick={() => setCalendarVisible(false)}
          position="bottom"
          bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        >
          <div style={{ padding: '16px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择日期</h3>
            <PeriodCalendar 
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
          </div>
        </Popup>

        {/* 国家选择弹窗 */}
        <Popup
          visible={countryVisible}
          onMaskClick={() => setCountryVisible(false)}
          position="bottom"
          bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70%' }}
        >
          <div style={{ padding: '16px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择国家</h3>
            <Input placeholder="搜索国家" />
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>热门国家</div>
              <Space wrap style={{ '--gap': '8px' }}>
                {COUNTRIES.map((countryItem) => (
                  <Button 
                    key={countryItem}
                    fill="outline"
                    onClick={() => {
                      // 限制国家名称长度为8个字符，防止影响图标显示
                      const truncatedCountry = countryItem.length > 8 ? countryItem.substring(0, 8) + '...' : countryItem;
                      setCountry(truncatedCountry);
                      setCountryVisible(false);
                    }}
                  >
                    {countryItem}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        </Popup>
      </Space>
    </div>
  );
}
