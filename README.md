# TripCom 酒店预订应用

基于 React + TypeScript + Vite 构建的酒店预订移动应用。

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

---

## 📁 项目结构

```
hotel-app/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── config.ts          # axios 配置
│   │   └── hotelsearch/       # 酒店相关API
│   │       └── hotelsearch.ts
│   ├── pages/                  # 页面组件
│   │   ├── HomePage/          # 首页（搜索页）
│   │   ├── HotelListPage/     # 酒店列表页
│   │   └── DetailPage/        # 酒店详情页
│   ├── components/             # 公共组件
│   ├── data/                   # 模拟数据
│   │   ├── hotels.ts          # 酒店列表数据
│   │   └── hotelDetail.ts     # 酒店详情数据
│   ├── services/               # 业务逻辑服务
│   ├── types/                  # TypeScript 类型定义
│   └── router/                 # 路由配置
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📱 页面功能

### 1. 首页（HomePage）
- 酒店搜索表单
- 国内/海外/钟点房/民宿 Tab 切换
- 城市选择
- 日期选择
- 标签筛选
- 广告横幅

### 2. 酒店列表页（HotelListPage）
- 搜索结果展示
- 排序功能（默认/价格/评分）
- 快捷标签筛选
- 无限上滑加载更多
- 固定头部导航
- 滚动时标签栏变化

### 3. 酒店详情页（DetailPage）
- 酒店图片轮播
- 酒店基本信息
- 评分与评价
- 地图定位
- 房型列表
- 酒店设施
- 日期选择

---

## 🔌 API 接口

### 后端接口配置
`src/api/config.ts`

```typescript
API_BASE_URL = 'https://api.your-app.com/v1'
```

### 酒店列表接口
**GET** `/hotels`

请求参数：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | ✅ | 城市名 |
| keyword | string | ❌ | 搜索关键字 |
| star | string | ❌ | 星级 |
| sort | string | ❌ | 排序方式 |
| page | string | ❌ | 页码（默认1） |
| limit | string | ❌ | 每页条数（默认10） |

响应数据：
```typescript
{
  code: number,
  data: {
    total: number,
    list: Array<{
      _id: string
      name_cn: string
      star_rating: number
      score: number
      cover_image: string
      min_price: number
      location: {
        address?: string
        city?: string
        district?: string
      }
    }>
  }
}
```

### 其他接口
- `getHotelDetail(hotelId)` - 获取酒店详情
- `getHotelReviews(hotelId, page, pageSize)` - 获取评价
- `getHotelRoomTypes(hotelId)` - 获取房型
- `getHotelFacilities(hotelId)` - 获取设施
- `getSearchSuggestions(keyword)` - 获取搜索建议

---

## 📊 数据类型

### Hotel（酒店概要）
```typescript
interface Hotel {
  id: string
  name: string
  imageUrl: string
  price: number
  rating: number
  location: string
  starLevel: number
  reviewCount?: number
  distance?: string
  mapUrl?: string
}
```

### HotelDetail（酒店详情）
```typescript
interface HotelDetail extends Hotel {
  address: string
  phone: string
  description: string
  facilities: Facility[]
  checkInTime: string
  checkOutTime: string
  images: string[]
}
```

---

## 🎨 技术栈

| 技术 | 版本 |
|------|------|
| React | 18.x |
| TypeScript | 5.x |
| Vite | 7.x |
| Antd Mobile | 5.x |
| React Router | 6.x |
| Axios | 1.x |

---

## 🔄 数据流

### 搜索流程
```
首页填写表单
    ↓
URL参数传递
    ↓
HotelListPage 接收
    ↓
searchHotelList API
    ↓
后端返回数据
    ↓
数据转换为 Hotel[]
    ↓
渲染列表
```

### 上滑加载
```
滚动到底部
    ↓
IntersectionObserver 检测
    ↓
loadMoreHotels()
    ↓
请求下一页数据
    ↓
追加到现有列表
```

---

## 📝 开发说明

### 模拟数据
- 所有API都有模拟数据降级方案
- 当后端请求失败时自动返回模拟数据
- 模拟数据位置：`src/data/`

### 样式管理
- 使用 CSS Modules
- 全局样式变量在对应模块文件中定义

---

## 📄 License

MIT
