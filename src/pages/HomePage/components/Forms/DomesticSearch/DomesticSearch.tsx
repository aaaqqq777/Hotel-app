import { useState, useEffect } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline, RightOutline } from 'antd-mobile-icons';
import type { SearchData } from '../../../hooks/useSearchLogic'; // 导入类型
import styles from './DomesticSearch.module.css';
import { differenceInCalendarDays } from 'date-fns';
import PeriodCalendar from '../../../../../components/PeriodCalendar/PeriodCalendar';

// 定义该组件接收的 Props
interface DomesticSearchFormProps {
  value: Partial<SearchData>;
  onChange: (data: Partial<SearchData>) => void;
  onSearch: () => void;
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

export default function DomesticSearch({ value, onChange, onSearch }: DomesticSearchFormProps) {
  // --- 只管理自己内部的状态 ---
  // 使用value.city作为初始值，如果没有则使用上海
  const [city, setCity] = useState(value.city || '上海');
  const [keyword, setKeyword] = useState('');
  // 设置默认开始日期为今天
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('不限');
  const [selectedRating, setSelectedRating] = useState('不限');
  const [selectedPrice, setSelectedPrice] = useState('不限');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cityTags, setCityTags] = useState<string[]>(CITY_TAGS[city] || CITY_TAGS['上海']);
  const [filterVisible, setFilterVisible] = useState(false);
  const [roomGuestVisible, setRoomGuestVisible] = useState(false);
  const [roomCount, setRoomCount] = useState(value.roomCount || 1);
  const [guestCount, setGuestCount] = useState(value.guestCount || 1);

  // 当外部value变化时，更新内部状态
  useEffect(() => {
    if (value.city && value.city !== city) {
      setCity(value.city);
    }
  }, [value.city]);

