# design.md — Knowunity Design System (extracted from Figma)

> Source: Figma `Yummy<>Knowie — Copy`, pages **"🎨 Mascot & components"**,
> **"✨ Example Screens"**, **"📓 Case study brief"**, and **"🔎 Cover"**.
> Extracted via Figma MCP on 07/06/2026. These are the REAL design system
> values — do not invent or approximate others. If a value is missing, go
> back to Figma and look it up — don't guess.

---

## Color tokens

### Surface / background
| Token | Value | Usage |
|---|---|---|
| `background/surface` | `#22242f` | card backgrounds, secondary/disabled buttons |
| `background/inverse` | `#f4f2ff` | snackbar background, "inverted over dark" elements |

### Text
| Token | Value | Usage |
|---|---|---|
| `text/primary` | `#f4f2ff` | main text on dark background |
| `text/secondary` | `rgba(245,243,255,0.68)` | secondary text, captions |
| `text/disabled` | `rgba(255,255,255,0.4)` | disabled states |
| `text/inverse` | `#090c18` | text on light background (snackbar) |

### Interactive (primary button)
| Token | Value | Usage |
|---|---|---|
| `interactive/primary` | `#f4f2ff` | primary button background (light-on-dark-mode) |
| `interactive/onprimary` | `#090c18` | text/icon on top of the primary button |

### Feedback (result states — key for the recall loop)
| Token | Value | Usage |
|---|---|---|
| `feedback/success/bold` | `#00c386` | correct recall |
| `feedback/success/onbold` | `#0a1f18` | text on success |
| `feedback/error/bold` | `#ff6b6b` | failed recall / error |
| `feedback/error/onbold` | `#2a0808` | text on error |
| `accent/blue/bold` | `#5fa0fc` | info / default chip |
| `accent/blue/onbold` | `#06173b` | text on info |
| `pro/bold` | `#f5b53d` | "Pro" chip background (yellow/gold accent) |
| `pro/onbold` | `#2a1d04` | text on the Pro chip |
| `accent/coral/bold` | `#fb7e5b` | **decided: use for "partial/hint" recall state** — sits between success green and error red, already used as a progress-indicator variant so it reads as "in progress," not "wrong" |
| `accent/purple/bold` | `#8f7bdc` | **recovered, not in the original extraction** — sampled directly from the committed reference screenshots (progress-indicator "Primary" fill, Knowie name badge, discovery dot, selected-chip state all use this same purple). Confirmed with the product owner to use as the measured value since a live Figma lookup wasn't available when this gap was found. Treat as authoritative going forward. |

---

## Typography

Font family: **Greed VF** (variable font), styles: `Standard_Regular`,
`Standard_SemiBold`, `Standard_Bold`.

| Scale | Size | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|
| Display / Headline XL (large title) | 76px | 76px | -1px | Bold (900) |
| Headline XL | 44px | 44px | -1px | Bold (900) |
| Headline S | 21px | 24px | 0 | Bold (900) |
| Headline XS Regular (large caption) | 18px | 20px | 1px | Regular (400) |
| Body M Bold (M title) | 18px | 24px | 1px | SemiBold (600) |
| Body S Bold (buttons, UI text) | 15px | 20px | 1px | SemiBold (600) |
| Body S Regular | 15px | 20px | 1px | Regular (400) |
| Caption M Regular | 12px | 16px | 1px | Regular (400) |
| Caption S Regular | 9px | 12px | 1px | Regular (400) |

Most UI text (buttons, labels) uses **Body S Bold — 15px/20px**. The
recall/coach title likely uses Headline S or Body M Bold — to confirm against
the specific frame for that screen when we explore it.

---

## Spacing scale

| Token | Value |
|---|---|
| `sds-size-space-050` | 2px |
| `sds-size-space-100` | 4px |
| `sds-size-space-150` | 6px |
| `sds-size-space-200` | 8px |
| `sds-size-space-300` | 12px |
| `sds-size-space-400` | 16px |
| `sds-size-space-600` | 24px |

