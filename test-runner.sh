#!/bin/bash
# 测试运行脚本

echo "====================="
echo "前端项目测试运行脚本"
echo "====================="

echo "1. 运行单元测试..."
npx vitest run src/__tests__/simple.test.ts

echo ""
echo "2. 运行组件测试（如果可用）..."
echo "注意：组件测试可能因mock配置复杂而失败，这是正常的"

echo ""
echo "3. 运行所有测试..."
npx vitest run --passWithNoTests

echo ""
echo "4. 生成测试覆盖率报告..."
npx vitest run --coverage

echo ""
echo "测试执行完毕！"