  // 当城市变化时，更新城市标签
  useEffect(() => {
    setCityTags(CITY_TAGS[city] || CITY_TAGS['上海']);
    // 重置选中的标签
    setSelectedTags([]);
  }, [city]);

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    console.log('Selected dates:', { startDate, endDate });
    if (endDate) {
      setCalendarVisible(false);
    }
  };

  const nights = (startDate && endDate) 
    ? differenceInCalendarDays(endDate, startDate) 
    : 0;

  const renderDateText = () => {
    return (
      <div className={styles.dateText}>
        <div className={styles.dateLabel}>
          <span>入住</span>
          <span>离店</span>
        </div>
        <div className={styles.dateValue}>
          <span className={styles.startDate}>
            {startDate ? `${startDate.getMonth() + 1}月${startDate.getDate()}日` : '-'}
          </span>
          <span className={styles.nightsInfo}>
            {nights > 0 ? `${nights}晚` : ''}
          </span>
          <span className={styles.endDate}>
            {endDate ? `${endDate.getMonth() + 1}月${endDate.getDate()}日` : '-'}  
          </span>
        </div>
      </div>
    );
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
      city: city || '上海', // 确保城市值存在
      keyword,
      dates: startDate && endDate ? [startDate, endDate] : undefined,
      brand: selectedBrand !== '不限' ? selectedBrand : undefined,
      tags: [
        ...selectedTags,
        ...(selectedRating !== '不限' ? [selectedRating] : [])
      ].filter(Boolean),
      roomCount,
      guestCount
    };
    
    // 更新上层状态
    onChange(formData);
    
    // 直接调用搜索函数（因为现在是异步的）
    onSearch();
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" block className={styles.verticalSpace}>
        {/* 第一行：城市选择 + 检索词输入 + 定位按钮 */}
        <div className={styles.inputGroup}>
          <Button 
            fill="none" 
            onClick={() => setCityVisible(true)}
            className={styles.cityButton}
          >
            {city}<RightOutline />
          </Button>
          <Input 
            placeholder="酒店名称/地标/关键词" 
            value={keyword} 
            onChange={setKeyword}
            className={styles.searchInput}
            clearable
          />
          <Button 
            fill="none" 
            className={styles.locationBtn}  
            onClick={handleLocation}
          >
            <LocationOutline />
          </Button>
        </div>

        {/* 第二行：日期选择 + 标签筛选 */}
        <div className={styles.dateFilterRow}>
          <div className={styles.dateselect} onClick={() => setCalendarVisible(true)}>
            {renderDateText()}
          </div>
          <div className={styles.filterButton} onClick={() => setFilterVisible(true)}>
            {selectedBrand !== '不限' && selectedPrice !== '不限' ? `${selectedBrand}/${selectedPrice}` : 
             selectedBrand !== '不限' ? selectedBrand : 
             selectedPrice !== '不限' ? selectedPrice : '品牌/价格'}
          </div>
        </div>

        {/* 第三行：房间数/人数选择 */}
        <div className={styles.roomGuestRow}>
          <div className={styles.roomGuestButton} onClick={() => setRoomGuestVisible(true)}>
            <span className={styles.roomGuestLabel}>房间</span>
            <span className={styles.roomGuestValue}>{roomCount}</span>
             <span className={styles.roomGuestLabel}>间</span>
            <span className={styles.roomGuestDivider}>/</span>
            <span className={styles.roomGuestLabel}>人数</span>
            <span className={styles.roomGuestValue}>{guestCount}</span>
            <span className={styles.roomGuestLabel}>人</span>
          </div>
        </div>

        {/* 标签容器 */}
        <div className={styles.tagContainer}>
          <div className={styles.tagScroll}>
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
          </div>
        </div>

        {/* 搜索按钮 */}
        <Button 
          color="primary" 
          block 
          size="large" 
          onClick={handleInternalSearch}
          className={styles.searchButton}
        >
          查 询
        </Button>

        {/* 日历选择弹窗 */}
        <Popup
          visible={calendarVisible}
          onMaskClick={() => setCalendarVisible(false)}
          position="bottom"
          className={styles.calendarPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>选择日期</h3>
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
          className={styles.cityPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>选择城市</h3>
            <Input placeholder="搜索城市" />
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>热门城市</div>
              <Space wrap className={styles.horizontalSpace}>
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

        {/* 筛选标签弹窗 */}
        <Popup
          visible={filterVisible}
          onMaskClick={() => setFilterVisible(false)}
          position="bottom"
          className={styles.filterPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>筛选条件</h3>
            
            {/* 热门地标 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>热门地标</div>
              <div className={styles.tagContainer}>
                <div className={styles.tagScroll}>
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
                </div>
              </div>
            </div>
            
            {/* 酒店品牌 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionSubtitle}>酒店品牌</div>
              <div className={styles.tagContainer}>
                <div className={styles.tagScroll}>
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
                </div>
              </div>
            </div>
            
            {/* 酒店星级 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionSubtitle}>酒店星级</div>
              <div className={styles.tagContainer}>
                <div className={styles.tagScroll}>
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
                </div>
              </div>
            </div>
            
            {/* 价格区间 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionSubtitle}>价格区间</div>
              <div className={styles.tagContainer}>
                <div className={styles.tagScroll}>
                  {['不限', '0-500', '500-1000', '1000-2000', '2000+'].map((priceRange) => (
                    <Button
                      key={priceRange}
                      fill={selectedPrice === priceRange ? 'solid' : 'outline'}
                      color={selectedPrice === priceRange ? 'primary' : 'default'}
                      size="small"
                      onClick={() => setSelectedPrice(priceRange)}
                    >
                      {priceRange}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 确定按钮 */}
            <Button 
              color="primary" 
              block 
              size="large" 
              onClick={() => setFilterVisible(false)}
            >
              确定
            </Button>
          </div>
        </Popup>

        {/* 房间数/人数选择弹窗 */}
        <Popup
          visible={roomGuestVisible}
          onMaskClick={() => setRoomGuestVisible(false)}
          position="bottom"
          className={styles.roomGuestPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>房间与人数</h3>
            
            {/* 房间数 */}
            <div className={styles.roomGuestSection}>
              <div className={styles.roomGuestTitle}>房间数</div>
              <div className={styles.numberStepper}>
                <Button 
                  fill="none"
                  size="small"
                  onClick={() => setRoomCount(prev => Math.max(1, prev - 1))}
                  disabled={roomCount <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{roomCount}</span>
                <Button 
                  fill="none"
                  size="small"
                  onClick={() => setRoomCount(prev => Math.min(10, prev + 1))}
                  disabled={roomCount >= 10}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* 人数 */}
            <div className={styles.roomGuestSection}>
              <div className={styles.roomGuestTitle}>出行人数</div>
              <div className={styles.numberStepper}>
                <Button 
                  fill="none"
                  size="small"
                  onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                  disabled={guestCount <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{guestCount}</span>
                <Button 
                  fill="none"
                  size="small"
                  onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
                  disabled={guestCount >= 20}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* 确定按钮 */}
            <Button 
              color="primary" 
              block 
              size="large" 
              onClick={() => setRoomGuestVisible(false)}
              style={{ marginTop: 24 }}
            >
              确定
            </Button>
          </div>
        </Popup>
      </Space>
    </div>
  );
}