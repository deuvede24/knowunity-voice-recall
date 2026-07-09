# SPEC.md — Voice Recall Prototype (Module 4 Build Spec)

> This spec translates `sprint-context.md` (product), `design.md` (visual system),
> `prototype-rules.md` (build rules), `motion-guide.md` (motion) and the committed
> reference screens (`/reference/`, `wireflow.html`) into a concrete, buildable
> plan. It does not introduce new product decisions — where a call was still
> open, the resolution agreed with the product owner is recorded under
> **Decisions made for this spec**.

---

## 1. Concept statement

Voice Recall helps students transform recognition into retrieval by explaining
concepts in their own words inside the existing Exam Plan. Knowie asks; Helena
retrieves. Feedback is generous and coach-like, never a grade.

---

## 2. Scope

**Building:**
- One Topic screen (Exam Plan stand-in) as the app's home/start screen — entry point A.
- A hidden-in-plain-sight testing affordance ("Preview contextual entry") that reveals entry point B.
- The full recall loop: permission primer → concept prompt (idle) → record/type/skip → confirmation (Transcript/Headline/None) → thinking → coaching (Got it / Almost there / Let's build on that) → retry or advance → repeat for 4 concepts → Concept Evidence summary.
- Text fallback, fully equivalent to voice, reachable in one tap from every recall screen.
- Mocked mic-permission primer, shown once per browser session state (see §7).

**Not building:**
- Real STT, audio capture/playback, TTS, or any model/API call.
- A real Exam Plan, topic list, or interactive checkpoint experience — one Topic screen is the entire surrounding context. (The Topic screen does show a decorative checkpoint path below the Topic card — visual context only, per sprint-context.md's "build enough surrounding Topic / Checkpoint context for the entry to make sense." It is not tappable and carries no real checkpoint state/logic.)
- Real "struggle detection" logic — Entry B (`KnowieInviteSheet`) is not reachable from the visible prototype flow in this pass; the component and its wiring are kept in the codebase for a possible future entry point, not deleted.
- Transcript editing, chat-style back-and-forth, or a Keywords confirmation mode.

---

## 3. Decisions made for this spec

These were confirmed directly (not already answered in the docs) and lock the remaining ambiguity:

| Decision | Resolution |
|---|---|
| Main start screen | The prototype always starts on the **Topic screen** (Entry A). |
| Entry B access | Entry B is **not** part of the organic tap path. A small, clearly test-only control on the Topic screen, labeled **"Preview contextual entry"**, reveals the Knowie invitation bottom sheet on tap. This exists only to demonstrate the alternative entry point without simulating real checkpoint/mistake logic. |
| Mocked content | **4 concepts, one subject**: Japanese writing systems — Hiragana, Katakana, Furigana, "Why three writing systems?" — matching the already-validated reference screens. |
| Outcome mapping | **Fixed per concept**, deterministic regardless of voice/type path (see §9). |
| Coral vs. amber coaching tint | Reading the reference screens literally: **"Almost there" uses a warm amber/gold tint** (`pro/bold` at low opacity, sparkle icon), **"Let's build on that" uses the coral tint** (`accent/coral/bold` at low opacity, speech-bubble icon) — this matches design.md's coral decision to "Let's build on that," not to "Almost there." Flagged for a quick visual sign-off once built, not a blocker. |
| Naming | Using **"Knowie"** throughout (all assets and reference screens use it; "Noe" is unconfirmed per sprint-context.md §20). |
| Missing `questioning` asset | No `questioning` expression file exists in `/public/images` (only `thinking`, `dazed`, `standby`, `approving`, `excited`, `confused`, `determined`, `giggling`, `laughing`, `amazed` do). Confirmed resolution: use **`thinking` alone**, no crossfade, wherever `questioning` was specified — both for the processing-state animation (bob only, no eye-crossfade) and for the "Almost there" coaching expression. |
| Missing `Greed VF` font files | design.md names Greed VF as the typeface, but no font files exist anywhere in the project. Confirmed resolution: use the **platform system-UI sans-serif stack** (`-apple-system, "Segoe UI", Roboto, ...`) at design.md's exact sizes / line-heights / letter-spacing / weights — no substitute named font, no new font asset. |
| Missing purple accent token | design.md's color table has no purple/violet entry, yet the reference screenshots consistently use one (progress bar fill, Knowie name badge, discovery dot, selected chip). No live Figma connection was available to look up the exact variable. Confirmed resolution: use the sampled value **`#8f7bdc`** (measured directly from the reference screenshots), now recorded in design.md as `accent/purple/bold`. |

---

## 4. Information architecture / screens

One persistent app shell (status bar, safe areas) with two top-level routes:

1. **`/` — Topic screen** (home, "Entry"). Header (title + due/grade-goal metadata) → Topic card (book icon, title, standalone purple mic — Entry A) → a decorative checkpoint path (3 nodes: active + 2 upcoming, connector dots, matching `reference/checkpoints.svg`) → a decorative bottom nav bar (matching `reference/navbar.svg`). Returns here after the summary's "Let's keep going" CTA.
   - The mic shows a small purple discovery dot the very first time Helena lands on Entry (`voiceRecall.hasSeenEntryMicDot` in `localStorage`); it disappears permanently after that first visit. No glow/pulse — same static-dot treatment as the confirmation-mode discovery dot in §5.
   - The checkpoint path and bottom nav are visual chrome only — no navigation, no tap targets, no real checkpoint state. See §2 and §8.
2. **`/recall`** — the entire recall loop, built as **one evolving screen** (per design.md "Layout consistency" and motion-guide's "Coaching transition"), not a stack of routes. Internal state machine drives what's rendered in the content region while Knowie, the concept text, and the mic stay fixed in place.

### Recall screen states (state machine)

```
entry
 → permission_primer        (first mic use only; skippable via "Type instead")
 → concept_idle             (concept N, mic / Type instead / Skip visible, Transcript-mode chip)
 → recording                (tap mic → live recording; pause/resume/discard)
   → paused
   → (discard → concept_idle)
 → confirmation             (Transcript | Headline | None, per saved mode)
 → thinking                 (~1.2s mocked delay)
 → coaching                 (Got it | Almost there | Let's build on that)
   → retry → concept_idle (same concept, reminder line visible)
   → advance → concept_idle (concept N+1) OR → summary (after concept 4)
 → text_fallback            (reachable from concept_idle or recording via "Type instead"; rejoins at confirmation)
 → skip                     (from concept_idle; brief "Skipped for now" beat → concept N+1)
 → summary                  (Concept Evidence: after concept 4, or after all concepts have an outcome/skip)
```

Entry into `/recall`:
- From Topic screen mic → `entry` → `permission_primer` (if first time) → `concept_idle` (concept 1).
- From "Preview contextual entry" → Knowie invitation sheet over the Topic screen → "Yes, let's try" → same `/recall` entry as above; "Not now" dismisses back to Topic screen, no state change.

---

## 5. Progressive Trust — implementation

- Persisted preference: `voiceRecall.confirmationMode` (`"transcript" | "headline" | "none"`), `voiceRecall.hasOpenedModeSelector` (boolean) in `localStorage`. Default `"transcript"`, dot shown until `hasOpenedModeSelector` becomes `true`.
- Selector lives as a small chip beside the mic on `concept_idle` (matches reference: "Transcript ▾" chip under the mic). Opening it (tap) sets `hasOpenedModeSelector = true` immediately, regardless of whether the mode is changed — this permanently removes the purple dot.
- Selecting a mode updates `confirmationMode` and is used for **all subsequent concepts and future sessions** (persisted, not per-concept).
- `confirmation` state renders per mode:
  - **Transcript** — "Here's what I heard" + full canned transcript text, one **Continue** CTA.
  - **Headline** — "You explained" + one-line canned summary, one **Continue** CTA.
  - **None** — skipped entirely; `paused`/typed-answer → `thinking` directly.
- Never editable. Never a second CTA. Never a "wrong" framing.

---

## 6. Recording control behavior

The composer (question block + mic/waveform/controls) occupies a fixed
position and fixed height across Idle / Recording / Paused — only the
content inside each slot swaps, so nothing above or below it shifts.

- **Idle** — large mic button, "Tap to speak". The Transcript/Headline/None
  selector chip lives here only, directly below the mic, small and discreet
  (e.g. "Transcript ▾"). The purple discovery dot shows only the very first
  time it's ever seen in the session, not on every concept.
- **Tap to start** recording (per reference: large mic button, not
  hold-to-talk — matches `recallAttempt.jpeg`). The large button becomes the
  **Send** arrow icon at that point and **stays Send from then on** — it
  never reverts to a mic glyph and never shows a pause glyph.
- **Recording** — live red pulsing waveform + timer above the button
  (motion-guide "Recording / listening state" pulse). Two small icon-circle
  secondary controls below: **Pause**, **Discard** (trash). No plain-text
  "Cancel" — Discard is the only dismiss action. The mode selector is not
  shown here; the mode is already locked in for this attempt.
- **Paused** — Send button unchanged. Waveform + timer freeze in place and
  stay visible (no pulse). Three small icon-circle controls: **Play**
  (mocked, no real audio), **Resume** (mic icon — continues recording from
  where it paused), **Discard**. No small Send circle here; Send only lives
  in the large composer button.
  - **Discard** — returns to `concept_idle` for the same concept, no
    confirmation dialog needed (discard = "start again," per
    prototype-rules.md).
- Tapping the large **Send** button works identically in Recording and
  Paused — ends the recording immediately and advances to `confirmation`.
- **Type instead** and **Skip for now** are plain discreet text options
  (underlined, never filled CTAs), always visible from `concept_idle` (and
  reachable while recording/paused via the same footer), never requiring the
  permission primer again.

---

## 7. Mic permission primer

- Shown once, before the very first recording attempt in the session (any entry path). Copy per sprint-context.md §15: *"You are about to use Voice Recall. We need mic access so you can explain the term out loud."*
- CTA: **Allow microphone** (mocked — no real OS permission call; pressing it always "succeeds" and proceeds to `concept_idle`) + **Type instead** (secondary, skips permission, goes straight to typed concept_idle equivalent).
- Persisted flag `voiceRecall.hasSeenPermissionPrimer` in `localStorage` so a returning session skips straight to `concept_idle`.
- If mocked "denial" is ever tapped — **out of scope**; only Allow / Type instead are offered (no deny path modeled, since it isn't in the reference screens).

---

## 8. Entry B — contextual Knowie invitation (demo path)

- **Not reachable from the visible prototype flow as of this pass.** The "Preview contextual entry" test control has been removed from the Topic screen UI. `components/KnowieInviteSheet.tsx` and its bottom-sheet implementation are kept in the codebase, unwired, for a possible future entry point (e.g. a real struggle-signal trigger) — not deleted.
- Behavior, if/when re-wired: opens a bottom sheet (spring up, per motion-guide `sheet`) over the Topic screen: Knowie (`approving`), context line ("Fix Mistakes · 2nd miss" style caption), "You've missed 'hiragana' twice", "Want to explain it back to me?", **Yes, let's try** (primary) / **Not now** (tertiary text). "Yes, let's try" → enters `/recall` exactly as Entry A would (same permission-primer-if-first-time logic, same concept 1 start). "Not now" → sheet dismisses, no persisted state change.

---

## 9. Mocked content — the 4 concepts

Deterministic, identical every run.

| # | Concept | Canned transcript (Transcript mode) | Headline (Headline mode) | First-attempt outcome | Coaching copy | Expression |
|---|---|---|---|---|---|---|
| 1 | Hiragana | "You use hiragana for native Japanese words and grammar bits, like verb endings and particles." | "Hiragana used for native words and grammar." | **Almost there** → retry → **Got it** | 1st: "Nice, you're really close. You already explained that hiragana is used for native words. Now think about when you'd actually use it." Retry: "Exactly. You connected hiragana to grammar and verb endings, not just the name." | 1st: `thinking`; retry: `approving` |
| 2 | Katakana | "Katakana is for foreign words, loanwords, and sometimes for emphasis, like English words borrowed into Japanese." | "Katakana used for foreign and loanwords." | **Got it** (first try) | "Exactly. You identified katakana's role for loanwords and emphasis." | `approving` |
| 3 | Furigana | "Furigana are the little characters above kanji... I think they help you read it? I'm not totally sure why they're needed though." | "Furigana helps with reading kanji." | **Let's build on that** → student **skips** rather than retrying | "Good start. You spotted part of the idea. Now focus on why furigana matters even when you already know the kanji." | `dazed` |
| 4 | Why three writing systems? | "Japanese uses all three together in one sentence — hiragana for grammar, katakana for foreign words, and kanji for meaning, so it's kind of a mix depending on the word." | "The three systems work together in one sentence." | **Got it** (first try) | "Exactly. You explained how the three systems divide the work instead of overlapping." | `approving` |

Text-fallback typed answers reuse the same transcript strings (pre-filled as placeholder/example text pattern in the textarea's canned "typed" version) and resolve to the identical fixed outcome — voice and text are mocked identically, per equal-dignity rule.

**Retry copy** (concept 1 only, since it's the sole retry in this deterministic run): idle screen re-renders with a short reminder line, per reference `retry-summary.jpeg`: *"Reminder: When would you use it?"* in place of the usual instruction, mic re-centered, chip still shows saved mode (no dot).

**Skip** (concept 3): tapping "Skip for now" shows a brief `Skipped for now` beat (Knowie `standby`) then advances to concept 4. No coaching is generated for a skip.

---

## 10. Coaching → expression → tint mapping

| Band | Expression | Background tint | Icon |
|---|---|---|---|
| Got it | `approving` (or `excited` if it's the final concept and all others were "Got it" — not required for this deterministic set, but supported if content changes later) | `feedback/success/bold` @ low opacity | checkmark |
| Almost there | `thinking` (no `questioning` asset exists — see §3) | `pro/bold` (amber) @ low opacity | sparkle |
| Let's build on that | `dazed` | `accent/coral/bold` @ low opacity | speech bubble |

Internal band names are never rendered as student-facing labels — only the coaching copy and CTA (**Continue** for Got it / **Try again** for the other two) are shown.

---

## 11. Concept Evidence summary

- Knowie `excited`, headline: **"You explained more than you thought you could."**
- Evidence rows, one per concept, in order:
  - Hiragana → ✓ "your own words" (green)
  - Katakana → ✓ "your own words" (green)
  - Furigana → ○ "still practising" (coral/muted, not "wrong"/"missed")
  - Why three writing systems? → ✓ "your own words" (green)
- Supporting line: *"These should feel easier to recall next time — because you explained them yourself."*
- CTA: **Let's keep going** → returns to the Topic screen (`/`). No score-only framing; skipped/practising items stay visible and actionable, not hidden as failures.

---

## 12. Visual & motion — no new decisions

Fully inherited, not restated in duplicate:
- Colors, type, spacing, radius, icon sizes, component node references → `design.md`.
- Screen chrome, safe areas, touch targets, transitions, content rules, accessibility baseline → `prototype-rules.md`.
- All animation timings/presets (`gentle`/`snappy`/`sheet`/`soft`), per-moment recipes (mic press, recording pulse, thinking shimmer, reply entrance, result reveal, sheet slide-up, summary stagger) → `motion-guide.md`. Implement with `motion/react`; no hand-rolled CSS keyframes. Exception per §3: the "thinking" state uses only the ±3° bob loop on the static `thinking` image — no eye-crossfade, since the `questioning` asset it would crossfade with doesn't exist.

---

## 13. Stack

- Next.js (App Router) + React + TypeScript + Tailwind, using `design.md` tokens as Tailwind theme extensions (colors, spacing, radius, font sizes) rather than inline hex/px.
- `motion/react` for all animation; `"use client"` on any file using it.
- Local component state + `localStorage` for the two persisted prefs (§5, §7). No backend, no API routes, no database.
- Images referenced from `/public/images/` only, via `/images/[filename]`.

---

## 14. Definition of done (build-specific, restates CLAUDE.md)

- [ ] Topic screen is the app's start route; book icon + standalone purple mic present; checkpoint path and bottom nav present below the Topic card (§16).
- [ ] Entry B (`KnowieInviteSheet`) is not reachable from any visible control in this pass; the component still exists and still compiles.
- [ ] Permission primer shows once per browser (localStorage-gated), then never again; "Type instead" bypasses it.
- [ ] Full loop playable start to finish via voice-mocked path for all 4 concepts, including the concept-1 retry.
- [ ] Full loop playable start to finish via text fallback only, same outcomes.
- [ ] Skip path works for concept 3 and still reaches a non-punitive summary state.
- [ ] Transcript / Headline / None all selectable, default Transcript, dot logic correct, preference persists across a page reload.
- [ ] Thinking state lasts ~1–1.5s and uses the thinking/questioning crossfade + bob, no new assets.
- [ ] Coaching bands never render their internal names, only copy + Continue/Try again.
- [ ] Summary shows all 4 concepts with evidence-style states (no "wrong"/"failed"/"missed" labels) and a forward CTA back to the Topic screen.
- [ ] Works at 390px, dark mode only, reduced-motion respected, 44×44px touch targets, contrast checked on term/reply/hint text.
- [ ] Build/typecheck passes; ready for `vercel deploy`.

---

## 15. Out of scope reminders (do not build)

Real STT/audio/TTS/LLM calls, transcript editing, chat-style multi-turn, Keywords mode, a full interactive Exam Plan/checkpoint UI (the Entry screen's checkpoint path is decorative context only, §16), real mistake-detection/trigger algorithm, mic-permission denial handling, judgmental Knowie expressions (`overIt`, `angry`, `sad`).

---

## 16. Entry screen chrome — checkpoint path & bottom nav (added this pass)

Scope for this pass was the Entry (Topic) screen and the first-time `PermissionPrimer` only — the recall composer, Type instead, Furigana, summary, replay, send icon, recording flow/animations, and the recall state machine were not touched.

**Topic card mic treatment**: the book icon and mic are both tinted `purple-bold` (design.md's recovered `accent/purple/bold`). The mic lost its filled circular button background and is now a standalone icon aligned to the right of the Topic card, sized at `icon/large` (24px per design.md's icon scale) rather than the recall composer's larger mic — this is Entry's own smaller, secondary affordance, not the primary recall mic.

**Entry mic discovery dot**: same static-dot treatment as the confirmation-mode dot (§5) — `bg-purple-bold`, no glow/pulse animation. Shown once, the very first time Helena lands on Entry (`voiceRecall.hasSeenEntryMicDot` in `localStorage`, set immediately on first mount), never again after that visit.

**Checkpoint path** (`components/CheckpointPath.tsx`): a decorative, non-interactive path of 3 nodes below the Topic card, matching `reference/checkpoints.svg`'s circle sizes (110px outer ring / 88px fill, 8px ring stroke at 10% white), connector-dot styling (3× 4px dots at 10% white between nodes), label typography (`headline-s` bold, centered, two-line-capable), and the zigzag vertical rhythm (alternating horizontal offset between nodes). The first node reads as active (solid `purple-bold` fill, white icon); the remaining nodes read as upcoming (10%-white fill, purple icon) — matching the reference's active/upcoming states. Labels for this pass: "Writing Fundamentals," "Reading & Recognition," "Practice & Review." No tap targets, no completion state, no real checkpoint/mistake data — this is surrounding context for the Entry screen per sprint-context.md's "build enough surrounding Topic / Checkpoint context for the entry to make sense," not the interactive checkpoint experience ruled out in §2/§15.

**Bottom nav** (`components/BottomNav.tsx`): a decorative 5-icon tab bar + home-indicator pill matching `reference/navbar.svg`'s layout (icon set, one active tab tinted `purple-bold`, avatar-style circle for the last tab since no real profile asset exists to embed). No routing — Voice Recall doesn't own these tabs; it's chrome for native-app feel only, per CLAUDE.md's "never recreate the full Knowunity app." It sits at the bottom of the Topic screen's flex column (`mt-auto`), so it pins to the viewport bottom when content is short and simply follows at the end of scrollable content when the checkpoint path makes the screen taller than one viewport (390×844) — there was no in-scope way to make it viewport-sticky during scroll without changing `PhoneShell`'s height model, which is shared with the recall flow and out of scope for this pass.

**Entry B removed from the visible flow**: see §8 — `KnowieInviteSheet` and its wiring are kept in the codebase, just not reachable from any current Topic-screen control.

**`PermissionPrimer` — visual polish only**: no copy or logic changes (still gated by `voiceRecall.hasSeenPermissionPrimer`, still "Allow microphone" / "Type instead"). Fixed an invalid Tailwind class (`text-headline-m`, which isn't a defined design.md scale) to `text-headline-s`. Regrouped spacing so the two explanatory paragraphs read as one block (tighter internal gap) with more deliberate spacing from the mascot, title, and button, per `reference/firstTimeIntro+Permission.svg`'s hierarchy.
