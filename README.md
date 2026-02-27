# TripCom 酒店预订应用

基于 React + TypeScript + Vite 构建的现代化酒店预订移动应用。

---

## 项目介绍

TripCom 是一个功能完善的酒店预订移动端应用，提供酒店搜索、列表浏览、详情查看等核心功能。项目采用现代化技术栈构建，具有良好的代码结构和用户体验。

**主要特性**:
- 酒店搜索与筛选
- 无限滚动加载
- 响应式移动端设计
- 模拟数据降级方案
- 完整的 TypeScript 类型支持
- 高德地图集成

## 快速开始

### 环境要求

| 工具 | 要求版本 | 说明 |
|------|----------|------|
| Node.js | >= 18.x | 推荐使用 LTS 版本 |
| npm | >= 9.x | 包管理器 |
| 浏览器 | Chrome / Safari / Edge 最新版 | 推荐移动端浏览器 |

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd hotel-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器将在 `http://localhost:5173` 启动

## 项目结构

```
hotel-app/
├── src/                        # 源代码目录
│   ├── __tests__/             # 测试文件
│   ├── api/                    # API 接口层
│   ├── components/             # 公共组件
│   ├── config/                 # 配置文件
│   ├── data/                   # 模拟数据
│   ├── hooks/                  # 自定义 Hooks
│   ├── pages/                  # 页面组件
│   │   ├── HomePage/          # 首页（搜索页）
│   │   ├── HotelListPage/     # 酒店列表页
│   │   └── DetailPage/        # 酒店详情页
│   ├── router/                 # 路由配置
│   ├── services/               # 业务逻辑服务
│   ├── types/                  # TypeScript 类型定义
│   ├── App.tsx                 # 应用根组件
│   └── main.tsx                # 应用入口
├── public/                     # 静态资源
├── ARCHITECTURE.md             # 技术架构文档
├── USER_GUIDE.md               # 用户使用手册
├── PROJECT_FIXES.md            # 项目修复文档
└── TESTING.md                  # 测试文档
```

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 前端框架 |
| TypeScript | 5.9.3 | 类型系统 |
| Vite | 7.2.5 | 构建工具 |
| Antd Mobile | 5.42.3 | 移动端 UI 组件库 |
| React Router | 7.13.0 | 路由管理 |
| TanStack React Query | 5.90.21 | 服务端状态管理 |
| Axios | 1.13.5 | HTTP 请求库 |
| Vitest | 4.0.18 | 单元测试框架 |
| ESLint | 9.39.1 | 代码质量检查 |

## 核心功能

### 首页（HomePage）
- 酒店搜索表单
- 国内/海外/钟点房/民宿 Tab 切换
- 城市选择（集成高德地图）
- 日期选择（入住/退房日期）
- 标签筛选
- 广告横幅展示

### 酒店列表页（HotelListPage）
- 搜索结果列表展示
- 排序功能（默认/价格升序/价格降序/评分）
- 快捷标签筛选
- 无限上滑加载更多
- 固定头部导航

### 酒店详情页（DetailPage）
- 酒店图片轮播
- 酒店基本信息展示
- 评分与评价数量
- 地图定位显示
- 房型列表展示
- 底部预订操作栏

## 文档

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 技术架构、开发指南 |
| [USER_GUIDE.md](./USER_GUIDE.md) | 用户使用手册 |
| [PROJECT_FIXES.md](./PROJECT_FIXES.md) | 修复记录、打包指南 |
## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产构建


## 常见问题

**Q: 如何配置自己的高德地图 API Key？**  
A: 在 `src/components/LocationPick/LocationPick.tsx` 中修改 `AMAP_KEY` 变量。

**Q: 如何修改 API 基础 URL？**  
A: 在 `.env` 文件中修改 `VITE_API_BASE_URL` 环境变量。

## License

MIT
