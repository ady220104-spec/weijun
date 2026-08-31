# 二级页面统一设计系统里程碑验收

- 验收对象：`index.html` 与 21 个二级页面
- 本地基址：`http://127.0.0.1:4173/`
- 二级页面正式终验：`2026-08-31T13:33:18Z`
- 首页回归终验：`2026-08-31T13:34:32Z`
- 本地 UX Audit 判定：**PASS**

## 实现范围

- 标准文章页 9/9：共享 Shell、Header、Footer、作者区、上一篇/下一篇；修复 `article-divergence.html` 与 `article-review.html` 的容器闭合；代码块可横滑且可键盘聚焦。
- 长专题/研报页 11/11：共享桌面/手机目录、当前位置、章节跳转；宽表横滑提示；本地图片补齐有意义的 `alt` 与真实固有宽高。
- 文章列表页 1/1：从重复首页结构重构为专用文章档案页；保留 20/20 文章记录，改为独立页头、阅读引导、一篇深色领读、双列文章索引、手机单列、紧凑作者与下载收尾；搜索/清除图标分离，移除 220ms 假等待与筛选动画重放。
- 首页：加载同一 `site-system.css`，保留原视觉方向与页面专属布局；真实人物照、实盘持仓图与既有动效成果保持。
- 全部内页视觉阅读系统：正文不再依赖滚动 Reveal 才显示；统一 50rem 阅读宽度、章节分隔、字阶、图注、代码与表格节奏；长文目录改为桌面轻量侧栏和手机 48px 吸顶栏；手机宽表固定 44rem 最小宽度后横滑，避免列被压成单字宽。

共享真源：

- `site-system.css`：设计 token、组件、响应式、触控、可访问性和克制动效。
- `site-system.js`：公共菜单、Reveal、目录、当前位置、宽表/代码滚动区增强与回顶。
- `articles-list.js`：仅文章列表页需要的数据、搜索与筛选差异。
- `tools/migrate-secondary-system.mjs`：从受保护 preimage 迁移到三个模板族的可重复生成规则。

## 受保护内容

迁移前后对 21 个页面的标题与可见正文执行归一化 SHA-256 比对，21/21 一致。文章正文、标题、个股名单、研究观点和人物身份信息未改写或重组。对应回归测试位于 `tests/secondary-system.test.mjs`。

## Interaction Manifest

每个路由分别执行桌面 1440×1000 与手机 390×844：

- 公共：加载、菜单状态、回到顶部、页面级溢出、破图、控制台、请求失败、5xx、截图、axe-core、性能指标。
- 标准文章：正文目录跳转；桌面上一篇；手机下一篇；作者/相邻文章区布局。
- 长专题/研报：桌面首章节、手机末章节；目录展开与当前位置；宽表横滑提示及键盘聚焦。
- 文章列表：搜索、即时反馈、清除、分类筛选、搜索/清除图标几何不重叠。
- 桌面 Header：汉堡按钮隐藏、下载入口可见；手机 Header：菜单可开可关。

结果：21 路由 × 2 视口 = **42/42 PASS**，共 148 项页面交互断言通过。

## axe-core 与质量门槛

- axe Critical：0
- axe Serious：0
- 控制台 error/warning：0
- 网络 5xx：0
- 请求失败：0
- 页面级横向溢出：0/42
- 破损图片：0/42
- 宽表实例：6；缺失横滑提示：0

Impeccable 机械扫描返回 5 条 `broken-image` warning，逐条定位均是迁移器和测试中的 `<img>` 正则/字符串字面量，不是页面图片节点；真实浏览器破损图片检查仍为 0/42。

## 性能预算

预算：LCP ≤ 2500ms、CLS ≤ 0.1、INP ≤ 200ms、load ≤ 1500ms、产品资源传输 ≤ 2MiB。

二级页面 42 次运行最差值：

- LCP：192ms
- CLS：0.0038
- INP：32ms
- load：128.6ms
- 产品资源传输：1,707,596 bytes

首页两视口回归：2/2 PASS；LCP 最差 132ms、CLS 0、INP 最差 48ms、load 最差 113.6ms、axe Critical/Serious 0。

## 证据

- 完整机器可读报告：`output/playwright/secondary-audit.raw.json`
- 首页机器可读报告：`output/playwright/home-audit.raw.json`
- 21 页前/后截图：`output/playwright/secondary-evidence/`（84 张）
- 首页前/后截图：`output/playwright/home-*-before.jpg`、`output/playwright/home-*-after.jpg`
- 可重复执行清单：`output/playwright/audit-secondary.js`、`output/playwright/audit-home.js`

本报告只证明本地实现与本地浏览器验收；Git、远端、部署和正式站点验证必须分别取证。
