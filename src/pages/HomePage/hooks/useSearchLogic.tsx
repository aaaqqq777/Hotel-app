// src/hooks/useSearchLogic.ts
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';

// 定义所有可能的搜索数据类型
export interface SearchData {
  searchType: 'domestic' | 'overseas' | 'hourly' | 'bnb';
  city?: string;
  keyword?: string;
  dates?: [Date, Date];
  brand?: string;
  priceRange?: [number, number];
  tags?: string[];
  roomCount?: number;
  guestCount?: number;
}

export function useSearchLogic() {
  const navigate = useNavigate();

  // 这是我们暴露给所有表单的【统一查询函数】
  const handleFinalSearch = (data: Partial<SearchData>) => {
    console.log('采集到的最终搜索信息:', data);

    // 1. 数据校验和默认值处理
    // 确保domestic类型始终有城市值
    if (data.searchType === 'domestic' && !data.city) {
      data.city = '上海';
      console.log('使用默认城市: 上海');
    }
        // 修改 useSearchLogic.tsx 中的校验逻辑
    if (data.searchType !== 'hourly' && !data.dates) {
      // 设置默认日期：今天入住，明天离店
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      data.dates = [today, tomorrow];
      console.log('使用默认日期范围:', data.dates);
    }

    // 确保房间数和人数有默认值
    if (!data.roomCount) data.roomCount = 1;
    if (!data.guestCount) data.guestCount = 1;

    // 2. 将数据对象转换为 URL 查询字符串
    const params = new URLSearchParams();
    for (const key in data) {
      const value = data[key as keyof SearchData];
      if (value) {
        // 对数组等复杂类型进行处理
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value.toString());
        }
      }
    }

    // 3. 执行跳转
    Toast.show({ content: '正在查询...', icon: 'loading' });
    navigate(`/Hotellist?${params.toString()}`);
  };

  // 返回这个核心函数
  return { handleFinalSearch };
}
