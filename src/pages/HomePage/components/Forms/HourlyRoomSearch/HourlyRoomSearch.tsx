import { useState } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline } from 'antd-mobile-icons';
import type { SearchData } from '../../../hooks/useSearchLogic'; // 导入类型
import styles from './HourlyRoomSearch.module.css';

// 定义该组件接收的 Props：一个 onSearch 函数
interface HourlyRoomSearchFormProps {
  onSearch: (data: Partial<SearchData>) => void;
}

// 模拟城市数据
const CITIES = ['上海', '北京', '广州', '深圳', '杭州', '成都', '南京', '重庆'];

// 模拟钟点房标签数据
const HOURLY_ROOM_TAGS = ['商务', '休闲', '午休', '临时休息', '会议', '观影', '情侣', '家庭'];

// 模拟小时选项
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

// 模拟分钟选项
const MINUTE_OPTIONS = [0, 30];

export default function HourlyRoomSearch({ onSearch }: HourlyRoomSearchFormProps) {
  // --- 只管理自己内部的状态 ---
  const [city, setCity] = useState('上海'); // 默认城市为上海
  const [keyword, setKeyword] = useState('');
  const [startHour, setStartHour] = useState<number>(12);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(14);
  const [endMinute, setEndMinute] = useState<number>(0);
  const [cityVisible, setCityVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleLocation = () => {
    // 模拟定位功能，限制城市名称长度
    const locationName = '当前位置';
    // 限制城市名称长度为8个字符，防止影响图标显示
    const truncatedName = locationName.length > 8 ? locationName.substring(0, 8) + '...' : locationName;
    setCity(truncatedName);
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

  const renderTimeText = () => {
    const formatTime = (hour: number, minute: number) => {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };
    return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
  };

  const handleInternalSearch = () => {
    // --- 汇总自己内部的数据 ---
    const formData: Partial<SearchData> = {
      searchType: 'hourly',
      city,
      keyword,
      tags: selectedTags,
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`
    };
    // --- 调用上层传递的 onSearch 函数，把数据交出去 ---
    onSearch(formData);
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" block style={{ '--gap': '16px' }}>
        {/* 第一行：城市选择 + 检索词输入 + 定位按钮 */}
        <div className={styles.inputGroup}>
          <Button 
            fill="outline" 
            onClick={() => setCityVisible(true)}
            style={{ width: '100px' }}
          >
            {city}
          </Button>
          <Input 
            placeholder="钟点房名称/地标/关键词" 
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

        {/* 第二行：时间选择 */}
        <div className={styles.timeselect} onClick={() => setTimeVisible(true)}>
          {renderTimeText()}
        </div>

        {/* 第三行：钟点房标签 */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
            钟点房标签
          </div>
          <Space wrap style={{ '--gap': '8px' }}>
            {HOURLY_ROOM_TAGS.map((tag) => (
              <Button
                key={tag}
                fill={selectedTags.includes(tag) ? 'solid' : 'outline'}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                size="small"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
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

        {/* 城市选择弹窗 */}
        <Popup
          visible={cityVisible}
          onMaskClick={() => setCityVisible(false)}
          position="bottom"
          bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70%' }}
        >
          <div style={{ padding: '16px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择城市</h3>
            <Input placeholder="搜索城市" />
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>热门城市</div>
              <Space wrap style={{ '--gap': '8px' }}>
                {CITIES.map((cityItem) => (
                  <Button 
                    key={cityItem}
                    fill="outline"
                    onClick={() => {
                      // 限制城市名称长度为8个字符，防止影响图标显示
                      const truncatedCity = cityItem.length > 8 ? cityItem.substring(0, 8) + '...' : cityItem;
                      setCity(truncatedCity);
                      setCityVisible(false);
                    }}
                  >
                    {cityItem}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        </Popup>

        {/* 时间选择弹窗 */}
        <Popup
          visible={timeVisible}
          onMaskClick={() => setTimeVisible(false)}
          position="bottom"
          bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70%' }}
        >
          <div style={{ padding: '16px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择时间</h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>开始时间</div>
              <Space wrap style={{ '--gap': '8px' }}>
                {HOUR_OPTIONS.map((hour) => (
                  <Button
                    key={`start-hour-${hour}`}
                    fill={startHour === hour ? 'solid' : 'outline'}
                    color={startHour === hour ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setStartHour(hour)}
                  >
                    {hour}时
                  </Button>
                ))}
              </Space>
              <Space wrap style={{ '--gap': '8px', marginTop: '8px' }}>
                {MINUTE_OPTIONS.map((minute) => (
                  <Button
                    key={`start-minute-${minute}`}
                    fill={startMinute === minute ? 'solid' : 'outline'}
                    color={startMinute === minute ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setStartMinute(minute)}
                  >
                    {minute}分
                  </Button>
                ))}
              </Space>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>结束时间</div>
              <Space wrap style={{ '--gap': '8px' }}>
                {HOUR_OPTIONS.map((hour) => (
                  <Button
                    key={`end-hour-${hour}`}
                    fill={endHour === hour ? 'solid' : 'outline'}
                    color={endHour === hour ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setEndHour(hour)}
                  >
                    {hour}时
                  </Button>
                ))}
              </Space>
              <Space wrap style={{ '--gap': '8px', marginTop: '8px' }}>
                {MINUTE_OPTIONS.map((minute) => (
                  <Button
                    key={`end-minute-${minute}`}
                    fill={endMinute === minute ? 'solid' : 'outline'}
                    color={endMinute === minute ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setEndMinute(minute)}
                  >
                    {minute}分
                  </Button>
                ))}
              </Space>
            </div>
            <Button 
              color="primary" 
              block 
              size="large" 
              onClick={() => setTimeVisible(false)}
            >
              确认
            </Button>
          </div>
        </Popup>
      </Space>
    </div>
  );
}