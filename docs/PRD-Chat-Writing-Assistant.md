# Writing Tasks — Chat Notification 产品需求文档

> **负责人：** 产品团队
> **最后更新：** 2026-04-22
> **状态：** 待研发评审

---

## 目录

1. [概述](#1-概述)
2. [消息生命周期流程](#2-消息生命周期流程)
3. [消息通用结构](#3-消息通用结构)
4. [三类消息详细规格](#4-三类消息详细规格)
5. [视觉标识系统](#5-视觉标识系统)
6. [交互与跳转逻辑](#6-交互与跳转逻辑)
7. [消息发送规则](#7-消息发送规则)
8. [技术约束](#8-技术约束)

---

## 1. 概述

### 功能目标

当一场 Zoom 会议结束后，Writing Tasks 会自动从会议转录中识别后续的写作任务（例如"发一条 Sprint 更新""给利益相关者发邮件"等），并主动通过 **Zoom Team Chat** 向用户发送通知。

用户在 Chat 界面内即可完成全部操作流程 —— 查看已识别的任务、触发执行、查看结果、以及在需要时补充信息。

### Bot 身份信息

| 属性 | 值 |
|---|---|
| 发送者名称 | Writing Tasks |
| 标识徽章 | `APP` |
| 头像 | Writing Tasks 功能 icon |
| 消息格式 | Zoom Chat Markdown + 操作按钮 |

### 支持的任务类型

| 类型 | 说明 | 示例 |
|---|---|---|
| `message` | 发送至频道或个人的 Chat 消息 | 向 #engineering 发布 Sprint 更新 |
| `email` | 发送给指定收件人的邮件 | 给利益相关者发跟进邮件 |
| `doc_create` | 创建新文档 | 创建一份 PRD |
| `doc_update` | 更新已有文档 | 更新设计规范文档 |
| `multi_output` | 单个任务生成多个交付物 | Q1 业务回顾包（幻灯片 + 表格 + 数据表） |

---

## 2. 消息生命周期流程

### 三类消息

系统发送的所有消息分为 **三个类别**，每个类别对应任务生命周期中的一个阶段：

| 类别 | 标题格式 | 触发条件 | 发送频率 |
|---|---|---|---|
| **任务检测** | `✨ {N} new writing tasks are ready to go` | 一场含后续写作任务的会议结束 | 每场会议 1 条 |
| **任务完成** | `✅ Task done: {任务标题}` | 某个任务完成产出生成 | 每个完成的任务 1 条 |
| **需要操作** | `⚠️ Action needed: {任务标题}` | 某个任务因缺少用户输入无法继续 | 每个阻塞的任务 1 条 |

### 生命周期流程图

```mermaid
flowchart TD
    MeetingEnds["会议结束"] --> Detection["AI 从转录中识别写作任务"]
    Detection --> TaskDetection["发送【任务检测】消息<br/>（每场会议 1 条，包含所有检测到的任务）"]

    TaskDetection --> UserAction{"用户操作"}

    UserAction -->|"Get Started<br/>（单个任务）"| Execute1["任务开始执行"]
    UserAction -->|"Run All<br/>（全部任务）"| ExecuteAll["所有任务并行执行"]
    UserAction -->|"Edit Prompt"| EditView["用户编辑 Prompt 后运行"]
    EditView --> Execute1

    Execute1 --> TaskResult{"任务结果"}
    ExecuteAll --> TaskResult

    TaskResult -->|"成功"| TaskDone["发送【任务完成】消息<br/>（每个完成的任务 1 条）"]
    TaskResult -->|"需要补充信息"| ActionNeeded["发送【需要操作】消息<br/>（每个阻塞的任务 1 条）"]

    ActionNeeded -->|"Provide More Info"| ClarifyView["用户补充更多上下文"]
    ClarifyView --> Execute1
```

---

## 3. 消息通用结构

每条 Bot 消息（无论属于哪个类别）都遵循以下统一结构：

```
┌── Bot 头像 ────┬── 发送者信息栏 ──────────────────────────┐
│  [WT 图标]     │  Writing Tasks  [APP]  {时间戳}          │
│                ├───────────────────────────────────────────┤
│                │  ┌─ 消息卡片 ─────────────────────────┐   │
│                │  │  {标题行}                          │   │
│                │  │  {正文内容 — 因消息类别而异}        │   │
│                │  │  ─────────────────────────────     │   │
│                │  │  {操作栏 — 按钮}                   │   │
│                │  └────────────────────────────────────┘   │
└────────────────┴───────────────────────────────────────────┘
```

### 组成部分

| 组件 | 说明 |
|---|---|
| **Bot 头像** | Writing Tasks 功能 icon。每条消息左侧显示一次。 |
| **发送者信息栏** | `Writing Tasks`（加粗）+ `APP` 徽章 + 时间戳。位于卡片上方。 |
| **消息卡片** | 白色背景、圆角、灰色细边框。包含所有内容。 |
| **标题行** | 加粗文字 + 状态 emoji。卡片内第一行。 |
| **正文内容** | 因消息类别而异（详见第 4 节）。可能包含 @提及、引用块、列表、链接。 |
| **操作栏** | 与正文之间以细线分隔。包含 1-2 个操作按钮。 |

### 所有消息共有的规则

- 每条消息正文中都包含 `@{用户名}` 提及，确保触发通知。
- 标题行始终以状态 emoji 开头（✨ / ✅ / ⚠️）。

---

## 4. 三类消息详细规格

### 4.1 任务检测消息

**触发条件：** 一场会议结束，AI 从转录中识别出后续写作任务。

**发送频率：** 每场会议 1 条。同一场会议的所有任务归入同一条消息中。

#### 消息结构

```
┌─────────────────────────────────────────────────────────────────┐
│ ✨ {N} new writing tasks are ready to go        ← 标题          │
│                                                                 │
│ @{用户名} — Writing tasks from **{会议名称}**                    │
│   | {开始时间}–{结束时间} · Hosted by {主持人}   ← 上下文信息    │
│                                                                 │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─            │
│ **1. {任务标题}**                               ← 任务          │
│ {AI 自动生成的 Prompt}                          ← Prompt        │
│ Get Started | Edit Prompt                       ← 操作链接      │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─            │
│ **2. {任务标题}**                                               │
│ {AI 自动生成的 Prompt}                                          │
│ Get Started | Edit Prompt                                       │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─            │
│ ...每个任务重复以上结构...                                       │
│ ═══════════════════════════════════════════════════════          │
│ [Run All]  [View in Writing Tasks]              ← 操作栏        │
└─────────────────────────────────────────────────────────────────┘
```

#### 各板块说明

| 板块 | 格式 | 说明 |
|---|---|---|
| 标题 | `✨ {N} new writing tasks are ready to go`（加粗） | N = 检测到的任务数量 |
| 上下文行 | `@{用户} — Writing tasks from **{会议名称}** | {时间段} · Hosted by {主持人}` | @mention 为 Zoom Chat 可点击的用户提及 |
| 任务列表 | 编号列表，任务之间以细线分隔 | 每个任务一条 |
| 任务条目 — 标题 | `{序号}. {任务标题}`（加粗） | 从会议转录中提取的任务名称 |
| 任务条目 — Prompt | `{AI 生成的 Prompt}`（浅色文字） | AI 自动生成的写作指令，描述具体要写什么 |
| 任务条目 — 操作链接 | `Get Started`（蓝色链接）`|` `Edit Prompt`（灰色链接） | 行内文字链接，用竖杠分隔 |
| 操作栏 | `[Run All]` 主按钮、`[View in Writing Tasks]` 次按钮 | 与任务列表之间以分割线分隔 |

#### 示例

```
✨ 4 new writing tasks are ready to go

@Alex Chen — Writing tasks from Sprint Planning | 9:00–10:00 · Hosted by Sarah Chen

1. Post sprint update to #engineering channel
   Share a brief sprint update covering auth module progress, dashboard PR
   status, and notification redesign deprioritization with the team.
   Get Started | Edit Prompt

2. Send follow-up email to stakeholders
   Draft a stakeholder update email covering Q1 review highlights, revenue
   growth, customer retention, and new enterprise accounts onboarded.
   Get Started | Edit Prompt

3. Update design specifications based on team review
   Update the design specs document to include the new 12-column grid layout,
   revised button radius, and accessibility guidelines from team feedback.
   Get Started | Edit Prompt

4. Share meeting recap with attendees
   Summarize the key discussion points, decisions, and action items from the
   sprint planning meeting and share with all attendees.
   Get Started | Edit Prompt

───────────────────────
[Run All]  [View in Writing Tasks]
```

---

### 4.2 任务完成消息

**触发条件：** 一个任务成功完成并生成了产出。

**发送频率：** 每个完成的任务单独发送 1 条。

**核心结构：** 所有任务完成消息共享同一基础结构，但根据**任务的产出类型**不同，正文内容有所差异。

#### 基础结构（所有产出类型共有）

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Task done: {任务标题}                         ← 标题         │
│                                                                 │
│ @{用户} — {固定句式介绍语}                       ← 介绍语       │
│                                                                 │
│ ┃ {产出内容预览 — 因产出类型而异}          ← 绿色左竖线引用块   │
│                                                                 │
│ ═══════════════════════════════════════════════════════          │
│ [View Result]                                    ← 操作栏       │
└─────────────────────────────────────────────────────────────────┘
```

| 板块 | 格式 | 说明 |
|---|---|---|
| 标题 | `✅ Task done: {任务标题}`（加粗） | 所有产出类型共用此格式 |
| 介绍语 | 固定句式，按任务类型选词（见下方分类说明） | 任务名称已在标题行展示，介绍语仅包含目标标识符和数字 |
| 产出预览 | 绿色左竖线引用块，内容因产出类型而异 | 展示生成结果 |
| 操作栏 | `[View Result]` 按钮 | 所有产出类型共用 |

#### 介绍语设计原则

介绍语采用**固定句式**，不嵌入任务名称或描述（任务名称已在标题行 `Task done: {title}` 中展示）。根据任务类型选用对应名词（message / email / document / deliverables），仅**目标标识符**（频道名 / 邮箱地址）和**数字**为变量。

#### 按产出类型分类说明

---

##### (a) Chat 消息（有指定频道）

适用于：任务类型为 `message`，且有明确的目标频道。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your message for **#{频道名}** has been prepared:` |
| 产出预览 | 绿色引用块中展示完整的生成消息文本 |

示例：

```
✅ Task done: Post sprint update

@Alex Chen — Your message for #engineering has been prepared:

┃ Hi team, quick sprint update:
┃ • Auth module: Core logic complete, PR #127 under review
┃ • Dashboard: Interactive charts merged, performance tests passing
┃ • Notification redesign: Deprioritized to next sprint
┃ Let me know if any questions!

───────────────────────
[View Result]
```

---

##### (b) 邮件

适用于：任务类型为 `email`。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your email to **{收件人邮箱}** has been prepared:` |
| 产出预览 | 绿色引用块中展示完整邮件内容（主题行、称呼、正文、落款） |

示例：

```
✅ Task done: Stakeholder follow-up email

@Alex Chen — Your email to sarah.chen@company.com has been prepared:

┃ Hi Sarah,
┃
┃ Thanks for joining today's Q1 review. Here's a quick recap:
┃ • Revenue grew 18% QoQ, exceeding our target by 3%
┃ • Customer retention improved to 94.2%
┃ • Three new enterprise accounts onboarded
┃
┃ Next steps: Department leads, please share your Q2 OKRs by Friday.
┃
┃ Best,
┃ Alex

───────────────────────
[View Result]
```

---

##### (c) 文档更新

适用于：任务类型为 `doc_update`。

此类型与其他产出类型的差异较大：在引用块之前额外展示**变更摘要**，引用块内展示的是**文档链接**而非文本预览。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your document has been updated with {N} changes:` |
| 变更摘要 | 编号纯文本列表（引用块外），最多 3 条。格式：`{序号}. **{章节名}** — {变更详情}` |
| 产出预览 | 绿色引用块中展示 `{文档icon} {文档名称}` 为可点击的蓝色超链接 |

示例：

```
✅ Task done: Design specifications updated

@Alex Chen — Your document has been updated with 3 changes:

1. Grid Layout — Updated to 12-column grid system
2. Button Radius — Revised from 4px to 8px globally
3. Accessibility — Added ARIA label guidelines

┃ 📄 Design Specifications — Q1 Update

───────────────────────
[View Result]
```

---

##### (d) 文档创建

适用于：任务类型为 `doc_create`。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your document has been created:` |
| 产出预览 | 绿色引用块中展示 `{文档icon} {文档名称}` 为可点击的蓝色超链接 |

示例：

```
✅ Task done: Create Q2 product roadmap PRD

@Alex Chen — Your document has been created:

┃ 📄 Q2 Product Roadmap PRD

───────────────────────
[View Result]
```

---

##### (e) 通用消息（无指定收件人/频道）

适用于：任务类型为 `message`，但没有指定具体的频道或收件人。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your message has been prepared:` |
| 产出预览 | 绿色引用块中展示完整的生成文本 |

示例：

```
✅ Task done: Meeting recap

@Alex Chen — Your message has been prepared:

┃ Sprint Planning Meeting — Key Takeaways
┃ • Auth module core logic complete, PR under review
┃ • Dashboard interactive charts merged
┃ • Notification redesign deprioritized to next sprint
┃ • Action items assigned to Sarah, Mike, and Lisa

───────────────────────
[View Result]
```

---

##### (f) 多产出任务

适用于：任务类型为 `multi_output`，一个任务生成了多个交付物。

| 板块 | 内容 |
|---|---|
| 介绍语 | `@{用户} — Your deliverables are ready. {N} files included:` |
| 产出预览 | 绿色引用块中逐行展示每个交付物：`{文件类型icon} {文件名}` 为可点击的蓝色超链接 |

示例：

```
✅ Task done: Q1 business review package

@Alex Chen — Your deliverables are ready. 3 files included:

┃ 📊 Q1 Business Review Deck
┃ 📋 Q1 Revenue & Metrics Breakdown
┃ 📑 Customer Retention Data Table

───────────────────────
[View Result]
```

---

#### 介绍语汇总表

| 任务类型 | 固定句式 | 变量部分 |
|---|---|---|
| `message`（有频道） | `Your message for **#{频道}** has been prepared:` | 频道名 |
| `email` | `Your email to **{邮箱}** has been prepared:` | 邮箱地址 |
| `doc_update` | `Your document has been updated with {N} changes:` | 变更数量 |
| `doc_create` | `Your document has been created:` | 无 |
| `message`（无收件人） | `Your message has been prepared:` | 无 |
| `multi_output` | `Your deliverables are ready. {N} files included:` | 文件数量 |

---

### 4.3 需要操作消息

**触发条件：** AI 因缺少用户补充的上下文信息，无法继续处理某个任务。

**发送频率：** 每个被阻塞的任务单独发送 1 条。

#### 消息结构

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Action needed: {任务标题}                      ← 标题        │
│                                                                 │
│ @{用户} — This task needs more input before       ← 介绍语      │
│   I can get started:                                            │
│                                                                 │
│ ┃ 1. {问题 1}                              ← 琥珀色左竖线引用块│
│ ┃ 2. {问题 2}                                                  │
│ ┃ 3. {问题 3}                                                  │
│                                                                 │
│ ═══════════════════════════════════════════════════════          │
│ [Provide More Info]                              ← 操作栏       │
└─────────────────────────────────────────────────────────────────┘
```

#### 各板块说明

| 板块 | 格式 | 说明 |
|---|---|---|
| 标题 | `⚠️ Action needed: {任务标题}`（加粗） | 直接在标题中展示任务名称，让用户一眼识别是哪个任务 |
| 介绍语 | `@{用户} — This task needs more input before I can get started:` | |
| 问题列表 | 琥珀色（amber）左竖线引用块，内含编号问题列表 | AI 生成的需要用户回答的澄清问题 |
| 操作栏 | `[Provide More Info]` 主按钮 | |

**设计说明：** 标题直接包含任务名称（`Action needed: {任务标题}`），让用户一眼就能识别是哪个任务需要关注，无需再单独展示会议信息和任务名称行，保持消息简洁。

#### 示例

```
⚠️ Action needed: Share Q2 product roadmap summary with leadership

@Alex Chen — This task needs more input before I can get started:

┃ 1. Which specific product areas should the roadmap cover?
┃ 2. Should this include timeline estimates or just feature descriptions?
┃ 3. Is there a preferred format (bullet points, narrative, or table)?

───────────────────────
[Provide More Info]
```

---

## 5. 视觉标识系统

### 左竖线颜色（引用块边框）

| 颜色 | 含义 | 使用场景 |
|---|---|---|
| **绿色** (`#22c55e`) | 任务成功完成 | 所有"任务完成"消息中的产出内容与文件链接 |
| **琥珀色** (`#fbbf24`) | 需要关注 / 需要操作 | "需要操作"消息中的问题列表 |
| _（无竖线）_ | 信息性 / 尚未开始 | "任务检测"消息中的任务列表使用平铺布局，无引用块 |

### 状态 Emoji

| Emoji | 含义 | 使用场景 |
|---|---|---|
| ✨ | 新任务已就绪 | "任务检测"消息标题 |
| ✅ | 任务已完成 | "任务完成"消息标题（`Task done:`） |
| ⚠️ | 需要关注 / 需要操作 | "需要操作"消息标题（`Action needed:`） |

---

## 6. 交互与跳转逻辑

### 6.1 Get Started（开始执行）

- **出现位置：** "任务检测"消息中，每个任务的行内链接
- **交互行为：**
  1. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  2. 定位并打开该任务的 **Chat Panel**（任务级对话界面）。
  3. **自动触发任务执行** —— 任务立即开始运行，无需用户进一步操作。
  4. 任务卡片转为 "Running" 状态。

### 6.2 Edit Prompt（编辑 Prompt）

- **出现位置：** "任务检测"消息中，每个任务的行内链接
- **交互行为：**
  1. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  2. 定位并打开该任务的 **Chat Panel**。
  3. **将 AI 生成的 Prompt 预填到输入框中**。
  4. **不自动运行。** 用户可以查看、修改或补充 Prompt，然后手动发送。
  5. 这让用户可以在执行前添加上下文、调整指令内容或更改语气。

### 6.3 Run All（一键运行全部）

- **出现位置：** "任务检测"消息中，底部操作栏
- **交互行为：**
  1. **同时触发该会议所有任务的执行**。
  2. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  3. 显示该会议的所有任务卡片，每个卡片展示 **"Running"** 状态。
  4. 各任务独立完成后，对应的卡片更新为显示结果。

### 6.4 View in Writing Tasks（在 Writing Tasks 中查看）

- **出现位置：** "任务检测"消息中，底部操作栏
- **交互行为：**
  1. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  2. 滚动或筛选，定位到**该场会议关联的任务**。
  3. 不触发任何任务执行 —— 纯导航操作。

### 6.5 View Result（查看结果）

- **出现位置：** 所有"任务完成"消息中的操作栏
- **交互行为：**
  1. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  2. 打开该已完成任务的 **Chat Panel**。
  3. 在对话视图中展示生成的产出，用户可以：
     - 查看完整产出
     - 提供额外指令以优化或重新生成
     - 复制或转发产出内容

### 6.6 Provide More Info（提供更多信息）

- **出现位置：** "需要操作"消息中的操作栏
- **交互行为：**
  1. 从 Chat 标签页跳转到 **Writing Tasks** 标签页。
  2. 打开该被阻塞任务的 **Chat Panel**。
  3. 在对话上下文中展示澄清问题。
  4. **输入框自动聚焦**，用户可以立即开始输入回答。
  5. 用户提供回答并发送后，任务恢复执行。

### 6.7 可点击的文档 / 文件链接

- **出现位置：** "任务完成"消息中的文档更新、文档创建和多产出类型
- **交互行为：**
  1. 在 **应用内文档查看器** 或新浏览器标签页中打开文档/文件。
  2. 这是直接打开操作 —— 不会跳转到 Writing Tasks 界面。

### 交互总览表

| 按钮 / 链接 | 所在消息类别 | 跳转目标 |
|---|---|---|
| Get Started | 任务检测（每个任务） | Writing Tasks > 任务 Chat Panel |
| Edit Prompt | 任务检测（每个任务） | Writing Tasks > 任务 Chat Panel（Prompt 预填） |
| Run All | 任务检测（底部） | Writing Tasks > 定位到该会议任务列表 |
| View in Writing Tasks | 任务检测（底部） | Writing Tasks > 定位到该会议任务列表 |
| View Result | 任务完成（底部） | Writing Tasks > 任务 Chat Panel（显示产出） |
| Provide More Info | 需要操作（底部） | Writing Tasks > 任务 Chat Panel |
| 文档/文件链接 | 任务完成 — 文档类、多产出（行内） | 应用内查看器或新标签页 |

---

## 7. 消息发送规则

### 分组规则

- **每场会议 1 条"任务检测"消息。** 同一场会议检测到的所有任务归入一条通知消息。例如一场会议产生 4 个任务，用户收到 1 条消息，列出全部 4 个任务。
- **每个已完成/被阻塞的任务 1 条消息。** 每个任务完成或被阻塞时，独立发送一条对应类别的消息。如果触发了 4 个任务，用户最多收到 4 条独立的完成/操作消息，随各任务事件发生时逐一发送。

### 发送顺序

- "任务检测"消息始终是最先发送的（会议结束后）。
- "任务完成"和"需要操作"消息随任务状态变化**实时发送**。它们不会被批量合并 —— 每条消息在对应事件发生后立即下发。
- 消息在 Chat 流中按**时间顺序**排列。

### @提及规则

- 每条 Bot 消息在正文中都包含 `@{用户名}` 提及（不仅仅在标题中）。
- 这确保消息出现在用户的"提及"列表中，并触发通知。

### 跨会议行为

- 如果用户有连续两场会议，且都产生了写作任务，每场会议会生成各自独立的"任务检测"消息。
- "需要操作"消息通过标题中的任务名称（`Action needed: {任务标题}`）帮助用户快速定位需要关注的任务。

---

## 8. 技术约束

### Zoom Chat Markdown 渲染

所有消息内容必须能被 Zoom Chat 的 Markdown 引擎正确渲染。支持的基本元素如下：

| 元素 | Markdown 语法 | 用途 |
|---|---|---|
| 加粗文字 | `**文本**` | 标题、任务名称、会议名称 |
| @提及 | `@{用户名}` | 正文开头的用户提及 |
| 引用块 | `>`（渲染为左竖线块） | 产出预览、问题列表、文件链接 |
| 编号列表 | `1. 条目` | 变更摘要、问题列表、任务列表 |
| 行内链接 | `[文本](url)` | 文档名称、文件名称 |
| 操作按钮 | Bot API 按钮附件 | Run All、View Result、Provide More Info 等 |

### 按钮类型

Zoom Chat Bot 消息支持两种交互元素：

1. **行内文字链接** —— 渲染为消息正文中带下划线的蓝色文字（如 `Get Started | Edit Prompt`）。本质是标准 Markdown 链接。
2. **操作按钮** —— 渲染为消息内容下方的样式化按钮（如 `[Run All]`、`[View Result]`）。这些是 Bot API 的按钮附件，显示在操作栏区域。

---

## 9. 分阶段交付计划与完整需求表

### 设计理念

Markdown 简化版已经具备完整的信息传达能力（文案、结构、状态标识一致），用户完全可读可操作。终极版与简化版的差异应按**价值层级**拆解，而非简单的"丑版 vs 美版"：

```
┌─────────────────────────────────────────────────────┐
│         Phase 3: UI 美化层（低优先级）               │
│  富卡片、展开/收起、彩色图标、阴影、动效…            │
├─────────────────────────────────────────────────────┤
│         Phase 2: 能力补齐层（高优先级）              │
│  Jump to、Email 跳转、联系人选择、动态状态…          │
├─────────────────────────────────────────────────────┤
│         Phase 1: Markdown 基础层（首发）             │
│  三类消息 + 文案 + 按钮跳转 + 引用块                │
└─────────────────────────────────────────────────────┘
```

**核心判断：** 能力层（Phase 2）直接影响用户是否能在 Chat 内完成闭环操作（发送消息、发送邮件、选择收件人），是功能价值的关键差异。UI 美化层（Phase 3）仅影响视觉体验，不增加新能力，短期 ROI 较低。

---

### 9.1 Phase 1 — Markdown 基础层（首发版本）

> **目标：** 用最小开发量上线完整的通知流程。用户可以在 Chat 中看到所有写作任务的状态，并通过按钮跳转到 Writing Tasks 完成操作。
>
> **技术约束：** 仅使用 Zoom Chat Markdown 渲染 + Bot API 按钮附件。不依赖自定义 UI 组件。

| 需求编号 | 类别 | 需求描述 | 备注 |
|---|---|---|---|
| P1-01 | 消息结构 | 三类消息完整实现：任务检测、任务完成、需要操作 | 文案、标题、介绍语见 Section 4 |
| P1-02 | 消息结构 | 标题行以状态 emoji 开头（✨ / ✅ / ⚠️） | |
| P1-03 | 消息结构 | 每条消息正文包含 `@{用户名}` 提及 | 触发通知 |
| P1-04 | 任务检测 | 标题：`✨ {N} new writing tasks are ready to go` | |
| P1-05 | 任务检测 | 上下文行：`@{用户} — Writing tasks from **{会议名}** \| {时间段} · Hosted by {主持人}` | |
| P1-06 | 任务检测 | 每个任务：序号 + 加粗标题 + AI Prompt + `Get Started \| Edit Prompt` 行内链接 | |
| P1-07 | 任务检测 | 底部操作栏：`[Run All]` + `[View in Writing Tasks]` 按钮 | Bot API 按钮附件 |
| P1-08 | 任务完成 | 标题：`✅ Task done: {任务标题}` | |
| P1-09 | 任务完成 | 介绍语固定句式（按类型选词），见介绍语汇总表 | 不嵌入任务名称 |
| P1-10 | 任务完成 | 产出预览在引用块（`>`）内展示 | Markdown 引用块 |
| P1-11 | 任务完成 | 底部操作栏：`[View Result]` 按钮 | |
| P1-12 | 任务完成 | `doc_update` / `doc_create`：引用块内文档名为可点击链接 | `[文档名](url)` |
| P1-13 | 任务完成 | `multi_output`：引用块内每个交付物为可点击链接 | |
| P1-14 | 需要操作 | 标题：`⚠️ Action needed: {任务标题}` | |
| P1-15 | 需要操作 | 问题列表在引用块内展示 | |
| P1-16 | 需要操作 | 底部操作栏：`[Provide More Info]` 按钮 | |
| P1-17 | 跳转 | Get Started → Writing Tasks > 任务 Chat Panel → 自动运行 | |
| P1-18 | 跳转 | Edit Prompt → Writing Tasks > 任务 Chat Panel → Prompt 预填，不自动运行 | |
| P1-19 | 跳转 | Run All → Writing Tasks > 所有任务并行执行 | |
| P1-20 | 跳转 | View in Writing Tasks → Writing Tasks > 定位到该会议任务 | 纯导航 |
| P1-21 | 跳转 | View Result → Writing Tasks > 已完成任务 Chat Panel | |
| P1-22 | 跳转 | Provide More Info → Writing Tasks > 被阻塞任务 Chat Panel | 输入框聚焦 |
| P1-23 | 跳转 | 文档/文件链接 → 应用内查看器或新标签页 | 直接打开 |
| P1-24 | 发送规则 | 每场会议 1 条任务检测消息 | |
| P1-25 | 发送规则 | 每个完成/阻塞的任务 1 条独立消息 | |
| P1-26 | 发送规则 | 消息按时间顺序排列，实时下发 | |
| P1-27 | 视觉 | 绿色引用块（产出预览）、琥珀色引用块（问题列表） | 如 Chat 支持彩色引用块 |

**Phase 1 不包含：** Jump to 频道/邮件、联系人选择、动态按钮状态、富卡片 UI。

---

### 9.2 Phase 2 — 能力补齐层（高优先级）

> **目标：** 让用户从 Chat 通知直接完成"最后一步"操作，无需离开 Chat 再手动查找目标频道/邮件客户端。这是从"通知查看"到"闭环操作"的关键升级。
>
> **依赖：** 需要与 Chat 平台和 Email 团队协作，打通跨模块跳转和内容预填的技术通道。

#### A. Jump to Chat 频道/个人（内容预填跳转）

| 需求编号 | 需求描述 | 触发场景 | 技术依赖 |
|---|---|---|---|
| P2-01 | `message` + 有目标频道：操作栏展示 `[Jump to #{频道名}]` 按钮 | 任务完成消息 | Chat Bot API |
| P2-02 | 点击后跳转到目标 Chat 频道/个人聊天窗口 | | Chat 导航 API |
| P2-03 | 跳转后将 AI 生成的消息内容预填到输入框 | | Chat 输入框预填 API |
| P2-04 | 用户可在预填内容基础上编辑后发送 | | |

**产品说明：**
- 跳转不等于自动发送 —— 用户到达目标频道后，内容预填在输入框中，用户确认后手动发送。
- 如果目标频道/个人已在会话列表中，直接切换到该会话；如果不在，则需搜索或创建会话。

#### B. Jump to Email（邮件跳转与预填）

| 需求编号 | 需求描述 | 触发场景 | 技术依赖 |
|---|---|---|---|
| P2-05 | `email` 类型：操作栏展示 `[Jump to Email]` 按钮 | 任务完成消息 | Email 模块 API |
| P2-06 | 点击后打开 Zoom Mail 邮件编辑器（或外部邮件客户端） | | Email 深度链接 |
| P2-07 | 邮件收件人（To）预填为 AI 识别的收件人 | | |
| P2-08 | 邮件主题行预填 AI 生成的主题 | | |
| P2-09 | 邮件正文预填 AI 生成的内容 | | |
| P2-10 | 用户可在预填内容基础上编辑后发送 | | |

**产品说明：**
- 如果用户使用 Zoom Mail，优先在应用内打开编辑器。
- 如果用户使用外部邮件客户端（Gmail / Outlook），可考虑通过 `mailto:` 协议或 API 集成实现跳转。
- 需要与 Email 团队确认可用的预填接口和跳转方式。

#### C. Choose Recipient（联系人选择 + 跳转）

| 需求编号 | 需求描述 | 触发场景 | 技术依赖 |
|---|---|---|---|
| P2-11 | `message` + 无指定收件人：操作栏展示 `[Choose recipient to jump]` 按钮 | 任务完成消息 | Chat 联系人 API |
| P2-12 | 点击后弹出联系人/频道选择浮层 | | UI 弹窗组件 |
| P2-13 | 浮层包含搜索框，支持按名称搜索联系人和频道 | | 联系人搜索 API |
| P2-14 | 搜索结果展示：头像 + 名称 + 类型标识（个人/频道） | | |
| P2-15 | 用户选择一个联系人/频道后，浮层关闭 | | |
| P2-16 | 选择后跳转到该联系人/频道的聊天窗口 | | 同 P2-02 |
| P2-17 | 跳转后将 AI 生成的消息内容预填到输入框 | | 同 P2-03 |

**产品说明：**
- 此场景用于 AI 识别到了写作任务（如"给参会者发会议纪要"），但无法确定具体发给哪个频道或个人的情况。
- 联系人列表应优先展示该用户的常用联系人和已加入的频道。

#### D. 动态状态展示（按钮实时反馈）

| 需求编号 | 需求描述 | 涉及按钮 | 状态流转 |
|---|---|---|---|
| P2-18 | Run All 点击后按钮状态流转 | `[Run All]` | `Run All` → `Running…`（loading 动画） → 按钮消失 |
| P2-19 | Run All 完成后，消息内任务列表更新状态 | 任务检测消息内 | 每个任务的 `Get Started` 链接变为 `View Result` |
| P2-20 | Get Started 点击后状态变化 | `Get Started` | `Get Started` → `Running…` → `View Result` |
| P2-21 | Copy 按钮点击反馈 | `[Copy]`（如有） | `Copy` → `Copied ✓`（绿色，2s 后恢复） |
| P2-22 | 任务完成后消息内产出状态指示 | 任务完成消息 | 引用块旁展示完成状态（绿色勾或类似标识） |

**产品说明：**
- 动态状态的实现取决于 Bot API 是否支持消息更新（update message）。如果支持，可以在任务状态变化时更新原始消息中的按钮文案和样式。
- 如果 Bot API 不支持消息更新，则 Get Started 点击后的状态变化只能通过后续发送新消息来传达（即"任务完成"消息本身就是状态反馈）。
- Copy 功能依赖客户端剪贴板 API，需确认 Zoom Chat Bot 消息中是否支持此类交互。

#### Phase 2 优先级排序建议

| 排序 | 能力 | 理由 |
|---|---|---|
| **P0** | Jump to Chat 频道（P2-01 ~ P2-04） | 最高频场景：大部分写作任务是发 Chat 消息。打通后用户从通知到发送只需两步。 |
| **P0** | 动态状态 — Run All 流转（P2-18 ~ P2-19） | 无状态反馈则用户无法感知任务进度，体验断裂。 |
| **P1** | Choose Recipient（P2-11 ~ P2-17） | 频率次之，但对"无明确收件人"场景是必需能力。 |
| **P1** | 动态状态 — Get Started / Copy（P2-20 ~ P2-22） | 补齐操作反馈，提升可感知性。 |
| **P2** | Jump to Email（P2-05 ~ P2-10） | 需要跨团队协作，依赖 Email 模块接口。可先确认技术可行性后排入。 |

#### Phase 2 需要确认的技术问题

| 问题编号 | 问题 | 需要确认方 | 影响范围 |
|---|---|---|---|
| Q-01 | Bot API 是否支持 `update message`（更新已发送消息的按钮状态）？ | Chat 平台团队 | P2-18 ~ P2-22 |
| Q-02 | Chat 是否提供深度链接 API，支持从 Bot 消息跳转到指定频道/个人并预填消息？ | Chat 平台团队 | P2-01 ~ P2-04, P2-16 ~ P2-17 |
| Q-03 | Bot 消息内是否支持弹出自定义浮层（联系人选择器）？ | Chat 平台团队 | P2-12 ~ P2-15 |
| Q-04 | Zoom Mail 是否提供邮件编辑器的深度链接或 API（支持预填收件人、主题、正文）？ | Email 团队 | P2-05 ~ P2-10 |
| Q-05 | Bot 消息内是否支持客户端剪贴板操作（Copy 功能）？ | Chat 平台团队 | P2-21 |
| Q-06 | 联系人/频道搜索 API 是否可被 Bot 调用？是否有 rate limit？ | Chat 平台团队 | P2-13 |

---

### 9.3 Phase 3 — UI 美化层（低优先级）

> **目标：** 在能力完备的基础上，将 Markdown 纯文本消息升级为富卡片 UI，提升视觉体验和信息密度。
>
> **前置条件：** Phase 1 + Phase 2 已上线。UI 升级不增加新能力，仅改善呈现方式。

| 需求编号 | 功能模块 | 需求描述 |
|---|---|---|
| P3-01 | 消息卡片 | 白色背景 + 圆角 + 灰色细边框 + 阴影，替代 Markdown 纯文本 |
| P3-02 | 任务检测卡片 | 会议信息外壳卡片（灰底头部），展示会议全名和时间 |
| P3-03 | 任务检测卡片 | 每个任务可展开/收起（chevron toggle） |
| P3-04 | 任务检测卡片 | 展开后显示「Prompt to be sent」（蓝色底框） |
| P3-05 | 任务检测卡片 | 展开后显示「Where this task came from」（会议转录片段） |
| P3-06 | 任务完成卡片 | 富卡片结构：类型图标 + 任务标题 + 状态胶囊 |
| P3-07 | 任务完成卡片 | 消息/邮件：灰底圆角预览框（最高 180px 可滚动） |
| P3-08 | 文档更新卡片 | 蓝色文档图标 + 文档名称行 + `Open document` 样式化按钮 |
| P3-09 | 多产出卡片 | 每个文件独立一行：彩色图标（Slides 橙、Sheets 绿、Data Table 紫） + `Open {类型}` 按钮 |
| P3-10 | 需要操作卡片 | 会议信息外壳 + 任务图标 + 任务标题 + 琥珀色状态按钮 |
| P3-11 | View result 胶囊 | 绿色勾 + 灰底圆角胶囊样式 |
| P3-12 | Bot 头像 | 渐变色圆角方形图标（替代默认头像） |
| P3-13 | 任务状态图标 | 类型图标（消息/邮件/文档）+ 绿底圆角方块 |

---

### 9.4 各阶段完整对照总表

> 以下表格将所有需求按功能维度列出，标注每个阶段的支持情况。

| 维度 | 能力 | Phase 1 | Phase 2 | Phase 3 |
|---|---|:---:|:---:|:---:|
| **消息文案** | 三类消息标题、介绍语、@提及 | ✅ | ✅ | ✅ |
| **消息文案** | 固定句式介绍语（按类型选词） | ✅ | ✅ | ✅ |
| **消息文案** | 引用块展示产出/问题 | ✅ | ✅ | ✅ |
| **跳转** | Get Started / Edit Prompt → Writing Tasks | ✅ | ✅ | ✅ |
| **跳转** | Run All / View in Writing Tasks → Writing Tasks | ✅ | ✅ | ✅ |
| **跳转** | View Result / Provide More Info → Writing Tasks | ✅ | ✅ | ✅ |
| **跳转** | 文档/文件链接 → 应用内查看器 | ✅ (链接) | ✅ (链接) | ✅ (按钮) |
| **能力** | Jump to #{频道} + 内容预填 | — | ✅ | ✅ |
| **能力** | Jump to Email + 预填收件人/主题/正文 | — | ✅ | ✅ |
| **能力** | Choose recipient（联系人选择弹窗） | — | ✅ | ✅ |
| **能力** | Copy 内容到剪贴板 | — | ✅ | ✅ |
| **状态** | Run All 状态流转（idle → loading → 消失） | — | ✅ | ✅ |
| **状态** | Get Started → Running → View Result 状态变化 | — | ✅ | ✅ |
| **状态** | Copy 按钮反馈（Copied ✓） | — | ✅ | ✅ |
| **UI** | 富卡片（圆角边框 + 阴影 + 灰底头部） | — | — | ✅ |
| **UI** | 任务展开/收起 + 转录片段 | — | — | ✅ |
| **UI** | 彩色文件类型图标行 | — | — | ✅ |
| **UI** | 类型状态图标 + View result 胶囊 | — | — | ✅ |
| **UI** | 邮件编辑器预览（应用内 Gmail 风格） | — | — | ✅ |

---

### 9.5 建议与风险提示

#### 为什么能力层优先于 UI 层

1. **闭环价值差异大。** Phase 1 的用户路径是：看到通知 → 点击按钮 → 跳转到 Writing Tasks → 手动找到频道/邮件发送。Phase 2 将路径缩短为：看到通知 → 点击 Jump to → 直接发送。减少了 2-3 步操作。
2. **UI 美化不改变能力边界。** 用户能做的事情完全不变，只是呈现方式更美观。在功能尚未闭环时投入 UI 美化，用户的感受是"好看但不好用"。
3. **跨团队依赖需尽早暴露。** Jump to Chat、Jump to Email、联系人选择器都涉及其他团队的 API。越早启动沟通和技术验证，越能避免后期阻塞。

#### 风险与应对

| 风险 | 影响 | 应对策略 |
|---|---|---|
| Chat 平台不支持消息更新（update message） | 动态状态无法在原消息上更新 | 退化方案：状态变化通过新消息传达（任务完成消息本身即为状态反馈） |
| Chat 平台不支持深度链接跳转 + 预填 | Jump to 功能无法实现 | 退化方案：改为 Copy 内容 + 提示用户手动粘贴到目标频道 |
| Email 团队接口不可用或排期冲突 | Jump to Email 延迟 | 可将 Email 跳转降级为 Phase 3，先用复制内容替代 |
| Bot 消息不支持弹出自定义浮层 | 联系人选择器无法实现 | 退化方案：在 Bot 消息中展示常用联系人列表作为行内链接 |
