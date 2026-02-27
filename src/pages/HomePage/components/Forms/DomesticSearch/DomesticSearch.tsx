import { useState, useEffect } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline, RightOutline } from 'antd-mobile-icons';
import type { SearchFormData } from '../../../hooks/useSearchParams'

import styles from './DomesticSearch.module.css';
import { differenceInCalendarDays } from 'date-fns';
import PeriodCalendar from '../../../../../components/PeriodCalendar/PeriodCalendar';
import LocationPicker from '../../../../../components/LocationPick/LocationPick';

interface DomesticSearchFormProps {
  value: SearchFormData
  onChange: (data: SearchFormData) => void
  onSearch: (data: SearchFormData) => void
}

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

const HOTEL_BRANDS = ['不限', '万豪', '希尔顿', '洲际', '凯悦', '雅高', '香格里拉'];
const HOTEL_RATINGS = ['不限', '5星', '4星', '3星及以下'];
const PRICE_RANGES = ['不限', '0-500', '500-1000', '1000-2000', '2000+'];

// 价格区间 → minPrice / maxPrice
function parsePriceRange(price: string): { minPrice?: number; maxPrice?: number } {
  switch (price) {
    case '0-500':      return { minPrice: 0, maxPrice: 500 };
    case '500-1000':   return { minPrice: 500, maxPrice: 1000 };
    case '1000-2000':  return { minPrice: 1000, maxPrice: 2000 };
    case '2000+':      return { minPrice: 2000 };
    default:           return {};
  }
}

// 星级字符串 → 数值
function parseStarLevel(rating: string): number | undefined {
  switch (rating) {
    case '5星':       return 5;
    case '4星':       return 4;
    case '3星及以下':  return 3;
    default:          return undefined;
  }
}

// ═══════════════════════════════════════════
// 自定义 Tag 组件 — 彻底绕开 antd-mobile Button 样式问题
// ═══════════════════════════════════════════
function Tag({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <span
      className={`${styles.tag} ${active ? styles.tagActive : ''}`}
      onClick={onClick}
    >
      {label}
    </span>
  )
}

