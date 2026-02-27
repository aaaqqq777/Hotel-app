import { useState, useEffect } from 'react';
import { Button, Input, Space, Popup } from 'antd-mobile';
import { LocationOutline, RightOutline } from 'antd-mobile-icons';
import styles from './OverseasSearch.module.css';
import { differenceInCalendarDays } from 'date-fns';
import PeriodCalendar from '../../../../../components/PeriodCalendar/PeriodCalendar';
import LocationPicker from '../../../../../components/LocationPick/LocationPick';
import type { SearchFormData } from '../../../hooks/useSearchParams';

interface OverseasSearchFormProps {
  value: SearchFormData;
  onChange: (data: SearchFormData) => void;
  onSearch: (data: SearchFormData) => void;
}

const CITY_TAGS: { [key: string]: string[] } = {
  '曼谷': ['大皇宫', '湄南河', '考山路', '素万那普机场', '暹罗广场', '四面佛', '唐人街', '芭提雅'],
  '东京': ['涩谷', '新宿', '浅草寺', '银座', '迪士尼', '上野', '秋叶原', '成田机场'],
  '首尔': ['明洞', '东大门', '弘大', '景福宫', '梨泰院', '仁川机场', '江南', '济州岛'],
  '新加坡': ['滨海湾', '圣淘沙', '乌节路', '樟宜机场', '牛车水', '小印度', '植物园', '克拉码头'],
  '吉隆坡': ['双子塔', '茨厂街', '阿罗街', '中央车站', '云顶', '黑风洞', '国际机场', '武吉免登'],
  '纽约': ['时代广场', '中央公园', '华尔街', '自由女神', '百老汇', 'JFK机场', '第五大道', '布鲁克林桥'],
  '伦敦': ['白金汉宫', '大本钟', '伦敦塔', '泰晤士河', '希思罗机场', '牛津街', '大英博物馆', '海德公园'],
  '巴黎': ['埃菲尔铁塔', '卢浮宫', '香榭丽舍', '凯旋门', '戴高乐机场', '巴黎圣母院', '蒙马特', '凡尔赛宫'],
  '迪拜': ['哈利法塔', '帆船酒店', '棕榈岛', '迪拜购物中心', '国际机场', '黄金市场', '沙漠探险', '帆船酒店'],
  '悉尼': ['悉尼歌剧院', '海港大桥', '邦迪海滩', '塔龙加动物园', '金斯福德机场', '达令港', '岩石区', '蓝山'],
  '当前位置': ['市中心', '机场', '火车站', '商业区', '景区', '高校', '医院', '地铁站'],
};

const COUNTRY_CITIES: { [key: string]: string[] } = {
  '泰国': ['曼谷', '清迈', '普吉岛', '芭提雅', '苏梅岛'],
  '日本': ['东京', '大阪', '京都', '北海道', '冲绳'],
  '韩国': ['首尔', '釜山', '济州岛', '仁川', '大邱'],
  '新加坡': ['新加坡'],
  '马来西亚': ['吉隆坡', '槟城', '亚庇', '马六甲', '兰卡威'],
  '美国': ['纽约', '洛杉矶', '旧金山', '芝加哥', '迈阿密'],
  '英国': ['伦敦', '爱丁堡', '曼彻斯特', '伯明翰', '利物浦'],
  '法国': ['巴黎', '尼斯', '里昂', '马赛', '波尔多'],
  '德国': ['柏林', '慕尼黑', '法兰克福', '科隆', '汉堡'],
  '意大利': ['罗马', '米兰', '威尼斯', '佛罗伦萨', '那不勒斯'],
  '阿联酋': ['迪拜', '阿布扎比'],
  '澳大利亚': ['悉尼', '墨尔本', '布里斯班', '黄金海岸', '珀斯'],
};

