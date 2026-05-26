# DESIGN.md -- 디자인 시스템화

<!-- extraction-meta
source: Figma file "디자인 시스템화"
scope: 1 selected node(s) on page "Page 1"
date: 2026-05-26
nodes-scanned: 58
confidence: { extracted: 100%, inferred: 0%, known: 0% }
-->

## 1. Identity

**In one line:** A design system using Pretendard with 3 unique colors extracted directly from Figma.

**Signature Techniques:**
- Consistent auto-layout spacing system
- Component library with 20 defined components

## 2. Structure

### Page: Page 1

_1 top-level frame(s)_

- **camer 1m searching** · `COMPONENT_SET` · 856×64 · horizontal row, gap 20px, padding 20px · 19 children
  - **camer 1m searching=error** · `error`
  - **camer 1m searching=account_balance** · `account_balance`
  - **camer 1m searching=earthquake** · `earthquake`
  - **camer 1m searching=coin** · `database`
  - **camer 1m searching=atm** · `local_atm`
  - **camer 1m searching=battery** · `battery_android_alert`
  - **camer 1m searching=credit_card** · `credit_card`
  - **camer 1m searching=camera** · `camera`
  - **camer 1m searching=sell** · `sell`
  - **camer 1m searching=video_off** · `hangout_video_off`
  - **camer 1m searching=sprout** · `psychiatry`
  - **camer 1m searching=add_a_photo** · `add_a_photo`
  - **camer 1m searching=filter** · `filter`
  - **camer 1m searching=personal_bag** · `personal_bag`
  - **camer 1m searching=4k** · `4k`
  - **camer 1m searching=balance** · `balance`
  - **camer 1m searching=image** · `image`
  - **camer 1m searching=photo** · `photo`
  - **camer 1m searching=video** · `video`

### Icon tokens (code mapping)

웹 구현: `css/ds-icons.css` + `<span class="material-symbols-rounded ds-icon">icon_name</span>`

| Figma variant | Material icon | 사용처 |
|---------------|---------------|--------|
| `image` | `image` | 상품 상세 · 센서 |
| `video` | `video` | 상품 상세 · 영상 |
| `balance` | `balance` | 상품 상세 · 무게 |
| `battery` | `battery_android_alert` | 상품 상세 · 배터리 |
| `sprout` | `psychiatry` | 1분 매칭 · 입문 |
| `camera` | `camera` | 1분 매칭 · 중급 / 화질 걱정 |
| `add_a_photo` | `add_a_photo` | 1분 매칭 · 숙련 / 사진 |
| `photo` | `photo` | 1분 매칭 · 사진 목적 |
| `video` | `video` | 1분 매칭 · 영상 목적 |
| `personal_bag` | `personal_bag` | 1분 매칭 · 휴대성 |
| `4k` | `4k` | 1분 매칭 · 화질 |
| `balance` | `balance` | 1분 매칭 · 균형 |
| `video_off` | `hangout_video_off` | 1분 매칭 · 사진만 |
| `coin` | `database` | 1분 매칭 · 예산 100만↓ |
| `credit_card` | `credit_card` | 1분 매칭 · 100~150만 |
| `atm` | `local_atm` | 1분 매칭 · 150~250만 |
| `account_balance` | `account_balance` | 1분 매칭 · 250만↑ |
| `error` | `error` | 1분 매칭 · 조작 걱정 |
| `earthquake` | `earthquake` | 1분 매칭 · 흔들림 |
| `sell` | `sell` | 1분 매칭 · 가성비 |
| `filter` | `filter` | (예비) |

> 프로덕션 UI 색상은 Pictory 브랜드 `--color-accent`(오렌지)를 유지합니다.

## 3. Color

### Palette
| Token | Value | Role | Usage | Similar | Source |
|-------|-------|------|-------|---------|--------|
| `surface` | `#d9d9d9` | surface | 19× | — | node |
| `background` | `#f3f3f4` | background | 19× | — | node |
| `accent` | `#9747ff` | accent | 1× | — | node |

## 4. Typography

### Fonts
- **Pretendard**

