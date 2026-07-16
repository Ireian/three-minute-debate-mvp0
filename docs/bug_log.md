# MVP-0 Bug Log

## BUG-001：首次生产构建未通过 TypeScript 检查

- 日期：2026-07-16
- 状态：已修复
- 发现阶段：Vertical Slice 01 构建验收

### 复现步骤

1. 安装项目依赖。
2. 运行 `npm.cmd run build`。

### 预期结果

TypeScript 类型检查通过，Vite 生成生产构建。

### 实际结果

类型检查报告两个错误：

- 无法找到 `./style.css` 副作用导入的类型声明；
- DOM 挂载点在 `render()` 闭包中仍被视为可能为 `null`。

### 根因

- `tsconfig.json` 没有加载 Vite 提供的客户端类型声明；
- 当前 TypeScript 版本没有将外层 DOM 空值检查保留到内部函数闭包。

### 修复

- 在 TypeScript 配置中加入 `vite/client` 类型；
- 完成空值检查后，将挂载点保存为明确的 `HTMLElement` 引用。

### 回归验证

重新运行 `npm.cmd run build`。

### 验证结果

类型检查通过；Vite 成功生成 HTML、CSS 和 JavaScript 生产文件。

### T5 回归确认

2026-07-16 再次运行完整规则测试、100 个固定随机种子的模拟对局和 production build；BUG-001 未复现。
