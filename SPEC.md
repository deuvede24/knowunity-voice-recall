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
- Entry point B (the Knowie invitation), reached automatically via an on-load attention cue rather than a manual test control — see §8.
- The full recall loop: permission primer → concept prompt (idle) → record/type/skip → confirmation (Transcript/Headline/None) → thinking → coaching (Got it / Almost there / Let's build on that) → retry or advance → repeat for 4 concepts → Concept Evidence summary.
- Text fallback, fully equivalent to voice, reachable in one tap from every recall screen.
- Mocked mic-permission primer, shown once per browser session state (see §7).

**Not building:**
- Real STT, audio capture/playback, TTS, or any model/API call.
- A real Exam Plan, topic list, or interactive checkpoint experience — one Topic screen is the entire surrounding context. (The Topic screen does show a decorative checkpoint path below the Topic card — visual context only, per sprint-context.md's "build enough surrounding Topic / Checkpoint context for the entry to make sense." It is not tappable and carries no real checkpoint state/logic.)
- Real "struggle detection" logic — Entry B (`KnowieInviteSheet`) **is** wired and reachable (see §8), but what triggers it is a mocked, always-plays-on-load attention cue, not any real checkpoint/mistake signal.
- Transcript editing, chat-style back-and-forth, or a Keywords confirmation mode.

---

## 3. Decisions made for this spec

These were confirmed directly (not already answered in the docs) and lock the remaining ambiguity:

| Decision | Resolution |
|---|---|
| Main start screen | The prototype always starts on the **Topic screen** (Entry A). |
| Entry B access | **Superseded by a later pass** (see §8): Entry B now opens automatically on every Topic screen load via an attention-cue sequence, rather than through a manual test-only control. It still doesn't simulate any real checkpoint/mistake logic — the trigger itself is mocked, not the presence of the sheet. |
| Mocked content | **4 concepts, one subject**: Japanese writing systems — Hiragana, Katakana, Furigana, "Why three writing systems?" — matching the already-validated reference screens. |
| Outcome mapping | **Fixed per concept**, deterministic regardless of voice/type path (see §9). |
| Coral vs. amber coaching tint | Reading the reference screens literally: **"Almost there" uses a warm amber/gold tint** (`pro/bold` at low opacity), **"Let's build on that" uses the coral tint** (`accent/coral/bold` at low opacity, speech-bubble icon) — this matches design.md's coral decision to "Let's build on that," not to "Almost there." Built with a bullseye/target icon for "Almost there" rather than a literal sparkle (`CoachingCard.tsx` reuses the existing `TargetIcon`/`focus.svg` as a "focus here" glyph); the internal type/data key is still named `"sparkle"`. |
| Naming | Using **"Knowie"** throughout (all assets and reference screens use it; "Noe" is unconfirmed per sprint-context.md §20). |
| Missing `questioning` asset | No `questioning` expression file exists in `/public/images` (only `thinking`, `dazed`, `standby`, `approving`, `excited`, `confused`, `determined`, `giggling`, `laughing`, `amazed` do). Confirmed resolution: use **`thinking` alone**, no crossfade, wherever `questioning` was specified — both for the processing-state animation (bob only, no eye-crossfade) and for the "Almost there" coaching expression. |
| Missing `Greed VF` font files | design.md names Greed VF as the typeface, but no font files exist anywhere in the project. Confirmed resolution: use the **platform system-UI sans-serif stack** (`-apple-system, "Segoe UI", Roboto, ...`) at design.md's exact sizes / line-heights / letter-spacing / weights — no substitute named font, no new font asset. |
| Missing purple accent token | design.md's color table has no purple/violet entry, yet the reference screenshots consistently use one (progress bar fill, Knowie name badge, discovery dot, selected chip). No live Figma connection was available to look up the exact variable. Confirmed resolution: use the sampled value **`#8f7bdc`** (measured directly from the reference screenshots), now recorded in design.md as `accent/purple/bold`. |

---

## 4. Information architecture / screens

One persistent app shell (status bar, safe areas) with two top-level routes:

1. **`/` — Topic screen** (home, "Entry"). Header (title + Weeks/Grade-goal metadata, each with a small icon) → Topic card (book icon, title, standalone purple mic — Entry A) → a decorative checkpoint path (3 nodes: active + 2 upcoming, connector dots, matching `reference/checkpoints.svg`) → a decorative bottom nav bar (matching `reference/navbar.svg`). Returns here after the summary's "Let's keep going" CTA.
   - The mic shows a small purple discovery dot the very first time Helena lands on Entry (`voiceRecall.hasSeenEntryMicDot` in `localStorage`); it disappears permanently after that first visit. No glow/pulse — same static-dot treatment as the confirmation-mode discovery dot in §5.
   - The checkpoint path and bottom nav are visual chrome only — no navigation, no tap targets, no real checkpoint state. See §2 and §8.
   - On every load, a short attention-cue sequence plays automatically (first checkpoint-node glow → mic discovery-dot pulse → the Entry B invitation sheet opens) — see §8 for the full behavior. This is not gated on first-visit only; it currently plays every time the Topic screen mounts.
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
 → thinking                 (~1.3s mocked delay)
 → coaching                 (Got it | Almost there | Let's build on that)
   → retry → concept_idle (same concept, reminder line visible)
   → milestone → concept_idle (concept N+1) — a brief auto-advancing encouragement beat, only after concept 2 and concept 3's "Got it" (see §9)
   → advance → concept_idle (concept N+1) OR → summary (after concept 4)
 → text_fallback            (reachable from concept_idle or recording via "Type instead"; rejoins directly at thinking, bypassing confirmation entirely — see §9)
 → skip                     (from concept_idle; advances straight to concept N+1 with no beat and no recorded outcome — the concept is simply absent from the summary; see §9/§11)
 → summary                  (Concept Evidence: after concept 4)
```

Entry into `/recall`:
- From Topic screen mic → `entry` → `permission_primer` (if first time) → `concept_idle` (concept 1).
- From the Knowie invitation sheet (auto-opens on the Topic screen, see §8) → "Let's try it"/"Let's do it" → same `/recall` entry as above; "Not now" dismisses back to Topic screen, no state change.

---

## 5. Progressive Trust — implementation

- Persisted preference: `voiceRecall.confirmationMode` (`"transcript" | "headline" | "none"`), `voiceRecall.hasOpenedModeSelector` (boolean) in `localStorage`. Default `"transcript"`, dot shown until `hasOpenedModeSelector` becomes `true`.
- Selector lives as a small chip beside the mic on `concept_idle` (matches reference: "Transcript ▾" chip under the mic). Opening it (tap) sets `hasOpenedModeSelector = true` immediately, regardless of whether the mode is changed — this permanently removes the purple dot.
- Selecting a mode updates `confirmationMode` and is used for **all subsequent concepts and future sessions** (persisted, not per-concept).
- `confirmation` (a.k.a. **Review**) renders inline inside the composer's central slot — not a new screen — per mode:
  - **Transcript** — "Here's what I heard" + full canned transcript text in a neutral, non-editable card.
  - **Headline** — "You explained" + one-line canned summary in the same card.
  - **None** — skipped entirely; `paused`/typed-answer → `thinking` directly.
- Revised for this pass (was: "one Continue CTA... never a second CTA"): Review shows **two** actions below the card — **Start over** (left, returns to `concept_idle`/Idle so Helena can re-record from scratch) and a **green checkmark Continue** (right, `feedback/success/bold`, same icon-button family as Send — advances to `thinking`). This gives Helena an explicit way out of a bad take without abandoning the session via the top-bar exit; it does not make the transcript/headline itself editable, and there is still exactly one way forward (the green check).
- Never editable. Never a "wrong" framing.

---

## 6. Recording control behavior

The composer (question block + mic/waveform/controls) occupies a fixed
position and fixed height across Idle / Recording / Paused / Review — only
the content inside the central slot swaps, so nothing above or below it
shifts. The large primary control (mic / Pause / Resume) is 90×90px and
always sits in its own centered row. Below it, a secondary row of circular
controls swaps per phase: Discard/Send (Recording) and Discard/Replay/Send
(Paused) are 64×64px; Start over/Continue (Review) are 56×56px.

- **Idle** — large mic button, "Tap to speak". The Transcript/Headline/None
  selector chip lives here only, directly below the mic, small and discreet
  (e.g. "Transcript ▾"). The purple discovery dot shows only the very first
  time it's ever seen in the session, not on every concept.
- **Tap to start** recording (per reference: large mic button, not
  hold-to-talk — matches `recallAttempt.jpeg`).
- Revised for this pass (was: "the large button becomes Send and stays Send
  from then on"): the large button is **always Pause/Resume**, never Send.
  **Recording** — live red pulsing waveform + timer above the button, then
  the large **Pause** button (red, pulsing, its own row), then a row below
  it: **Discard** (left) / **Send** (right). Tapping the large button
  pauses; it does not send.
- **Paused** — waveform + timer freeze in place and stay visible (no pulse).
  The large **Resume** button (mic icon, its own row — continues recording
  from where it paused), then a row below it: **Discard** (left) / **Replay**
  (mocked playback — timer restarts at 0:00 and counts up to the recorded
  duration, waveform animates only while playing, pausing replay freezes
  both, reaching the end auto-returns to this Paused display) / **Send**
  (right).
  - **Discard** — returns to `concept_idle` for the same concept, no
    confirmation dialog needed (discard = "start again," per
    prototype-rules.md).
- **Send** is now a small icon-circle control (not the large button),
  reachable identically from Recording and Paused. If `confirmationMode` is
  `none`, Send advances straight to `thinking`, unchanged. Otherwise Send
  swaps the composer's central slot to the **Review** step (§5) — Knowie and
  the question stay fixed, only the content inside the slot changes.
- **Type instead** and **Skip for now** are plain discreet text options
  (underlined, never filled CTAs), always visible from `concept_idle` (and
  reachable while recording/paused via the same footer), never requiring the
  permission primer again. They're hidden (not removed, so the footer never
  changes height) once Review is showing, since neither applies after Send.

---

## 7. Mic permission primer

- Shown once, before the very first recording attempt in the session (any entry path). Built copy is a three-tier hierarchy, not sprint-context.md §15's original one-line draft: heading *"Welcome to Voice Active Recall"*; main message *"Voice Recall uses your microphone so you can explain concepts out loud in your own words."*; supporting lines *"Your microphone is only used while recording."* and *"Knowie will show your transcript before coaching. You can change this later."*
- CTA: **Allow microphone** (mocked — no real OS permission call; pressing it always "succeeds" and proceeds to `concept_idle`) + **Type instead** (secondary, skips permission, goes straight to typed concept_idle equivalent).
- Persisted flag `voiceRecall.hasSeenPermissionPrimer` in `localStorage` so a returning session skips straight to `concept_idle`.
- If mocked "denial" is ever tapped — **out of scope**; only Allow / Type instead are offered (no deny path modeled, since it isn't in the reference screens).

---

## 8. Entry B — contextual Knowie invitation (demo path)

- **Wired and live.** `components/KnowieInviteSheet.tsx` opens automatically on
  the Topic screen, ~0.9s after load (`ATTENTION_CUE_MS` in `app/page.tsx`),
  as part of a short attention-cue sequence: the first checkpoint node plays
  a one-off glow pulse (`CheckpointPath`'s `glowIndex`), the mic discovery dot
  pulses once, and then the sheet opens automatically — no tap required to
  reveal it. This always plays on load; it is not gated to first-visit only
  (see PROGRESS.md for the open item to add that gating).
- The sheet reuses the shared `BottomSheet` (spring up, per motion-guide
  `sheet`) with a scoped green surface and Knowie (`approving`) peeking over
  its top edge. Copy has two variants, chosen by `isReturning`
  (`getHasSeenPermissionPrimer()` — true once the learner has completed
  onboarding before):
  - **First-time:** "You're doing great!" / "Let's reinforce what you've just
    learned with Voice Recall." / "Want to explain it in your own words?" /
    **Let's try it** (primary) / **Not now** (secondary).
  - **Returning:** "This is a great moment for Voice Recall." / "Reinforce
    what you've just learned." / "Want to try it now?" / **Let's do it**
    (primary) / **Not now** (secondary).
- Accepting (**Let's try it** / **Let's do it**) enters `/recall` exactly as
  Entry A would (same permission-primer-if-first-time logic, same concept 1
  start). **Not now** dismisses the sheet, no persisted state change — it
  will auto-open again on the next Topic screen load.

---

## 9. Mocked content — the 4 concepts

Deterministic, identical every run.

| # | Concept | Canned transcript (Transcript mode) | Headline (Headline mode) | First-attempt outcome | Coaching copy | Expression |
|---|---|---|---|---|---|---|
| 1 | Hiragana | "You use hiragana for native Japanese words and grammar bits, like verb endings and particles." | "Hiragana used for native words and grammar." | **Almost there** → retry → **Got it** | 1st: "Almost there, you're really close. You already explained that hiragana is used for native words. Now think about when you'd actually use it." Retry: "Nice! You connected hiragana to grammar and verb endings, not just the name." | 1st: `thinking`; retry: `approving` |
| 2 | Katakana | "Katakana is for foreign words, loanwords, and sometimes for emphasis, like English words borrowed into Japanese." | "Katakana used for foreign and loanwords." | **Got it** (first try) | "Exactly. You identified katakana's role for loanwords and emphasis." | `giggling` |
| 3 | Furigana | "Furigana are the little characters above kanji... I think they help you read it? I'm not totally sure why they're needed though." | "Furigana helps with reading kanji." | **Let's build on that** → retry → **Got it**-tier coaching, but recorded in the summary as "still practising" (deliberate, id-specific override — see below) | 1st: "Good start. You spotted part of the idea. Now focus on why furigana matters even when you already know the kanji." Retry: "You nailed it! You connected furigana to helping people read unfamiliar kanji." | 1st: `dazed`; retry: `approving` |
| 4 | Why three writing systems? | "Japanese uses all three together in one sentence — hiragana for grammar, katakana for foreign words, and kanji for meaning, so it's kind of a mix depending on the word." | "The three systems work together in one sentence." | **Got it** (first try) | "Exactly. You explained how the three systems divide the work instead of overlapping." | `approving` |

Text-fallback typed answers reuse the same transcript strings, fully
pre-filled as *editable* textarea content (not just placeholder text — the
caret is placed at the end, so it reads like resuming a draft), and resolve
to the identical fixed outcome — voice and text are mocked identically, per
equal-dignity rule. One behavior specific to text: sending a typed answer
always goes straight to `thinking`, bypassing the Transcript/Headline
confirmation layer entirely regardless of the saved `confirmationMode` —
there's nothing to confirm when Helena just typed it herself.

**Retry copy**: idle screen re-renders with a short reminder line in place of
the usual instruction (mic re-centered, chip still shows saved mode, no dot)
— concept 1: *"Try connecting hiragana to grammar, particles, or verb
endings."*; concept 3: *"Think about the problem furigana solves for
readers."*

**Furigana's outcome override**: concept 3's retry resolves to the same
`gotIt` coaching band/copy/expression as any other successful retry, but
`RecallFlow.handleCoachingAction` special-cases this one concept id and
records its summary outcome as `"practising"` instead of `"gotIt"` — so the
Concept Evidence screen still shows it as "still practising" (per the
original demo intent) even though the coaching moment itself reads as a full
success. This is a deliberate, hardcoded exception for this one concept, not
a general rule.

**Skip**: tapping "Skip for now" (available on any concept, not just
concept 3) advances straight to the next concept with **no beat, no
coaching, and no recorded outcome** — the concept is simply absent from the
Concept Evidence summary (§11). The `"skipped"` stage and its "Skipped for
now" message still exist in `RecallFlow.tsx` but are currently dead code —
`handleSkip` no longer transitions into that stage.

**Milestone messages** (not previously documented): after a **Got it**
resolution on concept 2 or concept 3 specifically, Knowie briefly shows an
encouraging line in the same persistent bubble — "Great job! Two more to
go." after concept 2, "Last one! You've got this." after concept 3 — with an
`excited` bounce, then auto-advances after ~1.1s with no tap required.
Concepts 1 and 4 have no milestone and advance immediately.
`lib/concepts.ts`'s `MILESTONE_MESSAGES` is keyed by concept index and only
defines entries for indices 1 and 2.

---

## 10. Coaching → expression → tint mapping

| Band | Expression | Background tint | Icon |
|---|---|---|---|
| Got it | `approving` per concept, except Katakana's first attempt (`giggling` — a lighter variant, authored per-concept in `lib/concepts.ts` rather than a fixed rule) | `feedback/success/bold` @ low opacity | checkmark |
| Almost there | `thinking` (no `questioning` asset exists — see §3) | `pro/bold` (amber) @ low opacity | bullseye/target (`TargetIcon`; the internal data key is still `"sparkle"` — see §3) |
| Let's build on that | `dazed` | `accent/coral/bold` @ low opacity | speech bubble |

Internal band names are never rendered as student-facing labels — only the coaching copy and CTA (**Continue** for Got it / **Try again** for the other two) are shown. Separately, `excited` is used for the milestone-message beat after concepts 2 and 3 (§9), not as part of the coaching card itself.

---

## 11. Concept Evidence summary

- Knowie `excited`.
- **Only concepts with a recorded outcome are shown** — `SummaryScreen`
  filters to `outcomes[concept.id] !== undefined`. In the deterministic demo
  path all 4 concepts resolve to an outcome (see §9), so all 4 normally
  appear. If a concept is genuinely skipped via "Skip for now" it is simply
  absent from this list (no row, no "skipped" state — see §9).
- Headline is conditional: **"You explained more than you thought you
  could."** when at least one concept has evidence, or **"Nothing saved
  yet."** if every concept was skipped (an edge case the deterministic demo
  path doesn't hit, but the UI supports it).
- Evidence rows, one per shown concept, in order: a checkmark (green,
  `gotIt`) or a circle (coral, `practising`) + the concept term + a short
  per-concept label (`SUMMARY_LABELS` in `SummaryScreen.tsx`), not a generic
  "your own words" caption:
  - Hiragana → ✓ "grammar → verb endings" (green)
  - Katakana → ✓ "foreign words → emphasis" (green)
  - Furigana → ○ "Still practising: reading kanji" (coral/muted, not "wrong"/"missed")
  - Why three writing systems? → ✓ "grammar + loanwords + meaning" (green)
- Supporting line (conditional, same evidence/empty split as the headline):
  *"These should feel easier to recall next time — because you explained
  them yourself."* / *"Nothing was saved this time. You can always come back
  and give it another try."*
- CTA: **Let's keep going** → returns to the Topic screen (`/`). No score-only framing; the "still practising" item stays visible and actionable, not hidden as a failure.

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

- [x] Topic screen is the app's start route; book icon + standalone purple mic present; checkpoint path and bottom nav present below the Topic card (§16).
- [x] Entry B (`KnowieInviteSheet`) is wired and reachable — it auto-opens on the Topic screen after the attention-cue sequence (§8).
- [x] Permission primer shows once per browser (localStorage-gated), then never again; "Type instead" bypasses it.
- [ ] Full loop playable start to finish via voice-mocked path for all 4 concepts, including the concept-1 retry.
- [ ] Full loop playable start to finish via text fallback only, same outcomes.
- [ ] Skip path works for any concept and still reaches a non-punitive summary state — behavior changed from the original concept-3-only skip design (§9); needs a fresh pass to confirm the current silent-drop behavior still feels right.
- [x] Transcript / Headline / None all selectable, default Transcript, dot logic correct, preference persists across a page reload.
- [x] Thinking state lasts ~1.3s and uses the `thinking` bob loop only (no crossfade — the `questioning` asset it would have paired with doesn't exist, see §3), no new assets.
- [x] Coaching bands never render their internal names, only copy + Continue/Try again.
- [ ] Summary shows evidence-style states for each recorded concept (no "wrong"/"failed"/"missed" labels) and a forward CTA back to the Topic screen — confirm the skip-drops-the-row behavior (§11) is the intended final behavior, not just a side effect.
- [ ] Works at 390px, dark mode only, reduced-motion respected, 44×44px touch targets, contrast checked on term/reply/hint text — contrast has not been formally audited yet (see PROGRESS.md).
- [x] Build/typecheck passes; ready for `vercel deploy`.

---

## 15. Out of scope reminders (do not build)

Real STT/audio/TTS/LLM calls, transcript editing, chat-style multi-turn, Keywords mode, a full interactive Exam Plan/checkpoint UI (the Entry screen's checkpoint path is decorative context only, §16), real mistake-detection/trigger algorithm, mic-permission denial handling, judgmental Knowie expressions (`overIt`, `angry`, `sad`).

---

## 16. Entry screen chrome — checkpoint path & bottom nav (added this pass)

Scope for this pass was the Entry (Topic) screen and the first-time `PermissionPrimer` only — the recall composer, Type instead, Furigana, summary, replay, send icon, recording flow/animations, and the recall state machine were not touched.

**Topic card mic treatment**: the book icon and mic are both tinted `purple-bold` (design.md's recovered `accent/purple/bold`). The mic lost its filled circular button background and is now a standalone icon aligned to the right of the Topic card, sized at `icon/large` (24px per design.md's icon scale) rather than the recall composer's larger mic — this is Entry's own smaller, secondary affordance, not the primary recall mic.

**Entry mic discovery dot**: same static-dot treatment as the confirmation-mode dot (§5) — `bg-purple-bold`, no glow/pulse animation. Shown once, the very first time Helena lands on Entry (`voiceRecall.hasSeenEntryMicDot` in `localStorage`, set immediately on first mount), never again after that visit.

**Checkpoint path** (`components/CheckpointPath.tsx`): a decorative, non-interactive path of 3 nodes below the Topic card, matching `reference/checkpoints.svg`'s circle sizes (110px outer ring / 88px fill, 8px ring stroke at 10% white), connector-dot styling (3× 4px dots at 10% white between nodes), label typography (`headline-s` bold, centered, two-line-capable), and the zigzag vertical rhythm (alternating horizontal offset between nodes). The first node reads as active (solid `pro-bold` gold fill, white icon); the remaining nodes read as upcoming (10%-white fill, gold icon) — matching the reference's active/upcoming states. This accent was swapped from `purple-bold` to `pro-bold` (design.md's yellow/gold "Pro" token) in a later visual-polish pass to match the real app's gold checkpoint styling; see design.md. Labels for this pass: "Writing Fundamentals," "Reading & Recognition," "Practice & Review." No tap targets, no completion state, no real checkpoint/mistake data — this is surrounding context for the Entry screen per sprint-context.md's "build enough surrounding Topic / Checkpoint context for the entry to make sense," not the interactive checkpoint experience ruled out in §2/§15. `glowIndex` (an optional prop) plays a one-off, non-looping opacity pulse on a single node — used by the Topic screen's attention-cue sequence, see §8.

**Bottom nav** (`components/BottomNav.tsx`): a decorative 5-icon tab bar + home-indicator pill matching `reference/navbar.svg`'s layout (icon set, one active tab tinted `purple-bold`, avatar-style circle for the last tab since no real profile asset exists to embed). No routing — Voice Recall doesn't own these tabs; it's chrome for native-app feel only, per CLAUDE.md's "never recreate the full Knowunity app." It sits at the bottom of the Topic screen's flex column (`mt-auto`), so it pins to the viewport bottom when content is short and simply follows at the end of scrollable content when the checkpoint path makes the screen taller than one viewport (390×844) — there was no in-scope way to make it viewport-sticky during scroll without changing `PhoneShell`'s height model, which is shared with the recall flow and out of scope for this pass.

**Entry B**: see §8 for current, wired behavior — a later pass connected `KnowieInviteSheet` to an automatic attention-cue trigger on the Topic screen, superseding the "removed from the visible flow" state this section originally described.

**`PermissionPrimer`**: logic unchanged (still gated by `voiceRecall.hasSeenPermissionPrimer`, still "Allow microphone" / "Type instead"). Copy and visual hierarchy were revised in a later pass into three explicit tiers: a dominant headline ("Welcome to Voice Active Recall," `headline-s`/black), a main message one step down in weight ("Voice Recall uses your microphone so you can explain concepts out loud in your own words," `body-m`/semibold/white), and quieter supporting copy two steps down ("Your microphone is only used while recording." / "Knowie will show your transcript before coaching. You can change this later.," `caption-m`/regular/grey). The earlier tagline ("Say it out loud. Know it for real.") was removed as part of that copy revision.

**Addendum — later visual-polish pass**: the Topic screen received a further proportion pass after this section was written: the title shrank from `headline-xl` (44px) to a tighter 36px so it reads closer to the real app's hierarchy; the metadata line gained `calendar.svg`/`grade.svg` icons beside "3 Weeks" / "Grade goal: 2" (previously plain text); and the Topic card was tightened (smaller `body-s` label text, reduced vertical padding, a small horizontal inset) to feel less oversized at 390×844. None of this changed layout structure, interactions, or the checkpoint/bottom-nav behavior described above.
