// src/api/index.ts
import { createApiService } from './service';

/**
 * API 基础地址
 * - 本地开发 / 联调：从 .env 读取
 * - 兜底：localhost
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * 全局唯一的 api 实例
 * ⚠️ 项目中禁止再创建第二个 axios 实例
 */
export const api = createApiService(API_BASE_URL);

/**
 * 统一导出各业务 API
 * 业务文件中只允许从这里 import
 */
export * from './hotel/hotelSearch';
export * from './hotel/hotelDetail';
export * from './modules/advertisement';