# 酒店列表页面数据架构说明

## 🏗️ 分层结构

```
数据层 (Data Layer)
├── src/data/types.ts          # 类型定义
├── src/data/hotels.ts         # 预存数据（便于后期转换为 API 调用）
│
业务逻辑层 (Business Logic)
├── src/services/hotelService.ts  # 数据处理服务（过滤、排序等）
│
UI 层 (Presentation Layer)
├── src/pages/HotelListPage/
│   ├── HotelListPage.tsx       # 主页面（组件逻辑 + UI 渲染）
│   ├── HotelCard/              # 酒店卡片组件
│   ├── QuickTagsBar/           # 快捷筛选条
│   ├── SortBar/                # 排序条
│   └── FliterBar/              # 筛选条
```

## 📋 各层职责

### 1️⃣ 数据层 (`src/data/`)

**types.ts** - 类型定义
- `Hotel`: 酒店数据模型
- `QuickTag`: 快捷标签模型
- `SortType`: 排序类型
- `HotelFilterParams`: 过滤参数

**hotels.ts** - 预存数据
```typescript
export const MOCK_HOTELS: Hotel[] = [
  // 酒店数据...
]

export const QUICK_TAGS: QuickTag[] = [
  // 标签数据...
]
```

### 2️⃣ 业务逻辑层 (`src/services/`)

**hotelService.ts** - 数据处理服务

主要函数：
- `getHotels()` - 获取所有酒店
- `getProcessedHotels(filterParams, sortType)` - 获取处理后的数据
  - 支持多维度过滤：关键字、星级、价格、标签
  - 支持4种排序：默认、价格低→高、价格高→低、评分

### 3️⃣ UI 层 (`src/pages/HotelListPage/`)

**HotelListPage.tsx** - 主页面（简化版）
```typescript
// 只保留组件状态和 UI 逻辑
const [sortType, setSortType] = useState<SortType>('default')
const [selectedTags, setSelectedTags] = useState<string[]>([])

// 直接调用服务获取数据
const processedHotels = useMemo(() => {
  return getProcessedHotels(filterParams, sortType)
}, [filterParams, sortType])
```

## 🔄 数据流向

```
搜索参数 (URL Query)
    ↓
组合用户选中的快捷标签
    ↓
getProcessedHotels(filterParams, sortType)
    ↓
过滤（keyword, star, price, tags）
    ↓
排序（price-asc, price-desc, rating, default）
    ↓
返回处理后的酒店列表
    ↓
渲染 UI（HotelCard 组件）
```

## ✨ 优势

| 优势 | 说明 |
|-----|------|
| **易于维护** | 数据、逻辑、UI 分离，职责清晰 |
| **易于测试** | 业务逻辑层可独立单元测试 |
| **易于扩展** | 新增过滤条件只需修改 `hotelService.ts` |
| **易于替换** | 后期只需修改 `getHotels()` 调用 API 即可 |
| **性能优化** | 使用 `useMemo` 避免不必要的重新计算 |

## 🔄 后期转换为 API 调用

只需修改 `src/services/hotelService.ts` 中的 `getHotels()` 函数：

```typescript
export async function getHotels(): Promise<Hotel[]> {
  const response = await fetch('/api/hotels')
  return response.json()
}
```

其他代码无需修改！

## 📊 前端渲染观测

- 快捷标签：支持多选
- 排序方式：实时切换
- 过滤条件：自动重新计算
- 列表更新：即时反应

所有功能都是**实时交互**，便于观测前端渲染效果。
