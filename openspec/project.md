# Project Context

## Purpose
建设一个交付物驱动的过程文件写作系统，以交付物完成作为项目完成标准，在受控参考下生成初稿并保证引用可追溯。

## Tech Stack
- TBD。尚未锁定技术栈、模型或部署方式。

## Project Conventions

### Code Style
- TBD。偏好清晰、尽量低复杂度，具体约定待定。

### Architecture Patterns
- TBD。无明确需求时避免引入跨模块抽象。

### Testing Strategy
- TBD。实现范围确认后再定。

### Git Workflow
- TBD。暂不约束。

## Domain Context
系统用于真实项目的过程文件撰写（如招投标材料、合同草案、项目说明）。必须强制区分“写法参考”（怎么写）与“项目事实”（写什么），对两者建立可追溯引用，并支持草稿版本迭代。

## Important Constraints
- 不做流程/审批系统；不做通用聊天写作。
- 不以向量化切片召回为基础能力；优先整文理解、写作画像、小规模可信候选集。
- 项目完成由交付物 → 阶段 → 项目自动推导；不提供手工完成按钮。
- doc_kind 是可治理标签，可为空、可纠错、可重标，不应阻塞早期使用。

## External Dependencies
- TBD。当前不依赖外部服务。