export default function DomesticSearch({ value, onChange, onSearch }: DomesticSearchFormProps) {
  const [city, setCity] = useState(value.city || '上海');
  const [keyword, setKeyword] = useState('');
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
  const [locationVisible, setLocationVisible] = useState(false);
  const [location, setLocation] = useState<{ value: string; lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (value.city && value.city !== city) {
      setCity(value.city);
    }
  }, [value.city]);

  useEffect(() => {
    setCityTags(CITY_TAGS[city] || CITY_TAGS['上海']);
    setSelectedTags([]);
  }, [city]);

  const handleDateChange = (sd: Date | null, ed: Date | null) => {
    setStartDate(sd);
    setEndDate(ed);
    if (ed) setCalendarVisible(false);
  };

  const nights = (startDate && endDate)
    ? differenceInCalendarDays(endDate, startDate)
    : 0;

  const renderDateText = () => (
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

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const collectFormData = (): SearchFormData => {
    const priceRange = parsePriceRange(selectedPrice);
    return {
      region: 'domestic',
      city: city || '上海',
      keyword,
      dates: startDate && endDate ? [startDate, endDate] : undefined,
      brand: selectedBrand !== '不限' ? selectedBrand : undefined,
      star_rating: parseStarLevel(selectedRating),
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      roomCount,
      guestCount,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      lat: location?.lat,
      lng: location?.lng,
    };
  };

  const handleInternalSearch = () => {
    const formData = collectFormData();
    onChange(formData);
    onSearch(formData);
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" block className={styles.verticalSpace}>
        {/* 第一行：城市 + 搜索 + 定位 */}
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
            onClick={() => setLocationVisible(true)}
          >
            <LocationOutline />
          </Button>
        </div>

        {/* 第二行：日期 + 筛选 */}
        <div className={styles.dateFilterRow}>
          <div className={styles.dateselect} onClick={() => setCalendarVisible(true)}>
            {renderDateText()}
          </div>
          <div className={styles.filterButton} onClick={() => setFilterVisible(true)}>
            {selectedBrand !== '不限' && selectedPrice !== '不限'
              ? `${selectedBrand}/${selectedPrice}`
              : selectedBrand !== '不限'
                ? selectedBrand
                : selectedPrice !== '不限'
                  ? selectedPrice
                  : '品牌/价格'}
          </div>
        </div>

        {/* 第三行：房间/人数 */}
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

        {/* 首页标签横滑 — 使用自定义 Tag */}
        <div className={styles.tagContainer}>
          <div className={styles.tagScroll}>
            {cityTags.map(tag => (
              <Tag
                key={tag}
                label={tag}
                active={selectedTags.includes(tag)}
                onClick={() => handleTagClick(tag)}
              />
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

        {/* ── 定位弹窗 ── */}
        <Popup
          visible={locationVisible}
          onMaskClick={() => setLocationVisible(false)}
          position="bottom"
          bodyStyle={{ height: '80vh' }}
        >
          <LocationPicker
            onConfirm={(loc) => {
              setLocation({ value: '当前位置', ...loc });
              setCity('当前位置');
              setLocationVisible(false);
            }}
            onCancel={() => setLocationVisible(false)}
          />
        </Popup>

        {/* ── 日历弹窗 ── */}
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

        {/* ── 城市弹窗 ── */}
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
                {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '重庆'].map(cityItem => (
                  <Button
                    key={cityItem}
                    fill="outline"
                    onClick={() => {
                      const truncated = cityItem.length > 8 ? cityItem.substring(0, 8) + '...' : cityItem;
                      setCity(truncated);
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

        {/* ═══════════════════════════════════════
            【核心修复】筛选弹窗
            - 外层: filterPopup (flex column, overflow hidden)
            - 中层: filterScrollArea (flex:1, overflow-y auto) ← 可滚动
            - 底部: filterFooter (fixed)
            - 标签: 自定义 Tag 组件 + wrap 布局
            ═══════════════════════════════════════ */}
        <Popup
          visible={filterVisible}
          onMaskClick={() => setFilterVisible(false)}
          position="bottom"
          className={styles.filterPopup}
        >
          {/* 可滚动区域 */}
          <div className={styles.filterScrollArea}>
            <h3 className={styles.popupTitle}>筛选条件</h3>

            {/* 热门地标 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>热门地标</div>
              <div className={styles.popupTagWrap}>
                {cityTags.map(tag => (
                  <Tag
                    key={tag}
                    label={tag}
                    active={selectedTags.includes(tag)}
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
              </div>
            </div>

            {/* 酒店品牌 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>酒店品牌</div>
              <div className={styles.popupTagWrap}>
                {HOTEL_BRANDS.map(brand => (
                  <Tag
                    key={brand}
                    label={brand}
                    active={selectedBrand === brand}
                    onClick={() => setSelectedBrand(brand)}
                  />
                ))}
              </div>
            </div>

            {/* 酒店星级 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>酒店星级</div>
              <div className={styles.popupTagWrap}>
                {HOTEL_RATINGS.map(rating => (
                  <Tag
                    key={rating}
                    label={rating}
                    active={selectedRating === rating}
                    onClick={() => setSelectedRating(rating)}
                  />
                ))}
              </div>
            </div>

            {/* 价格区间 */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>价格区间</div>
              <div className={styles.popupTagWrap}>
                {PRICE_RANGES.map(price => (
                  <Tag
                    key={price}
                    label={price}
                    active={selectedPrice === price}
                    onClick={() => setSelectedPrice(price)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 固定底部按钮 */}
          <div className={styles.filterFooter}>
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

        {/* ── 房间/人数弹窗 ── */}
        <Popup
          visible={roomGuestVisible}
          onMaskClick={() => setRoomGuestVisible(false)}
          position="bottom"
          className={styles.roomGuestPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>房间与人数</h3>
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