# TripCom 技术架构文档

## 项目架构

项目采用现代化 React 应用架构，基于以下核心原则：

- **组件化设计**：将 UI 拆分为可复用的组件
- **TypeScript 类型安全**：全面的类型定义确保代码质量
- **状态管理**：使用 React Query 管理服务端状态
- **路由管理**：React Router 7 实现页面导航
- **响应式设计**：适配移动端和桌面端

## 分层架构

| 层次 | 职责 | 目录 |
|------|------|------|
| UI 层 | 界面渲染 | `src/pages/` |
| 组件层 | 可复用组件 | `src/components/` |
| 状态层 | 数据管理 | `src/hooks/` |
| 服务层 | 业务逻辑 | `src/services/` |
| API 层 | 网络请求 | `src/api/` |
| 数据层 | 数据模型 | `src/types/` |
| 配置层 | 系统配置 | `src/config/` |

## 核心模块

### 路由系统
**文件**: `src/router/index.tsx`

使用 React Router 7 实现路由管理，支持动态路由和嵌套路由。

### 数据管理
**文件**: `src/hooks/useHotelQueries.ts`

使用 TanStack React Query 进行数据管理：
- 查询缓存
- 自动重试
- 数据失效策略
- 无限滚动

### API 层
**文件**: `src/api/` 目录

模块化 API 设计，每个功能模块独立封装，支持模拟数据降级。

## 开发指南

### 代码规范
1. **分文件原则**: 保持代码模块化
2. **样式规范**: 使用 CSS Modules，不使用 `!important`
3. **类型安全**: 充分利用 TypeScript 类型系统
4. **组件命名**: 使用 PascalCase
5. **文件命名**: 使用 kebab-case 或 PascalCase

### 开发流程
1. 创建新分支
2. 编写代码，遵循项目规范
3. 运行测试
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
