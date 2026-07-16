# MVP-0 Focus Block Log

## Block 01：Vertical Slice 01

- 原计划：初始化 TypeScript + Vite 项目；显示双方完整度和一张可点击卡牌；点击后更新对手完整度。
- 实际结果：完成。页面从 10 / 10 开始，点击卡牌后变为玩家 10、对手 7；生产构建通过；浏览器控制台无错误；Git 仓库已初始化。
- Blocker：PowerShell 禁止执行 `npm.ps1`；改用同一 Node 安装中的 `npm.cmd`。首次构建发现两个 TypeScript 类型问题，见 BUG-001。应用内浏览器无法访问本机开发端口，改用本机 Chrome 完成交互验收。
- 下一个最小动作：T2，只增加纯游戏状态、固定对手回应和五回合流程，不增加其余卡牌。