## Radius

| Token | Value | Usage |
|---|---|---|
| `sds-size-radius-full` | 9999px | buttons (pill shape) |
| `radius/800` | 32px | snackbar, large cards |

## Icon sizes

`sds-size-icon-medium` = 16px · `sds-size-icon-large` = 24px ·
`icon/250` = 20px

---

## Knowie expressions — OFFICIAL COMPLETE LIST (16 Homie Cards, node `9003:19697`)

This is the full, authoritative list straight from the design system (numbered
01–16 in the source file). 14 have real artwork; 2 are empty placeholders
("TBD") — meaning the design team hasn't finished the full set yet.

| # | Expression | Notes |
|---|---|---|
| 01 | `standby` | Idle / neutral / listening |
| 02 | `confused` | Uncertain, puzzled |
| 03 | `approving` | Encouraging, "you're on the right track" |
| 04 | `overIt` | Fed up / disengaged tone — **decided: not used in Voice Recall**, doesn't fit Coach Philosophy |
| 05 | `laughing` | Playful, amused |
| 06 | `angry` | Frustrated/annoyed — clearly not a coach tone, exclude |
| 07 | `amazed` | Surprised, impressed |
| 08 | `dazed` | Foggy, not quite following |
| 09 | `excited` | High energy positive — used in "Perfect lesson!" |
| 10 | `giggling` | Light, warm positive |
| 11 | `questioning` | Curious, prompting |
| 12 | `thinking` | Processing / considering |
| 13 | `sad` | Down, disappointed |
| 14 | `determined` | Focused, resolved |
| 15–16 | *(empty — TBD)* | Not yet illustrated by the design team |

> Earlier mentions of `excitedDance`, `clapping`, `wave`, and `superSad` were
> from the brand marketing deck (a different, separate asset set used for
> brand storytelling slides) — they are **not** part of this 16-card Homie
> set and are not confirmed as usable in-product assets. Stick to the 14
> named ones above for the actual prototype.

### Decided mapping for Voice Recall (per Coach Philosophy — never sound like a grader)

| Recall result | Expression | Why |
|---|---|---|
| Correct / on track | `approving` | Matches "acknowledge effort, confirm understanding" |
| Full success / streak | `excited` | Already validated in the real "Perfect lesson!" screen |
| Partial / needs a hint | `thinking` or `questioning` | Neutral-curious tone, not a failure signal |
| Incomplete / retry needed | `dazed` or `confused` | Signals "not quite" without judging — avoids `sad`, `angry`, `overIt` |
| Session start / greeting | `standby` | Neutral entry state |

Excluded on purpose: `overIt`, `angry`, `sad` — all read as judgment or
negativity, which conflicts with "Knowie coaches rather than judges" and
"mistakes should become opportunities" from the brief.

### Decided: "Knowie Thinking" animation approach

No new assets, no Lottie. Using only the existing `thinking` static image:

- **Head movement**: CSS transform loop — gentle ±3° rotation + small
  vertical bob, looping while the mocked "thinking" delay runs (~1–1.5s per
  Prototype Rules).
- **"Eyes changing" effect**: a soft crossfade between `thinking` and
  `questioning` (both neutral/considering expressions) every ~800ms, instead
  of trying to isolate and animate just the eyes. Simple, safe, no new
  Figma work required, and reads as "processing / looking around."
