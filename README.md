# TripCom 酒店预订应用

基于 React + TypeScript + Vite 构建的现代化酒店预订移动应用。

---

## � 目录

- [项目介绍](#项目介绍)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [页面功能](#页面功能)
- [技术栈](#技术栈)
- [数据流](#数据流)
- [API 接口](#api-接口)
- [数据类型](#数据类型)
- [开发指南](#开发指南)
- [常见问题](#常见问题)
- [测试](#测试)
- [License](#license)

---

## 项目介绍

TripCom 是一个功能完善的酒店预订移动端应用，提供酒店搜索、列表浏览、详情查看等核心功能。项目采用现代化技术栈构建，具有良好的代码结构和用户体验。

## 环境要求

| 工具 | 要求版本 | 说明 |
|------|----------|------|
| Node.js | >= 18.x | 推荐使用 LTS 版本 |
| npm | >= 9.x | 包管理器 |
| 浏览器 | Chrome / Safari / Edge 最新版 | 推荐移动端浏览器 |

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd hotel-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动

### 4. 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 5. 预览生产构建
```bash
npm run preview
```

## 项目结构

```
hotel-app/
├── .trae/                      # IDE 配置目录
│   └── rules/                 # 项目规则配置
├── public/                     # 静态资源
├── src/                        # 源代码目录
│   ├── __tests__/             # 测试文件
│   │   ├── basic.test.tsx
│   │   ├── detailpage.test.tsx
│   │   ├── homepage.test.tsx
│   │   ├── hotellist.test.tsx
│   │   ├── responsive.test.tsx
│   │   └── test-utils.tsx
│   ├── api/                    # API 接口层
│   │   ├── advertisement/     # 广告相关 API
│   │   ├── hotel/             # 酒店相关 API
│   │   ├── modules/           # API 模块
│   │   ├── config.ts          # API 配置
│   │   ├── index.ts           # API 入口
│   │   └── service.ts         # API 服务
│   ├── assets/                 # 资源文件
│   ├── components/             # 公共组件
│   │   ├── Calendar/          # 日历组件
│   │   ├── Hearder/           # 头部组件
│   │   ├── LocationPick/      # 位置选择组件
│   │   ├── PeriodCalendar/    # 日期范围选择组件
│   │   └── ErrorBoundary.tsx  # 错误边界组件
│   ├── config/                 # 配置文件
│   │   └── reactQuery.ts      # React Query 配置
│   ├── data/                   # 模拟数据
│   │   └── MOCK/              # 模拟数据目录
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useApi.ts          # API Hook（已弃用，使用 React Query）
│   │   └── useHotelQueries.ts # 酒店相关查询 Hook
│   ├── pages/                  # 页面组件
│   │   ├── HomePage/          # 首页（搜索页）
│   │   ├── HotelListPage/     # 酒店列表页
│   │   ├── DetailPage/        # 酒店详情页
│   │   └── calendartest/      # 日历测试页
│   ├── router/                 # 路由配置
│   │   └── index.tsx          # 路由定义
│   ├── services/               # 业务逻辑服务
│   │   └── hotelService.ts    # 酒店服务
│   ├── types/                  # TypeScript 类型定义
│   │   ├── filtertag.ts       # 筛选标签类型
│   │   └── hotel.ts           # 酒店相关类型
│   ├── App.tsx                 # 应用根组件
│   ├── App.module.css          # 应用样式
│   ├── App.css                 # 应用全局样式
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── .env                        # 环境变量
├── .gitignore                  # Git 忽略文件
├── eslint.config.js            # ESLint 配置
├── index.html                  # HTML 模板
├── jest.config.js              # Jest 配置
├── package.json                # 项目配置
├── package-lock.json           # 依赖锁定文件
├── test-runner.bat             # Windows 测试脚本
├── test-runner.sh              # Linux/Mac 测试脚本
├── tsconfig.json               # TypeScript 配置
├── tsconfig.app.json           # 应用 TypeScript 配置
├── tsconfig.node.json          # Node TypeScript 配置
├── vite.config.ts              # Vite 配置
├── vitest.config.ts            # Vitest 配置
├── vitest.setup.ts             # Vitest 初始化文件
├── README.md                   # 项目文档
└── TESTING.md                  # 测试文档
```

## 页面功能

### 1. 首页（HomePage）
- 酒店搜索表单
- 国内/海外/钟点房/民宿 Tab 切换
- 城市选择（集成高德地图）
- 日期选择（入住/退房日期）
- 标签筛选
- 广告横幅展示

### 2. 酒店列表页（HotelListPage）
- 搜索结果列表展示
- 排序功能（默认/价格升序/价格降序/评分）
- 快捷标签筛选
- 无限上滑加载更多
- 固定头部导航
- 滚动时标签栏变化动画

### 3. 酒店详情页（DetailPage）
- 酒店图片轮播
- 酒店基本信息展示
- 评分与评价数量
- 地图定位显示
- 房型列表展示
- 酒店设施标签
- 日期选择组件
- 底部预订操作栏

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 前端框架 |
| TypeScript | 5.9.3 | 类型系统 |
| Vite (Rolldown) | 7.2.5 | 构建工具 |
| Antd Mobile | 5.42.3 | 移动端 UI 组件库 |
| Antd Mobile Icons | 0.3.0 | 图标库 |
| React Router | 7.13.0 | 路由管理 |
| TanStack React Query | 5.90.21 | 服务端状态管理与数据缓存 |
| Axios | 1.13.5 | HTTP 请求库 |
| date-fns | 4.1.0 | 日期处理工具库 |
| Vitest | 4.0.18 | 单元测试框架 |
| Testing Library | 16.3.2 | React 组件测试库 |
| ESLint | 9.39.1 | 代码质量检查 |

## 数据流

### 搜索流程
```
首页填写搜索表单
    ↓
更新 URL 查询参数
    ↓
HotelListPage 监听 URL 变化
    ↓
调用 useHotelQueries Hook
    ↓
React Query 触发 API 请求
    ↓
后端返回数据 / 使用模拟数据
    ↓
数据转换为 HotelListItem[]
    ↓
渲染酒店列表
```

### 上滑加载更多
```
用户滚动列表
    ↓
IntersectionObserver 检测到底部
    ↓
触发 loadMore 回调
    ↓
更新页码参数
    ↓
React Query 获取下一页数据
    ↓
追加到现有列表
    ↓
更新页面显示
```

### 酒店详情流程
```
点击酒店卡片
    ↓
跳转到详情页
    ↓
useHotelQueries 获取酒店详情
    ↓
渲染详情页面
    ↓
用户选择日期和房型
    ↓
显示预订信息
```

## API 接口

### API 配置
项目使用 React Query 进行数据管理，配置文件位于 `src/config/reactQuery.ts`

主要配置：
- `staleTime`: 5 分钟（数据新鲜时间）
- `gcTime`: 10 分钟（缓存时间）
- `refetchOnWindowFocus`: false（窗口聚焦时不重新获取）
- `retry`: 2 次（失败重试次数）

### 酒店搜索接口
**接口文件**: `src/api/hotel/hotelSearch.ts`

### 酒店详情接口
**接口文件**: `src/api/hotel/hotelDetail.ts`

### 广告接口
**接口文件**: `src/api/advertisement/advertisement.ts`

### 模拟数据
所有 API 都有模拟数据降级方案，模拟数据位置：`src/data/MOCK/`

## 数据类型

### HotelSearchParams（酒店搜索参数）
```typescript
interface HotelSearchParams {
  city: string;
  keyword?: string;
  checkInDate: string;
  checkOutDate: string;
  minPrice?: number;
  maxPrice?: number;
  roomCount?: number;
  guestCount?: number;
  starLevels?: number;
  brands?: string[];
  score?: number;
  sortBy?: 'price' | 'distance' | 'rating' | 'star' | '';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
  lat?: number;
  lng?: number;
  tags?: string[];
}
```

### HotelListItem（酒店列表项）
```typescript
interface HotelListItem {
  id: string;
  name: string;
  coverImage: string;
  images?: string[];
  starLevel: number;
  rating: number;
  reviewCount: number;
  price: {
    lowest: number;
    original?: number;
    discount?: number;
  };
  location: {
    city: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number;
  };
  roomAvailability: {
    hasAvailableRoom: boolean;
    lowestRoomPrice?: number;
  };
  tags?: string[];
}
```

### HotelDetail（酒店详情）
```typescript
interface HotelDetail {
  id: string;
  name: string;
  starLevel: number;
  brand?: string;
  images: string[];
  videoUrl?: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone?: string;
  };
  checkInTime: string;
  checkOutTime: string;
  facilities: string[];
  rating?: number;
  reviewCount: number;
}
```

### RoomType（房型）
```typescript
interface RoomType {
  id: string;
  name: string;
  area: number;
  image: string;
  maxOccupancy: number;
  price: {
    current: number;
    original?: number;
    discount?: number;
  };
  availability: {
    remaining: number;
    isSoldOut: boolean;
  };
  description?: string;
  tags?: string[];
}
```

### BannerData（广告横幅）
```typescript
interface BannerData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  hotelId: string;
}
```

## 开发指南

### 代码规范

项目遵循以下开发规范：

1. **分文件原则**: 保持代码模块化，每个功能模块独立文件
2. **样式规范**: 
   - 使用 CSS Modules
   - 不使用 `!important` 避免样式冲突
   - 样式文件与组件文件同名
3. **类型安全**: 充分利用 TypeScript 类型系统
4. **组件命名**: 使用 PascalCase 命名组件
5. **文件命名**: 使用 kebab-case 或 PascalCase

### 开发流程

1. 创建新分支进行开发
2. 编写代码，遵循项目规范
3. 运行测试确保功能正常
4. 提交代码前运行 lint 检查

### 添加新页面

1. 在 `src/pages/` 下创建新页面目录
2. 创建页面组件和样式文件
3. 在 `src/router/index.tsx` 中添加路由配置
4. 如有需要，在 `src/types/` 中添加类型定义

### 添加新 API

1. 在 `src/api/` 对应模块下创建接口文件
2. 在 `src/hooks/useHotelQueries.ts` 中添加查询 Hook
3. 如有需要，在 `src/data/MOCK/` 中添加模拟数据

## 常见问题

### Q: 如何配置高德地图 API Key？
A: 在 `src/components/LocationPick/LocationPick.tsx` 中修改 `AMAP_KEY` 变量为你的高德 JS API Key。

### Q: 如何修改 API 基础 URL？
A: API 配置目前使用模拟数据，如需连接真实后端，可在 `src/api/config.ts` 中配置（当前已注释）。

### Q: 项目无法启动怎么办？
A: 
1. 确认 Node.js 版本 >= 18.x
2. 删除 `node_modules` 和 `package-lock.json` 重新安装依赖
3. 检查端口 5173 是否被占用

### Q: 如何运行测试？
A: 参考 [TESTING.md](./TESTING.md) 文档，或运行 `npm run test:run` 执行所有测试。

### Q: 样式不生效怎么办？
A: 
1. 确认使用 CSS Modules 正确导入样式
2. 检查类名是否正确使用
3. 避免使用 `!important`

## 测试

项目使用 Vitest 和 Testing Library 进行测试，详细测试文档请参考 [TESTING.md](./TESTING.md)。

### 常用测试命令

```bash
# 运行所有测试
npm run test:run

# 以交互模式运行测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 启动测试 UI 界面
npm run test:ui
```

## 📄 License

MIT
