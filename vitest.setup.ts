// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// 在每个测试后清理 DOM
afterEach(() => {
  cleanup();
});