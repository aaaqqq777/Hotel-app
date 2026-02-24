import { describe, it, expect } from 'vitest';
import { render } from './test-utils';

describe('基本测试', () => {
  it('应能成功导入测试工具', () => {
    expect(render).toBeDefined();
  });
});