### Scale
| Role | Token | Size | Weight | Line Height | Letter Spacing | Source |
|------|-------|------|--------|-------------|----------------|--------|
| Display | `display` | 90px | 700 | 90px | -2px | style |
| H1 | `h1` | 64px | 700 | 74px | -0.02em | style |
| H2 | `h2` | 54px | 700 | 36px | -1px | style |
| H3 | `h3` | 36px | 700 | 70px | -0.04em | style |
| H4 | `h4` | 30px | 700 | 34px | -0.015em | style |
| H5 | `h5` | 24px | 600 | 34px | -0.015em | style |
| H6 | `h6` | 22px | 600 | 34px | -0.015em | style |
| H6 (400) | `h6-regular` | 22px | 400 | 34px | -0.015em | style |
| H7 | `h7` | 21px | 500 | 155% | -1.5px | style |
| H8 | `h8` | 20px | 400 | 24px | -0.04em | style |
| Body lg | `body-lg` | 18px | 400 | 24px | -0.04em | style |
| Body lg (700) | `body-lg-bold` | 18px | 700 | 24px | normal | style |
| Body | `body` | 16px | 400 | 24px | -0.015em | style |
| Body (600) | `body-semibold` | 16px | 600 | 24px | -0.015em | style |

## 5. Spacing & Layout

### Base Unit
4px grid. Scale: 20

### Border Radius
| Token | Value | Usage Count |
|-------|-------|-------------|
| `radius-md` | 5px | 1 |

## 6. Depth & Motion

No shadow tokens detected. Design uses a flat style.

## 7. Components

- camer 1m searching (+ 19 variants, see §2)

## 8. States

| State | Treatment |
|-------|-----------|
| Hover | Lighten/darken accent by 10% |
| Focus | 2px ring using accent color with 30% opacity |
| Disabled | 40% opacity, no pointer events |
| Error | Use danger color for border and text |

**Icons:** default `FILL` 0 → hover/selected `FILL` 1 + `--color-accent` (`css/ds-icons.css`).

## 9. Rules

### Do
- Use Material Symbols Rounded at 24px (`ds-icon`)
- Use icon names from §2 / § Icon tokens only
- Use `#f3f3f4` (`background`) as the page background (Figma reference)
- Keep border-radius consistent: 5px

### Don't
- Don't mix emoji / Phosphor / arbitrary SVG in DS surfaces
- Don't use colors outside the extracted palette without documenting here

## 10. Extending this system

See Figma plugin notes. New icons → add variant to §2 and § Icon tokens.

## 11. Machine-readable tokens

```json design-tokens
{
  "$schema": "design-tokens.v1",
  "meta": {
    "source": "디자인 시스템화",
    "generated": "2026-05-26"
  },
  "color": {
    "surface": "#d9d9d9",
    "background": "#f3f3f4",
    "accent": "#9747ff"
  },
  "icons": {
    "set": "Material Symbols Rounded",
    "size": 24,
    "camer1mSearching": {
      "error": "error",
      "account_balance": "account_balance",
      "earthquake": "earthquake",
      "coin": "database",
      "atm": "local_atm",
      "battery": "battery_android_alert",
      "credit_card": "credit_card",
      "camera": "camera",
      "sell": "sell",
      "video_off": "hangout_video_off",
      "sprout": "psychiatry",
      "add_a_photo": "add_a_photo",
      "filter": "filter",
      "personal_bag": "personal_bag",
      "4k": "4k",
      "balance": "balance",
      "image": "image",
      "photo": "photo",
      "video": "video"
    },
    "productDetail": {
      "sensor": "image",
      "video": "video",
      "weight": "balance",
      "battery": "battery_android_alert"
    }
  },
  "typography": {
    "display": { "fontFamily": "Pretendard", "fontSize": 90, "fontWeight": 700, "lineHeight": "90px", "letterSpacing": "-2px" },
    "h1": { "fontFamily": "Pretendard", "fontSize": 64, "fontWeight": 700, "lineHeight": "74px", "letterSpacing": "-0.02em" },
    "body": { "fontFamily": "Pretendard", "fontSize": 16, "fontWeight": 400, "lineHeight": "24px", "letterSpacing": "-0.015em" }
  },
  "spacing": { "space-20": 20 },
  "radius": { "radius-md": 5 },
  "fonts": ["Pretendard"]
}
```