const HOTEL_BRANDS = ['不限', '万豪', '希尔顿', '洲际', '凯悦', '雅高', '香格里拉', '四季', '安缦', '悦榕庄'];
const HOTEL_RATINGS = ['不限', '5星', '4星', '3星及以下'];
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
function findCountryByCity(cityName: string): string | undefined {
      return Object.entries(COUNTRY_CITIES).find(([, cities]) =>
        cities.includes(cityName)
      )?.[0];
    }
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
export default function OverseasSearch({ value, onChange, onSearch }: OverseasSearchFormProps) {
  

    // 初始化时：value.city 是城市名，不是国家名
    const [country, setCountry] = useState(() => {
      if (value.city) {
        return findCountryByCity(value.city) || '泰国';
      }
      return '泰国';
    });

    const [city, setCity] = useState(() => {
      if (value.city && findCountryByCity(value.city)) {
        return value.city;  // 是已知海外城市，直接用
      }
      return '曼谷';  // 否则默认曼谷
    });
  const [keyword, setKeyword] = useState('');
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('不限');
  const [selectedRating, setSelectedRating] = useState('不限');
  const [selectedPrice, setSelectedPrice] = useState('不限');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cityTags, setCityTags] = useState<string[]>(CITY_TAGS[city] || CITY_TAGS['曼谷']);
  const [filterVisible, setFilterVisible] = useState(false);
  const [roomGuestVisible, setRoomGuestVisible] = useState(false);
  const [roomCount, setRoomCount] = useState(value.roomCount || 1);
  const [guestCount, setGuestCount] = useState(value.guestCount || 1);
  // 根据城市反查国家
    
  // 地图选点
  const [mapVisible, setMapVisible] = useState(false);
  const [searchLat, setSearchLat] = useState<number | undefined>();
  const [searchLng, setSearchLng] = useState<number | undefined>();

    useEffect(() => {
    if (value.city) {
      const matched = findCountryByCity(value.city);
      if (matched) {
        setCountry(matched);
        setCity(value.city);
      }
      // 如果不是已知海外城市（如"上海"），不做任何修改
    }
  }, [value.city]);

  useEffect(() => {
    const cities = COUNTRY_CITIES[country] || COUNTRY_CITIES['泰国'];
    if (cities && cities.length > 0 && !cities.includes(city)) {
      setCity(cities[0]);
    }
  }, [country]);

  useEffect(() => {
    setCityTags(CITY_TAGS[city] || CITY_TAGS['曼谷']);
    setSelectedTags([]);
  }, [city]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (end) setCalendarVisible(false);
  };

  const nights =
    startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;

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
        <span className={styles.nightsInfo}>{nights > 0 ? `${nights}晚` : ''}</span>
        <span className={styles.endDate}>
          {endDate ? `${endDate.getMonth() + 1}月${endDate.getDate()}日` : '-'}
        </span>
      </div>
    </div>
  );

  // 地图选点 → 打开 LocationPicker
  const handleLocation = () => {
    setMapVisible(true);
  };

  // 地图选点确认
  const handleMapConfirm = (loc: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
  }) => {
    setMapVisible(false);
    setSearchLat(loc.lat);
    setSearchLng(loc.lng);

    if (loc.city) {
      setCity(loc.city);
      // 尝试匹配国家
      const matchedCountry = Object.entries(COUNTRY_CITIES).find(([, cities]) =>
        cities.includes(loc.city!)
      );
      if (matchedCountry) {
        setCountry(matchedCountry[0]);
      }
    }
  };
  
  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
    const collectFormData = (): SearchFormData => {
        const priceRange = parsePriceRange(selectedPrice);
        return {
          region: 'overseas',
          city: city || '曼谷',
          keyword,
          dates: startDate && endDate ? [startDate, endDate] : undefined,
          brand: selectedBrand !== '不限' ? selectedBrand : undefined,
          starLevels: parseStarLevel(selectedRating),
          minPrice: priceRange.minPrice,
          maxPrice: priceRange.maxPrice,
          roomCount,
          guestCount,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          lat: searchLat,
          lng: searchLng,
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
        <div className={styles.inputGroup}>
          <Button
            fill="none"
            onClick={() => setCountryVisible(true)}
            className={styles.cityButton}
          >
            {country}
          </Button>
          <Button
            fill="none"
            onClick={() => setCityVisible(true)}
            className={styles.cityButton}
          >
            {city}
            <RightOutline />
          </Button>
          <Input
            placeholder="酒店名称/地标/关键词"
            value={keyword}
            onChange={setKeyword}
            className={styles.searchInput}
            clearable
          />
          <Button fill="none" className={styles.locationBtn} onClick={handleLocation}>
            <LocationOutline />
          </Button>
        </div>

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

        <div className={styles.roomGuestRow}>
          <div
            className={styles.roomGuestButton}
            onClick={() => setRoomGuestVisible(true)}
          >
            <span className={styles.roomGuestLabel}>房间</span>
            <span className={styles.roomGuestValue}>{roomCount}</span>
            <span className={styles.roomGuestLabel}>间</span>
            <span className={styles.roomGuestDivider}>/</span>
            <span className={styles.roomGuestLabel}>人数</span>
            <span className={styles.roomGuestValue}>{guestCount}</span>
            <span className={styles.roomGuestLabel}>人</span>
          </div>
        </div>

        <div className={styles.tagContainer}>
          <div className={styles.tagScroll}>
            {cityTags.map((tag) => (
              <Tag key={tag} label={tag} active={selectedTags.includes(tag)} onClick={() => handleTagClick(tag)} />
            ))}
          </div>
        </div>

        <Button
          color="primary"
          block
          size="large"
          onClick={handleInternalSearch}
          className={styles.searchButton}
        >
          查 询
        </Button>

        {/* 日历弹窗 */}
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

        {/* 国家弹窗 */}
        <Popup
          visible={countryVisible}
          onMaskClick={() => setCountryVisible(false)}
          position="bottom"
          className={styles.cityPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>选择国家/地区</h3>
            <Input placeholder="搜索国家/地区" />
            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>热门国家</div>
              <Space wrap className={styles.horizontalSpace}>
                {Object.keys(COUNTRY_CITIES).map((countryItem) => (
                  <Button
                    key={countryItem}
                    fill="outline"
                    onClick={() => {
                      setCountry(
                        countryItem.length > 8
                          ? countryItem.substring(0, 8) + '...'
                          : countryItem
                      );
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

        {/* 城市弹窗 */}
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
                {(COUNTRY_CITIES[country] || COUNTRY_CITIES['泰国']).map(
                  (cityItem) => (
                    <Button
                      key={cityItem}
                      fill="outline"
                      onClick={() => {
                        setCity(
                          cityItem.length > 8
                            ? cityItem.substring(0, 8) + '...'
                            : cityItem
                        );
                        setCityVisible(false);
                      }}
                    >
                      {cityItem}
                    </Button>
                  )
                )}
              </Space>
            </div>
          </div>
        </Popup>

        {/* 筛选弹窗 */}
       <Popup
          visible={filterVisible}
          onMaskClick={() => setFilterVisible(false)}
          position="bottom"
          className={styles.filterPopup}
        >
          <div className={styles.filterScrollArea}>
            <h3 className={styles.popupTitle}>筛选条件</h3>

            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>热门地标</div>
              <div className={styles.popupTagWrap}>
                {cityTags.map((tag) => (
                  <Tag key={tag} label={tag} active={selectedTags.includes(tag)} onClick={() => handleTagClick(tag)} />
                ))}
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>酒店品牌</div>
              <div className={styles.popupTagWrap}>
                {HOTEL_BRANDS.map((brand) => (
                  <Tag key={brand} label={brand} active={selectedBrand === brand} onClick={() => setSelectedBrand(brand)} />
                ))}
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>酒店星级</div>
              <div className={styles.popupTagWrap}>
                {HOTEL_RATINGS.map((rating) => (
                  <Tag key={rating} label={rating} active={selectedRating === rating} onClick={() => setSelectedRating(rating)} />
                ))}
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>价格区间</div>
              <div className={styles.popupTagWrap}>
                {['不限', '0-500', '500-1000', '1000-2000', '2000+'].map((priceRange) => (
                  <Tag key={priceRange} label={priceRange} active={selectedPrice === priceRange} onClick={() => setSelectedPrice(priceRange)} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.filterFooter}>
            <Button color="primary" block size="large" onClick={() => setFilterVisible(false)}>
              确定
            </Button>
          </div>
        </Popup>
        {/* 房间/人数弹窗 */}
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
                  onClick={() => setRoomCount((prev: number) => Math.max(1, prev - 1))}
                  disabled={roomCount <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{roomCount}</span>
                <Button
                  fill="none"
                  size="small"
                  onClick={() => setRoomCount((prev: number) => Math.min(10, prev + 1))}
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
                  onClick={() =>
                    setGuestCount((prev: number) => Math.max(1, prev - 1))
                  }
                  disabled={guestCount <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{guestCount}</span>
                <Button
                  fill="none"
                  size="small"
                  onClick={() =>
                    setGuestCount((prev: number) => Math.min(20, prev + 1))
                  }
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
              onClick={() => {
                setRoomGuestVisible(false);
                onChange({ ...value, roomCount, guestCount });
              }}
              style={{ marginTop: 24 }}
            >
              确定
            </Button>
          </div>
        </Popup>

        {/* 地图选点弹窗 */}
        <Popup
          visible={mapVisible}
          onMaskClick={() => setMapVisible(false)}
          position="bottom"
          bodyStyle={{
            height: '85vh',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
          destroyOnClose
        >
          {mapVisible && (
            <LocationPicker
              onConfirm={handleMapConfirm}
              onCancel={() => setMapVisible(false)}
            />
          )}
        </Popup>
      </Space>
    </div>
  );
}