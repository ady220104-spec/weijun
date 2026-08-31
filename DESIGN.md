---
name: 潘伟君文章详情页
description: 以 Claude 式宽幅首屏和安静阅读平面统一普通文章与长文路由
colors:
  primary: "#d97757"
  primary-deep: "#c96a4c"
  paper: "#f7f6f2"
  ink: "#201f1c"
  muted-ink: "#6a6761"
  line: "#dedbd3"
  line-strong: "#d8d5cd"
  surface: "#ffffff"
  surface-muted: "#efede7"
  inverse: "#1f1e1b"
typography:
  display:
    fontFamily: "Pan Detail Serif, serif"
    fontSize: "clamp(3.3rem, 5.8vw, 5.4rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Pan Detail Serif, serif"
    fontSize: "clamp(1.8rem, 3vw, 2.35rem)"
    fontWeight: 650
    lineHeight: 1.28
    letterSpacing: "-0.025em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.88
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.5
rounded:
  control: "0.55rem"
  content: "0.95rem"
  feature: "1.25rem"
  round: "999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "2rem"
  lg: "3.5rem"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 1.15rem"
    height: "2.5rem"
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 2rem"
  reading-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.content}"
    padding: "1.5rem"
---

# Design System: 潘伟君文章详情页

## Overview

**Creative North Star: "The Quiet Thinking Page"**

这套系统只管 `data-secondary-template="article"` 与 `data-secondary-template="longform"` 的文章详情页，不是首页或文章列表的通用母版。它把 Claude 产品页的宽幅思考平面翻译成中文 A 股长文阅读系统：首屏用大尺度标题与导语建立问题，正文区回到安静、可持续阅读的单主列，目录只承担定位。

系统是内容优先而非卡片优先。白色容器只用于表格、代码、对照和真正需要边界的教学单元；普通段落、章节和目录不因“设计感”被额外装盒。

**Key Characteristics:**

- 暖白纸面与墨色正文构成主画面
- 陶土橙是稀有强调，不是到处铺满的主色
- 自托管中文衬线字体负责标题和阅读节点，系统无衬线负责正文与控件
- 宽屏是正文加 sticky 目录的阅读网格，手机回到线性流
- 黑色 App CTA 是全页唯一重色收尾

## Colors

色彩策略是“中性场加单强调”：纸面、墨色、细线和白色功能板占据绝大多数面积，陶土橙只标记当前位置、分类与主行动。

### Primary

- **Terracotta Signal**: 当前章节、分类和下载行动的唯一强调色。
- **Terracotta Deep**: hover 与小字链接的较深变体。

### Neutral

- **Warm Paper**: 全页背景与 sticky 表面。
- **Reading Ink**: 标题、正文强调和黑色按钮。
- **Muted Ink**: 元数据、图注和辅助导航。
- **Hairline / Strong Hairline**: 分隔、表格和 sticky 目录轴。
- **White Surface / Muted Surface**: 功能板与表头。
- **Inverse Ground**: 页尾 App CTA 的唯一大面积深色。

**The One Accent Rule.** 一屏内陶土橙只有一个主要语义，不同时用来装饰标题、边框、图标和多个按钮。

## Typography

**Display Font:** Pan Detail Serif（自托管 Noto Serif SC 字符子集）  
**Body Font:** 系统 UI sans（PingFang SC / Microsoft YaHei 在对应平台上接管）

衬线标题提供稳定的中文编辑感，无衬线正文保证长时间屏幕阅读和表格扫读。所有文章标题在运行时按中文词组与日期单位分组，不允许“短 / 线”或“5 / 月”式断词。

### Hierarchy

- **Display**: 只用于文章 H1；长标题通过两级长度档位缩小，不通过溢出或字号崩塌解决。
- **Headline**: 章节 H2，与上方细线共同标记新章节。
- **Title**: 段内 H3 与功能板标题。
- **Body**: 桌面正文 1.125rem / 1.88，主阅读列不超过 48rem。
- **Label**: 元数据、目录、表头和按钮文字。

**The Phrase Integrity Rule.** 中文关键词、数字加日期/单位在标题里视为不可拆分的词组。

## Layout

首屏最大宽度为 86rem，桌面用左标题、右导语/元数据的两列组合。标题区之后，1180px 及以上进入 48rem 正文列加目录辅助列的阅读网格；目录从正文起点开始 sticky，不覆盖首屏导语。

1104px 这类中间宽度保持宽幅首屏，目录收成内容上方的紧凑条。390px 手机上首屏、元数据、目录和正文恢复为线性流，页边距为 1.25rem，图表与表格必要时使用键盘可达的横向视窗。

**The Hero Boundary Rule.** 任何 sticky 导航都不能进入首屏标题/导语矩形。

## Elevation & Depth

系统默认扁平，深度主要来自纸面与白色功能板的明度差、细线以及位置。只有白色教学卡和图表容器使用极轻 ambient shadow；黑色 CTA 是平面色块，不用发光或厚阴影。

### Shadow Vocabulary

- **Ambient Content** (`0 1px 2px rgba(32,31,28,.035), 0 14px 34px -28px rgba(32,31,28,.28)`): 白色功能板和教学单元。
- **Figure Lift** (`0 12px 32px -28px rgba(32,31,28,.35)`): 图表容器。

**The Flat-by-Default Rule.** 普通段落、章节和目录不用阴影表示分组。

## Shapes

形状以轻度圆角矩形为主。导航按钮是 0.55rem，普通功能板是 0.8–0.95rem，大型 CTA 是 1.25rem；只有汉堡按钮与回顶控件使用完全圆形。边框统一为 1px 低对比细线，不使用厚边、硬偏移阴影或装饰性胶囊。

## Components

### Buttons

- **Primary navigation**: 墨色背景、白字、0.55rem 圆角；:hover 只提高墨色明度。
- **Accent CTA**: 陶土橙背景与白字，只出现在黑色下载收尾区。
- **Focus**: 保留全局 2px ring 与 2px offset，不用发光替代焦点。

### Cards / Containers

- **Reading card**: 白色、1px 纸色细线、0.95rem 圆角与 ambient shadow。
- **Muted quote**: 更深一级的纸色平面，无左色条。
- **Code panel**: 接近墨黑的背景、高对比代码、键盘可横向滚动。

### Navigation

顶部导航是 64px sticky 纸面；桌面显示主链接和黑色下载按钮，手机收成圆形菜单按钮。长文目录用 active 暖橙浅底表示当前位置，不额外复制一套页面标题。

### Signature Closing CTA

页尾 App 区使用全页唯一的大面积墨黑背景，内部三个功能格用细线而不是三张浮卡分割，主按钮使用陶土橙。

## Do's and Don'ts

### Do:

- **Do** 让文章标题和真实内容主导首屏与滚动节奏。
- **Do** 对所有标题使用自托管 Pan Detail Serif，并保持中文词组完整。
- **Do** 在白色容器出现前说清它承载的功能边界。
- **Do** 将分类放在作者、日期和阅读时间的元数据中。

### Don't:

- **Don't** 在 H1 上方恢复 kicker / eyebrow。
- **Don't** 把普通段落、目录链接或每个章节都包成卡片。
- **Don't** 使用蓝紫渐变、彩色发光、Emoji 图标或硬黑阴影增加“设计感”。
- **Don't** 让 sticky 目录覆盖首屏导语，或让图表/表格在手机上裁切。
- **Don't** 改写文章标题、正文、观点、代码、表格数据或作者信息来配合视觉。

