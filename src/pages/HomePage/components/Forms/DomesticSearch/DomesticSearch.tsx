import { useState, useEffect } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline, DownOutline } from 'antd-mobile-icons';
import type { SearchData } from '../../../hooks/useSearchLogic'; // 导入类型
import styles from './DomesticSearch.module.css';
import { differenceInCalendarDays } from 'date-fns';
import PeriodCalendar from '../../../../../components/PeriodCalendar/PeriodCalendar';

// 定义该组件接收的 Props：一个 onSearch 函数
interface DomesticSearchFormProps {
  onSearch: (data: Partial<SearchData>) => void;
}

// 模拟城市常用标签数据
const CITY_TAGS: { [key: string]: string[] } = {
  '上海': ['外滩', '陆家嘴', '虹桥', '浦东机场', '迪士尼', '徐家汇', '南京路', '静安寺'],
  '北京': ['天安门', '故宫', '颐和园', '长城', 'CBD', '中关村', '望京', '首都机场'],
  '广州': ['天河', '珠江新城', '北京路', '白云机场', '广州南站', '琶洲', '上下九', '沙面'],
  '深圳': ['福田', '南山', '宝安机场', '深圳北站', '科技园', '华强北', '罗湖', '盐田'],
  '杭州': ['西湖', '西溪湿地', '钱江新城', '萧山机场', '杭州东站', '湖滨', '灵隐寺', '余杭'],
  '成都': ['春熙路', '宽窄巷子', '锦里', '天府广场', '双流机场', '成都东站', '太古里', '武侯祠'],
  '南京': ['夫子庙', '新街口', '玄武湖', '南京南站', '禄口机场', '鼓楼', '雨花台', '栖霞山'],
  '重庆': ['解放碑', '洪崖洞', '朝天门', '江北机场', '重庆北站', '南坪', '杨家坪', '沙坪坝'],
  '当前位置': ['市中心', '机场', '火车站', '商业区', '景区', '高校', '医院', '地铁站']
};

// 模拟酒店品牌数据
const HOTEL_BRANDS = ['不限', '万豪', '希尔顿', '洲际', '凯悦', '雅高', '香格里拉'];

// 模拟酒店星级数据
const HOTEL_RATINGS = ['不限', '5星', '4星', '3星及以下'];

export default function DomesticSearch({ onSearch }: DomesticSearchFormProps) {
  // --- 只管理自己内部的状态 ---
  const [city, setCity] = useState('上海'); // 默认城市为上海
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('不限');
  const [selectedRating, setSelectedRating] = useState('不限');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cityTags, setCityTags] = useState<string[]>(CITY_TAGS['上海'] || []); // 默认显示上海的标签

  // 当城市变化时，更新城市标签
  useEffect(() => {
    setCityTags(CITY_TAGS[city] || CITY_TAGS['上海']);
    // 重置选中的标签
    setSelectedTags([]);
  }, [city]);

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

  const handleInternalSearch = () => {
    // --- 汇总自己内部的数据 ---
    const formData: Partial<SearchData> = {
      searchType: 'domestic',
      city,
      keyword,
      dates: startDate && endDate ? [startDate, endDate] : undefined,
      brand: selectedBrand !== '不限' ? selectedBrand : undefined,
      tags: [
        ...selectedTags,
        ...(selectedRating !== '不限' ? [selectedRating] : [])
      ].filter(Boolean)
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

        {/* 第三行：城市常用标签 */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
            热门地标
          </div>
          <Space wrap style={{ '--gap': '8px' }}>
            {cityTags.map((tag) => (
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

        {/* 第四行：酒店品牌和星级选择 */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
            酒店筛选
          </div>
          
          {/* 酒店品牌 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
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
          
          {/* 酒店星级 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
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
                {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '重庆'].map((cityItem) => (
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
      </Space>
    </div>
  );
}

