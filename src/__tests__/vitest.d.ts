// src/__tests__/vitest.d.ts
import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): jest.Matchers<void>;
      toHaveClass(className: string): jest.Matchers<void>;
    }
  }
}

export {};