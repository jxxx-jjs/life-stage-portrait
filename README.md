# 人生阶段画像器 MVP

人生阶段画像器是一个轻量级的人生阶段测试产品。用户完成 15 道单选题后，系统会基于本地 JSON 评分规则生成一份人生阶段分析报告，并提供一张适合截图分享的结果卡片。

当前版本是公开测试用 MVP：不需要登录，不接数据库，不接支付，不依赖外部分析服务，也不需要 Node 服务端运行。

## 产品介绍

这个产品用于帮助用户观察自己当前的人生阶段、核心矛盾、行为模式和未来 30 天的行动方向。

它不是心理诊断工具，也不会给用户贴负面标签。报告文案尽量保持冷静、真实、克制，同时给出可以立即开始的小行动。

## 产品目标

- 用较短时间帮助用户获得一个清晰的人生阶段画像
- 降低用户面对迷茫时的抽象感，把问题拆成可理解的阶段和行动建议
- 提供适合手机端阅读和截图分享的测试结果
- 用最小功能验证产品方向、文案风格和传播效果

## 当前功能

- 首页强钩子文案
- 测试开始说明页
- 15 道人生阶段测试题
- 一次显示一道题
- 当前进度和进度条
- 点击选项后自动进入下一题
- 答案临时保存到浏览器 `sessionStorage`
- 基于本地 JSON 规则计算 4 种人生阶段结果
- 高级分析报告页
- 可截图分享的结果卡片
- 隐私说明和免责声明
- 手机端优先适配

当前 4 种人生阶段：

- 蓄势启动者
- 稳进承载者
- 多元探索者
- 价值创造者

## 技术架构

当前项目不是 Next.js 项目，也没有使用前端框架。

- 页面：原生 HTML
- 样式：原生 CSS
- 交互：原生 JavaScript
- 数据：JSON 文件
- 状态保存：浏览器 `sessionStorage`
- 部署形态：纯静态站点

结果计算流程：

```text
用户答题
  -> quiz 页面保存答案到 sessionStorage
  -> result 页面读取答案
  -> 根据 data/scoring.json 计算阶段类型
  -> 从 data/reports.json 读取对应报告
  -> 渲染分析报告和分享卡片
```

## 项目目录结构

```text
.
├── README.md
├── _redirects             # Cloudflare Pages 静态重定向规则
├── index.html             # 首页
├── package.json           # 本地静态预览脚本
├── data/
│   ├── questions.json     # 15 道测试题
│   ├── scoring.json       # 本地评分规则
│   └── reports.json       # 4 种人生阶段报告模板
├── start/
│   └── index.html         # 测试开始说明页
├── quiz/
│   └── index.html         # 答题页
└── result/
    └── index.html         # 结果报告页
```

## 本地运行方式

项目是纯静态站点，但由于页面需要通过 `fetch()` 读取 `data/*.json`，不建议直接用 `file://` 打开 HTML。

在项目根目录运行：

```bash
npm run dev
```

或直接运行：

```bash
python3 -m http.server 8000
```

启动后访问：

```text
http://127.0.0.1:8000/
```

主要页面：

```text
/         首页
/start/   测试说明页
/quiz/    答题页
/result/  结果页
```

## 环境要求

- 支持现代 JavaScript 的浏览器
- 本地预览需要 Python 3，或任意静态文件服务器
- Cloudflare Pages 部署不需要安装依赖

当前 MVP 不需要配置环境变量，也不需要后端服务。

## 数据说明

- 题目数据在 `data/questions.json`
- 评分规则在 `data/scoring.json`
- 报告文案在 `data/reports.json`

如果用户直接打开 `/result/`，页面会展示默认示例报告，并提示需要完成测试后查看真实结果。

## Cloudflare Pages 部署

推荐配置：

- Framework preset：`None`
- Build command：留空
- Build output directory：项目根目录，通常填写 `/` 或 `.`
- Environment variables：不需要配置

部署后确认以下路径可以访问：

```text
/
/start/
/quiz/
/result/
/data/questions.json
/data/scoring.json
/data/reports.json
```

说明：`_redirects` 是 Cloudflare Pages 的静态重定向规则文件，用于兼容 `/start`、`/quiz`、`/result` 这类无尾斜杠访问。GitHub Pages 不会执行 `_redirects`，但保留该文件不会影响 GitHub Pages 访问。

## GitHub Pages 部署

当前项目已经使用相对路径，适合部署到 GitHub Pages 项目子路径：

```text
https://jxxx-jjs.github.io/life-stage-portrait/
```

部署方式：

1. 将代码推送到 GitHub 仓库 `jxxx-jjs/life-stage-portrait`
2. 打开仓库 `Settings`
3. 进入 `Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`
6. Folder 选择 `/ (root)`
7. 保存后等待 GitHub Pages 构建完成

GitHub Pages 部署后确认以下路径可以访问：

```text
https://jxxx-jjs.github.io/life-stage-portrait/
https://jxxx-jjs.github.io/life-stage-portrait/start/
https://jxxx-jjs.github.io/life-stage-portrait/quiz/
https://jxxx-jjs.github.io/life-stage-portrait/result/
https://jxxx-jjs.github.io/life-stage-portrait/data/questions.json
https://jxxx-jjs.github.io/life-stage-portrait/data/scoring.json
https://jxxx-jjs.github.io/life-stage-portrait/data/reports.json
```

## 隐私说明

当前 MVP 不需要登录，不接数据库，不上传用户答案。答案只临时保存在当前浏览器的 `sessionStorage` 中，用于生成本地结果报告。

## 免责声明

本项目仅用于自我观察和个人成长参考，不构成医学、心理诊断、职业或财务建议。如果用户正在经历持续痛苦、焦虑或高压状态，应优先寻求专业支持。

## 后续开发规划

- 抽离公共 CSS 和 JS，减少页面重复代码
- 增加基础自动化测试和端到端流程测试
- 增加分享卡片导出图片能力
- 增加结果复制和分享能力
- 优化移动端视觉细节和可访问性
- 继续打磨题目、评分维度和报告文案
