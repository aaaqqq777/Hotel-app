import { describe, it, expect } from 'vitest';

// 简单的单元测试，不涉及组件渲染
describe('简单测试套件', () => {
  it('应该能正确执行简单测试', () => {
    expect(1 + 1).toBe(2);
  });

  it('应该能正确处理字符串操作', () => {
    const str = 'hello world';
    expect(str.toUpperCase()).toBe('HELLO WORLD');
  });
});