- If more polish is wanted later, a true isolated eye-blink would need going
  back into Figma to export the face-detail overlay layer specifically for
  `thinking` (several other expressions like `standby`/`approving` do have
  that layer separated, but `thinking` didn't return one on the last query).

---

## Components already mapped (with node IDs, in case we need to re-query)

| Component | Node ID | Notes |
|---|---|---|
| Button (Primary/Secondary/Tertiary × S/M/L × 4 states) | `9003:6667` | pill shape, inset shadow `0 -2px/-4px rgba(0,0,0,0.15)` on default |
| ButtonIcon | `9003:8235` | same variants as Button, icon-only |
| Bottom-sheet | `9003:8558` | 400×444, slots: mascotSlot (120×120) + textBlock, then buttonGroup |
| AppBar | `9003:8606` | 6 variants depending on icon/button combination |
| Snackbar (Default/Success/Error) | `9003:8995` | `background/inverse` background, color chip on the right |
| Chips | `9003:8679` | sizes XXS→M, colors Primary / pro |
| Progress indicator | `9003:8923` | variant Primary / Coral, thickness 16 or 24, 0-100% |
| TextBlock (XL/L/M/S) | `9003:9039` | title + optional caption |
| Mascot slot (Knowie) | `9003:8871` | sizes XL(64) → 4XL(320) |
| Homie Cards (Knowie expressions) | inside `9003:19697` | 16 total instances; 14 have artwork and are named, 2 are empty "TBD" placeholders (see table above) |
| Screen scaffold | `4589:35261` | Status bar + slots: top nav / content / bottom nav / bottom-sheet |

---

## Reference screens (real patterns to follow for Voice Recall)

Found on the **"📓 Case study brief"** page — this holds the original
Knowunity Notion brief (matches `sprint-context.md`) and the proposed
**"Entry points"** screens: **Learning Plan** (topic tree) and **AI Chat /
Quiz**. These give the real visual pattern Voice Recall should imitate to
feel native:

- **"MCQ / question with feedback" pattern** (`Ai Chat/Quiz` frame): appBar
  with `progressIndicator`, small mascotSlot (70×70) + text bubble with the
  question, two large answer buttons (173×80 each), and a **feedback
  bottom-sheet** that slides up with: handle, title + thumbs-up/thumbs-down,
  and a continue CTA. This is likely the closest existing pattern to how
  Voice Recall's **Coach Response** should behave.
- **"Celebration / summary" pattern**: large mascotSlot (200-320px) +
  "Perfect lesson! You made 0 mistakes." + stats in 3 boxes (XP / Score /
  Blazing streak) — pattern to reuse for Voice Recall's **Session Summary**
  instead of inventing a new one.
- **"Chat / ask anything" pattern**: chat-style text input with a floating
  mascotSlot above it (130×130) — relevant for Voice Recall's **text
  fallback**, since the can't-speak path should resemble this existing input,
  not a generic textarea.

Also found in the brief deck: a 3-step framing of the whole feature —
*"Students use AI chat... We create a Quiz or learning plan... we help them
go further with voice recall"* — useful one-line framing for `CLAUDE.md`.

---


---

## Assets

The assets inside `/public/images/` are the source of truth.

Always use the exported Knowunity assets before recreating icons or mascot illustrations.

Reference screenshots inside `/reference/` are visual guidance only and should never replace the original assets.

If an asset already exists, reuse it.
Do not redraw existing Knowunity components.

---

## Layout consistency

From the first concept until the Concept Evidence screen:

- Keep Knowie fixed in the same position.
- Keep the concept/question fixed next to Knowie.
- Keep the microphone in the same central position whenever recording is available.
- Keep Transcript / Type instead / Skip in the same place.

Only the content changes:
- recording
- transcript
- thinking
- coaching
- reminder

The experience should feel like one dynamic screen updating its content, not a sequence of different screens.

Knowie behaves like a coach, not a grader.
His role is to help Helena remember, not evaluate her.


## Still open

Everything else is resolved. The one real gap left:

- **Real motion/easing values.** Figma doesn't expose transition timing
  directly for these components, so we'll define our own values in code,
  following the Prototype Rules already agreed (push slides from the right,
  sheets spring up, ~1–1.5s mocked thinking delay). If we want to match an
  exact easing curve the design team may have used elsewhere, that would
  need a separate look at Figma's prototype/interaction settings (not the
  static design file) — flagging in case it matters later, but not a
  blocker for building the prototype now.
