# Writing Tasks — Chat Notification 完整版需求文档

> **负责人：** Sue Wang（产品）
> **前端 Owner：** Bin Yuan
> **最后更新：** 2026-04-23
> **状态：** 跨团队对齐中
> **关联文档：** [Markdown 简化版 PRD](./PRD-Chat-Writing-Assistant.md)

---

## 目录

1. [背景与目标](#1-背景与目标)
2. [版本策略与优先级](#2-版本策略与优先级)
3. [跨团队依赖总览](#3-跨团队依赖总览)
4. [Phase 1 — Markdown 基础版（5 月 R1）](#4-phase-1--markdown-基础版5-月-r1)
5. [Phase 2 — 能力补齐层](#5-phase-2--能力补齐层)
6. [Phase 3 — UI 美化层](#6-phase-3--ui-美化层)
7. [完整版消息文案规范](#7-完整版消息文案规范)
8. [技术能力确认记录](#8-技术能力确认记录)
9. [跨团队联系人与下一步行动](#9-跨团队联系人与下一步行动)

---

## 1. 背景与目标

### 功能概述

会议结束后，Writing Tasks Bot 通过 Zoom Team Chat 向用户发送写作任务通知。用户在 Chat 内完成查看、执行、查看结果、补充信息的完整闭环。

### 两个版本的关系

| | Markdown 简化版 | 完整版 |
|---|---|---|
| **定位** | 最小可用版本，快速验证 | 最终目标形态，功能完整 |
| **上线时间** | 5 月 R1（5/27） | 分阶段交付 |
| **消息格式** | 纯 Markdown + Bot API 按钮 | 富卡片 UI + 完整交互能力 |
| **研发负责** | 肖裕（后端）配置 | Bin Yuan（前端）在 Chat 代码库开发 |
| **文案** | 与完整版一致 | 与简化版一致 |

**核心原则：** 两个版本文案保持完全一致。简化版和完整版的差异仅在**交互能力**和**视觉呈现**上。

---

## 2. 版本策略与优先级

### 分层架构

```
┌─────────────────────────────────────────────────────┐
│       Phase 3: UI 美化层（低优先级）                │
│  富卡片、展开/收起、彩色图标、会议外壳、阴影        │
├─────────────────────────────────────────────────────┤
│       Phase 2: 能力补齐层（高优先级）               │
│  Jump to Chat、Jump to Email、联系人选择、动态状态  │
├─────────────────────────────────────────────────────┤
│       Phase 1: Markdown 基础层（5 月 R1 首发）      │
│  三类消息 + 统一文案 + View Result 跳转             │
└─────────────────────────────────────────────────────┘
```

### 优先级排序逻辑

**为什么 Phase 2 优先于 Phase 3：**

1. **闭环价值。** Phase 1 用户路径：看到通知 → 点 View Result → 跳转 Writing Tasks → 手动找频道/邮件发送。Phase 2 缩短为：看到通知 → 点 Jump to → 直接发送。减少 2-3 步。
2. **能力 > 美观。** UI 美化不增加新能力，只改善视觉。在功能未闭环时投入美化，用户感受是"好看但不好用"。
3. **跨团队依赖需尽早暴露。** Jump to、动态状态等都涉及 App Marketplace 团队协议定义，越早启动沟通越能避免阻塞。

---

## 3. 跨团队依赖总览

```
                          ┌──────────────────┐
                          │   Docs 团队      │
                          │  Sue (PM)        │
                          │  Bin Yuan (FE)   │
                          │  肖裕 (BE)       │
                          └────────┬─────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                  ▼
        ┌────────────────┐ ┌──────────────┐  ┌──────────────┐
        │  Chat 团队     │ │ Marketplace  │  │ Email 团队   │
        │  Carlo Guo     │ │ (App 协议)   │  │ (TBD)        │
        │  Jacken Li     │ │ Serge        │  │              │
        └────────────────┘ └──────────────┘  └──────────────┘
```

| 团队 | 负责范围 | 联系人 |
|---|---|---|
| **Docs 团队** | 产品定义、后端 Bot 消息生成、前端完整版开发 | Sue Wang / Bin Yuan / 肖裕 |
| **Chat 团队** | Chat UI 框架、Bot 消息渲染、开发流程指导 | Carlo Guo / Jacken Li |
| **App Marketplace 团队** | 新消息类型协议定义、Bot 按钮组件扩展 | Serge |
| **Email 团队** | Email 深度链接（launch URL）、预填支持 | TBD（Jacken 提供联系人） |

### 协作模式

- **Docs 前端（Bin Yuan）直接在 Chat 代码库写代码**，Chat 团队提供指导
- 新组件/协议由 App Marketplace 团队（Serge）开发，以第三方包形式集成到 Chat
- 开发细节对接找 Jacken Li（Chat 前端）
- 方案对齐和找人可找 Carlo Guo 提供输入

---

## 4. Phase 1 — Markdown 基础版（5 月 R1）

> **目标：** 以最小开发量上线完整通知流程。纯 Markdown 渲染 + Bot API 按钮。
>
> **负责人：** 肖裕（后端）
>
> **详细 PRD：** 见 [Markdown 简化版 PRD](./PRD-Chat-Writing-Assistant.md)

### 支持的能力

| 能力 | 支持情况 | 实现方式 |
|---|---|---|
| 三类消息（检测 / 完成 / 需要操作） | ✅ | Markdown 文本 + Bot 按钮 |
| Get Started / Edit Prompt | ✅ | 行内链接 → 跳转 Writing Tasks |
| Run All / View in Writing Tasks | ✅ | Bot API 按钮 → 跳转 Writing Tasks |
| View Result | ✅ | Bot API 按钮 → 跳转 Writing Tasks |
| Provide More Info | ✅ | Bot API 按钮 → 跳转 Writing Tasks |
| Copy 内容 | ✅ | Bot 按钮支持 Copy（已确认） |
| 文档/文件链接 | ✅ | Markdown 链接 + URL 跳转（title + icon 支持已确认） |
| Jump to #{频道} + 内容预填 | ❌ | 不支持 |
| Jump to Email | ❌ | 不支持 |
| Choose recipient | ❌ | 不支持 |
| 动态状态变化 | ❌ | 不支持 |
| 富卡片 UI | ❌ | 不支持 |

---

## 5. Phase 2 — 能力补齐层

> **目标：** 让用户从 Chat 通知直接完成"最后一步"操作，实现真正的闭环。

### 5.1 Jump to Chat 频道/个人 + 内容预填

**优先级：P0（最高频场景）**

| 需求编号 | 需求描述 |
|---|---|
| P2-01 | `message` + 有目标频道/个人：操作栏展示 `[Jump to #{频道名}]` 按钮 |
| P2-02 | 点击后跳转到目标 Chat 频道/个人聊天窗口 |
| P2-03 | 跳转后将 AI 生成的消息内容预填到输入框 |
| P2-04 | 用户可在预填内容基础上编辑后发送（不自动发送） |

**技术结论（4/23 会议确认）：**
- ❌ 当前 Bot 消息**不支持**将内容插入到其他会话的输入框
- 原因：需要 App Marketplace 团队定义新的消息类型协议，Chat 团队才能匹配并执行
- 安全考虑：如果不通过规范协议，存在 Bot 被劫持注入恶意内容的风险
- **需要：** 与 Serge（App Marketplace）沟通，定义协议 → Chat 团队匹配实现

**退化方案：** 如协议未就绪，先使用 Copy 按钮（已确认支持）让用户手动粘贴。

---

### 5.2 Jump to Email + 预填

**优先级：P2（需跨团队协作，依赖 Email 接口）**

| 需求编号 | 需求描述 |
|---|---|
| P2-05 | `email` 类型：操作栏展示 `[Jump to Email]` 按钮 |
| P2-06 | 点击后打开 Zoom Mail 邮件编辑器 |
| P2-07 | 预填收件人（To）、主题行、正文 |

**技术结论（4/23 会议确认）：**
- Chat 按钮支持 URL 跳转（launch URL），可在 client 内或 web 端打开
- 但 **Email 应用需要支持对应的 launch URL 参数**才能实现预填
- 需要 Email 团队确认是否有此能力
- **需要：** 联系 Email 团队（Jacken 提供联系人）确认 launch URL 规范

**退化方案：** 如 Email 不支持 launch URL 预填，先降级为 View Result（跳转 Writing Tasks）。

---

### 5.3 Choose Recipient（联系人选择 + 跳转）

**优先级：P1（"不知道发给谁"的场景必需）**

| 需求编号 | 需求描述 |
|---|---|
| P2-08 | `message` + 无指定收件人：操作栏展示 `[Choose recipient to jump]` 按钮 |
| P2-09 | 点击后弹出联系人/频道选择浮层 |
| P2-10 | 浮层包含搜索框，支持按名称搜索联系人和频道 |
| P2-11 | 选择后跳转到目标聊天，并预填消息内容 |

**技术结论（4/23 会议确认）：**
- ❌ Forward 弹窗**不能复用**（Forward 是特殊消息类型，且会直接发送）
- ❌ 当前 Bot 消息**没有**联系人选择这种组件
- 需要全新开发，需 App Marketplace 团队参与
- Carlo 建议：这是一个**新功能需求**，需要把联系人选择能力表达清楚再提给对方

**退化方案：** 使用 Copy 按钮 + 用户手动选择目标频道/个人。

---

### 5.4 动态状态展示

**优先级：P0-P1（用户感知任务进度的关键）**

| 需求编号 | 需求描述 |
|---|---|
| P2-12 | Run All 点击后状态流转：`Run All` → `Running…` → 按钮消失 |
| P2-13 | 任务完成后，任务检测消息内对应任务状态更新 |
| P2-14 | Get Started 点击后状态变化 |
| P2-15 | Copy 按钮反馈：`Copy` → `Copied ✓`（已确认支持） |

**技术结论（4/23 会议确认）：**
- ❌ 当前 Bot 消息**没有**动态状态变化的组件
- 可以做，但需要 App Marketplace 团队开发新组件
- **需要：** 向 Serge 提需求
- Copy 按钮的反馈已确认可用

---

### Phase 2 能力总览与优先级

| 排序 | 能力 | 技术可行性 | 依赖方 | 退化方案 |
|---|---|---|---|---|
| **P0** | Copy 按钮 | ✅ 已确认支持 | 无 | — |
| **P0** | URL 跳转（View Result / Open Doc） | ✅ 已确认支持 | 无 | — |
| **P0** | 动态状态 — Copy 反馈 | ✅ 已确认支持 | 无 | — |
| **P0** | Jump to Chat + 内容预填 | ❌ 需新协议 | Serge（Marketplace） | Copy + 手动粘贴 |
| **P0** | 动态状态 — Run All / Get Started | ❌ 需新组件 | Serge（Marketplace） | 新消息通知状态变化 |
| **P1** | Choose Recipient | ❌ 需全新开发 | Serge（Marketplace） | Copy + 手动选择 |
| **P2** | Jump to Email + 预填 | ⚠️ 待确认 | Email 团队 | View Result |

---

## 6. Phase 3 — UI 美化层

> **前置条件：** Phase 1 + Phase 2 核心能力已上线。
>
> **定位：** 将 Markdown 纯文本消息升级为富卡片 UI，提升视觉体验。不增加新能力。

**技术结论（4/23 会议确认）：**
- 消息卡片渲染在 Chat 的 MBM 包（message card）中，由 App Marketplace 团队维护
- 展开/收起等组件目前不存在，需要 Marketplace 团队新增
- Docs 前端（Bin Yuan）不能自行添加，必须由 Marketplace 团队开发后以第三方包形式集成

| 需求编号 | 需求描述 | 依赖 |
|---|---|---|
| P3-01 | 消息卡片：白色背景 + 圆角 + 灰色细边框 + 阴影 | Marketplace |
| P3-02 | 任务检测：会议信息外壳卡片（灰底头部） | Marketplace |
| P3-03 | 任务检测：每个任务可展开/收起（chevron toggle） | Marketplace |
| P3-04 | 展开后显示 AI Prompt（蓝色底框）| Marketplace |
| P3-05 | 展开后显示会议转录片段 | Marketplace |
| P3-06 | 任务完成卡片：类型图标 + 任务标题 + 状态胶囊 | Marketplace |
| P3-07 | 产出预览：灰底圆角文本框（最高 180px 可滚动） | Marketplace |
| P3-08 | 文档卡片行：蓝色文档图标 + 文档名 + Open 按钮 | Marketplace |
| P3-09 | 多产出：彩色文件图标行（Slides 橙 / Sheets 绿 / Data Table 紫） | Marketplace |
| P3-10 | 需要操作卡片：会议外壳 + 琥珀色状态按钮 | Marketplace |

---

## 7. 完整版消息文案规范

> **核心原则：** 简化版和完整版文案完全一致。以下为统一文案规范。
>
> **完整版特殊处理：** 当卡片 UI 已展示任务标题和状态时，文本区不再重复标题行（`✅ Task done: {title}`），仅保留 @mention + emoji + 介绍语。

### 7.1 任务检测消息

**简化版（Markdown）：**
```
✨ 4 new writing tasks are ready to go

@Alex Chen — Writing tasks from Sprint Planning | 9:00–10:00 · Hosted by Sarah Chen
```

**完整版（富卡片）：**
```
@Alex Chen — ✨ 4 new writing tasks are ready to go:

┌─ Card: 会议信息 + 任务列表 + Run All ─┐
│ ...                                    │
└────────────────────────────────────────┘
```
- 会议信息由卡片头部展示，文本区不重复
- 标题行合并到 @mention 介绍语中

### 7.2 任务完成消息

**简化版（Markdown）：**
```
✅ Task done: Post sprint update

@Alex Chen — Your message for #engineering has been prepared:
```

**完整版（富卡片）：**
```
@Alex Chen — ✅ Your message for #engineering has been prepared:

┌─ Card: 任务标题 + View result + 内容预览 + 操作 ─┐
│ ...                                               │
└───────────────────────────────────────────────────┘
```
- 标题行省略（卡片头部已展示任务标题和完成状态）
- emoji ✅ 移到介绍语前方

**介绍语汇总（简化版 / 完整版通用）：**

| 任务类型 | 介绍语 |
|---|---|
| `message`（有频道） | `Your message for **#{频道}** has been prepared:` |
| `email` | `Your email to **{邮箱}** has been prepared:` |
| `doc_update` | `Your document has been updated with {N} changes:` |
| `doc_create` | `Your document has been created:` |
| `message`（无收件人） | `Your message has been prepared:` |
| `multi_output` | `Your deliverables are ready. {N} files included:` |

### 7.3 需要操作消息

**简化版（Markdown）：**
```
⚠️ Action needed: Share Q2 product roadmap summary with leadership

@Alex Chen — This task needs more input before I can get started:
```

**完整版（富卡片）：**
```
@Alex Chen — ⚠️ This task needs more input before I can get started:

1. Which specific product areas should the roadmap cover?
2. Should this include timeline estimates or just feature descriptions?
3. Is there a preferred format (bullet points, narrative, or table)?

┌─ Card: 会议外壳 + 任务标题 + Provide More Info ─┐
│ ...                                              │
└──────────────────────────────────────────────────┘
```
- 标题行省略（卡片已展示任务标题）
- ⚠️ emoji 放在介绍语前方，吸引用户注意

### 7.4 状态 Emoji 规则

| 消息类型 | Emoji | 位置 |
|---|---|---|
| 任务检测 | ✨ | 简化版：标题行开头 / 完整版：`—` 后面 |
| 任务完成 | ✅ | 简化版：标题行开头 / 完整版：`—` 后面 |
| 需要操作 | ⚠️ | 简化版：标题行开头 / 完整版：`—` 后面 |

---

## 8. 技术能力确认记录

> **来源：** 2026-04-23 与 Chat 团队（Carlo Guo / Jacken Li）会议

| 能力 | 当前支持 | 说明 | 需要谁 |
|---|---|---|---|
| Bot 消息中的按钮 | ✅ | Bot API 按钮附件，支持多种操作 | — |
| 按钮 — Copy 功能 | ✅ | 按钮可以触发 Copy 操作 | — |
| 按钮 — URL 跳转 | ✅ | 给定 launch URL 即可跳转，client 内和 web 端均可 | — |
| 文档链接 — Title + Icon | ✅ | Bot 消息可展示文档标题和图标 | — |
| Jump to 频道 + 内容预填 | ❌ | 需新消息类型协议。安全问题需考虑 | Serge（Marketplace） |
| Jump to 频道（不带内容） | ❌ | 同样需要新协议 | Serge（Marketplace） |
| Choose recipient 弹窗 | ❌ | Forward 弹窗不可复用；需全新开发 | Serge（Marketplace） |
| 动态状态组件 | ❌ | 无现有组件，需要新增 | Serge（Marketplace） |
| 展开/收起组件 | ❌ | 无现有组件，需要新增 | Serge（Marketplace） |
| Jump to Email | ⚠️ 待确认 | 取决于 Email 应用是否支持 launch URL 参数 | Email 团队 |
| 个人账号发消息（非 Bot） | ❌ 不推荐 | 个人消息无按钮能力，只支持纯文本 | — |

### 关键技术约束

1. **Bot 消息 vs 个人消息：** 必须使用 Bot（APP 标识）发送，个人账号消息没有按钮等交互组件。
2. **消息卡片渲染：** 在 MBM 包中（Chat 的 message card 模块），由 App Marketplace 团队维护，Docs 前端无法自行修改。
3. **新组件开发流程：** Docs 提需求 → Marketplace 团队定义协议 → 开发组件并以第三方包形式提供 → Chat 团队集成。
4. **安全要求：** 内容预填等操作必须通过正式协议规范，不能 hard code，否则存在被劫持风险，安全审核不通过。

---

## 9. 跨团队联系人与下一步行动

### 联系人

| 角色 | 姓名 | 团队 | 职责 |
|---|---|---|---|
| 产品 | Sue Wang | Docs | 产品定义、跨团队沟通 |
| 前端 Owner | Bin Yuan | Docs | 完整版前端开发（在 Chat 代码库） |
| 后端 | 肖裕 (Yu Xiao) | Docs | Markdown 版后端配置 |
| Chat 前端 | Jacken Li | Chat | 开发流程指导、技术确认 |
| Chat TL | Carlo Guo | Chat | 方案对齐、找人支持 |
| Marketplace | Serge | App Marketplace | 新消息协议定义、组件开发 |
| Email | TBD | Email | Email 深度链接支持（Jacken 提供联系人） |

### 行动项

| 编号 | 行动 | 负责人 | 状态 | 备注 |
|---|---|---|---|---|
| A-01 | 5 月 R1 Markdown 版上线 | 肖裕 | 进行中 | 5/27 上线 |
| A-02 | 联系 Serge，讨论 Jump to + 内容预填的协议方案 | Sue + Bin | 待启动 | P0 优先级 |
| A-03 | 联系 Serge，讨论动态状态组件需求 | Sue + Bin | 待启动 | P0 优先级 |
| A-04 | Jacken 提供 Email 团队联系人 | Jacken Li | 待跟进 | |
| A-05 | 联系 Email 团队确认 launch URL 预填能力 | Sue | 待 A-04 完成 | |
| A-06 | Bin 与 Carlo/Jacken 对齐完整版开发方案 | Bin Yuan | 待启动 | 含代码库访问、开发流程 |
| A-07 | 向 Serge 提联系人选择浮层需求 | Sue + Bin | 待 A-02 完成 | P1 优先级，可与 A-02 一起讨论 |
| A-08 | 完整版 PRD 评审（全团队） | Sue | 本文档 | |
| A-09 | 录制最新 Demo 视频供研发参考 | Sue | 待启动 | |

### 关键依赖路径

```
A-01 (Markdown 版上线 5/27)
  │
  ├── A-02 (联系 Serge → 协议方案)
  │     ├── Jump to Chat + 预填
  │     ├── 动态状态组件 (A-03)
  │     └── 联系人选择浮层 (A-07)
  │
  ├── A-04 (Jacken 提供 Email 联系人)
  │     └── A-05 (确认 Email launch URL)
  │
  └── A-06 (Bin 对齐开发方案)
        └── Phase 2 开发启动
```

**关键路径上的最大风险：** Serge（Marketplace 团队）的排期和响应速度。建议尽早发起沟通（A-02），即使 Markdown 版还在开发中。
