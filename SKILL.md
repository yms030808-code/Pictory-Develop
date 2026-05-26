---
name: design-system-brand-or-scope
description: Creates implementation-ready design-system guidance derived from local Figma styles in "디자인 시스템화".
---

<!-- TYPEUI_SH_MANAGED_START -->

# 디자인 시스템화

## Mission
Document and operationalize the 디자인 시스템화 style foundations extracted from Figma so teams can build consistent interfaces quickly.

## Brand
- Product/brand: 디자인 시스템화
- Audience: Designers and engineers building this product
- Product surface: web app

## Style Foundations
- Visual style: systematic, token-driven, structured
- Typography scale: Home title, Card title, Card title 2, Top tap menu, card body, card highlight, card highlight 2, card highlight 3, card details, card details 2, card details 3, card details 4, card details 5, header text 1
- Color palette: Gray/Gradi, Primitive/Gray/black, Primitive/Gray/800, Primitive/Gray/700, Primitive/Gray/600, Primitive/Gray/500, Primitive/Gray/400, Primitive/Gray/300, Primitive/Gray/200, Primitive/Gray/100, Primitive/Gray/white, Primitive/Orange/500, Primitive/Orange/400, Primitive/Orange/300
- Spacing scale: Layout, 카드
- Radius/shadow/motion tokens: duration-fast 120ms, duration-base 200ms, ease-standard

## Component Families
- Button
- Card
- basic
- camer test
- camer 1m searching
- compare-button
- category
- Icon button
- mypage-settings-password-icon
- button
- side tab
- loogout
- name
- login

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required
- Focus-visible rules required
- Contrast constraints required

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use extracted color tokens before introducing one-off values: Gray/Gradi
- Primitive/Gray/black
- Primitive/Gray/800
- Primitive/Gray/700
- Primitive/Gray/600
- Primitive/Gray/500.
- Use these typography styles consistently: Home title
- Card title
- Card title 2
- Top tap menu
- card body
- card highlight.
- Define all interaction states for interactive components: default
- hover
- focus-visible
- active
- disabled
- and loading.

## Rules: Don't
- Do not duplicate existing style tokens with one-off naming.
- Do not remove focus-visible indicators or keyboard support.
- Do not hard-code raw values where local styles or variables already exist.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy
4. variants
5. and interactions.
6. Add accessibility acceptance criteria.
7. Add anti-patterns and migration notes.
8. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule uses "must".
- Every recommendation uses "should".
- Every accessibility rule is testable in implementation.
- Prefer system consistency over local visual exceptions.

## Acceptance Checklist
- Frontmatter exists with valid `name` and `description`.
- Guidance is under 500 lines for `skill.md` when possible.
- Accessibility and interaction states are explicitly documented.
- Rules are concrete, testable, and non-ambiguous.
- Output can be reused in other repositories with only variable replacement.

## TypeUI + Agentic Integration
This `SKILL.md` is intended for `typeui.sh` CLI workflows.
It can later be integrated with agentic tools including Claude Code, OpenCode, Gemini CLI, Cursor, and similar assistants.

<!-- TYPEUI_SH_MANAGED_END -->
