# PROGRESS.md — Session Notes

Status snapshots, most recent first. See SPEC.md for the full build spec.

---

## Session — 2026-07-12: Documentation sync pass (no code changes)

Read the current `app/`, `components/`, and `lib/` code end to end and
reconciled `CLAUDE.md`, `SPEC.md`, `design.md`, and `sprint-context.md`
against it. No product/behavior decisions were made and no code was touched
— this was purely correcting docs that had drifted behind several rounds of
implementation and polish since they were last updated.

**What was out of date and corrected:**
- **Entry B is now wired, docs still said otherwise.** `KnowieInviteSheet`
  auto-opens on the Topic screen via an attention-cue sequence (checkpoint
  glow → mic-dot pulse → sheet), with first-time/returning copy variants —
  this was built across the 2026-07-11 and 2026-07-12 sessions below, but
  `CLAUDE.md`, and SPEC.md §2/§3/§4/§8/§14/§16, still described it as an
  unwired, "Preview contextual entry"-gated component. All five updated to
  describe the current auto-trigger behavior.
- **Furigana no longer skips.** SPEC.md §9 described concept 3 as
  "Let's build on that → skip." In the actual code it now retries into a
  full `gotIt`-tier coaching response, but `RecallFlow.handleCoachingAction`
  hardcodes its recorded outcome to `"practising"` so the summary still
  shows it as evidence-in-progress. The generic "Skip for now" path (still
  available on any concept) is a separate, now-silent action — it advances
  with no beat and no recorded outcome, so the concept just doesn't appear
  in the summary; the `"skipped"` stage/copy is dead code. SPEC.md §9/§11/§4
  rewritten to describe this accurately.
- **Undocumented milestone-message feature.** `lib/concepts.ts`'s
  `MILESTONE_MESSAGES` (a brief "Great job! Two more to go." / "Last one!
  You've got this." beat after concepts 2 and 3) existed in code with no
  mention in any doc. Added to SPEC.md §9/§10 and the state-machine diagram.
- **Concept Evidence summary copy was wrong.** SPEC.md §11 said every row
  reads "your own words." The built `SummaryScreen` actually shows a
  per-concept label (e.g. "grammar → verb endings"), filters out any concept
  with no recorded outcome, and has a whole unmentioned empty state
  ("Nothing saved yet."). Corrected.
- **Checkpoint accent color.** SPEC.md §16 still said the active checkpoint
  node is `purple-bold`; a later visual-polish pass swapped it to
  `pro-bold` (gold) to match the real app. Corrected in SPEC.md and noted
  in design.md's color table.
- **Minor content drift**: Katakana's coaching expression is `giggling` in
  code, not `approving` as SPEC.md's table said; "Almost there"'s icon
  renders as a bullseye/target glyph, not a literal sparkle; recording
  control touch targets are 90px (primary) / 64px (Recording, Paused) / 56px
  (Review) — SPEC.md §6 previously stated a blanket 90×80/56px that didn't
  match; the mocked "thinking" delay is 1.3s, not "~1.2s"; the permission
  primer's quoted copy in SPEC.md §7 didn't match either the old or current
  built copy — replaced with the actual current three-tier copy (see
  below). All corrected in place.
- **`PermissionPrimer`'s copy/hierarchy pass.** SPEC.md §16 and §7 described
  the original 2026-07-09 visual-only fix. Since then the copy was rewritten
  into an explicit three-tier hierarchy (dominant heading / lighter main
  message / quiet grey supporting copy) and the old tagline ("Say it out
  loud. Know it for real.") was dropped. Docs updated to quote the current
  copy.
- **`design.md` gaps**: the "official complete list" of Knowie expressions
  didn't include `micro` (used by the permission primer, a real asset in
  `/public/images/`), and the planned `thinking`/`questioning` crossfade was
  still described as the build target even though SPEC.md §3 had already
  recorded that it was dropped (no `questioning` asset exists) — code
  confirms only the bob loop was built. Both fixed.
- **`sprint-context.md`**: only the top status line was stale ("entering
  Module 4" when Module 4 is now well underway) — everything else in that
  document is product strategy/history, not implementation status, and
  didn't need correction.

**What was NOT changed:** no component, route, or lib file was touched. The
`SPEC.md` §14 checklist had a handful of boxes flipped to `[x]` where the
current code statically and unambiguously satisfies them (e.g. Topic screen
as start route, permission-primer gating, thinking delay) — items that need
an actual runtime/device pass to confirm (full loop playthroughs, contrast
audit) were left unchecked rather than assumed.

---

## Session — 2026-07-11: Contextual Voice Recall invitation (Entry B replacement)

Replaced the old, unwired Entry B prototype ("Fix Mistakes · 2nd miss" / "Yes,
let's try") with the new contextual invitation, wired as the first-time entry
point into Voice Active Recall.

**What changed:**
- `components/BottomSheet.tsx` — added two backward-compatible optional
  props: `surfaceClassName` (default `"bg-surface"`, unchanged for every
  existing caller) and `topOverlay` (renders behind the sheet, anchored to
  its top edge). Default appearance for every other usage (ModeSelector,
  etc.) is untouched.
- `components/KnowieInviteSheet.tsx` — rewritten: new copy ("You're doing
  great!" / reinforcement body / "Want to explain it in your own words?" /
  **Let's try it** / **Not now**), green surface via
  `surfaceClassName="bg-success-onbold"` (an existing design.md token, not a
  new hex), Knowie passed via `topOverlay` so it peeks from behind the
  sheet's top edge instead of sitting in the normal content flow. Primary
  CTA reuses `PrimaryButton` unchanged; the secondary CTA is a local
  `bg-white/10` pill scoped to this file only (per `ctaReference.svg`), not
  a change to the shared `SecondaryButton`/`TextButton`.
- `components/CheckpointPath.tsx` — added an optional `glowIndex` prop that
  plays one non-looping opacity pulse (reusing `purple-bold`) on a single
  node. No completion-state or persisted-data change; omitted by default.
- `components/PhoneShell.tsx` — added `position: relative` (was previously
  unpositioned) so `BottomSheet`'s `absolute inset-0` confines itself to the
  390px phone frame instead of the browser viewport; purely structural, no
  visual change on its own.
- `app/page.tsx` — wired the automatic attention-cue sequence: the first
  checkpoint node glows once, then the existing mic discovery dot pulses
  once (both via declarative Motion `delay`, not manual state-stitching),
  then the invitation opens automatically. Accepting it reuses the existing
  `enterRecall()` navigation (same permission-primer-if-first-time path as
  the manual mic entry); dismissing it just closes the sheet.
- `components/PermissionPrimer.tsx` — added the one missing line ("Knowie
  will show you a transcript first. You can change this later."); title,
  subtitle, and body copy already matched and were left untouched.

**Implemented for this pass — first-time path only:**
The whole sequence (checkpoint glow → mic-dot pulse → sheet auto-opens)
always plays on load. No persistence, no returning-user check, no local
storage was added for it, by design (matches the task's explicit scope).

**Future behavior — documented only, not implemented:**
- After the first onboarding, the microphone (Entry A, next to the Topic
  card) becomes the **permanent manual entry point** — the automatic
  attention-cue sequence should not replay on every visit once a learner
  has seen it once.
- Knowie may recommend Voice Recall again after future meaningful learning
  moments (not just the very first checkpoint), reusing the same contextual
  invitation.
- Future contextual invitations should reuse this same Entry layout
  (`KnowieInviteSheet` + attention cue), but with **lighter returning-user
  copy** ("Want to try that again?" style, not "You're doing great!"
  first-time framing) before entering Voice Recall directly.
- Returning learners should **skip onboarding** (`PermissionPrimer`)
  entirely and enter Voice Recall directly at `concept_idle` — this already
  works today via the existing `hasSeenPermissionPrimer` flag, but the new
  contextual invitation's own "has this been shown before" gating still
  needs to be built (a new persisted flag, analogous to
  `hasSeenEntryMicDot`) before it can honor "first-time only" across
  sessions rather than every page load.

---

## Session — 2026-07-09: Entry screen + PermissionPrimer pass

Scope was deliberately narrow: the Entry (Topic) screen and the first-time
`PermissionPrimer` only. Did not touch the recall composer, Type instead,
Furigana, summary, replay, send icon, recording flow/animations, or the
recall state machine. Full details in SPEC.md §16.

**What changed:**
- Entry screen (`app/page.tsx`): book icon + mic both tinted `purple-bold`;
  mic lost its filled circular button and is now a standalone icon; added a
  one-time purple discovery dot on the mic (`voiceRecall.hasSeenEntryMicDot`
  in `localStorage`, no glow/pulse); added a decorative checkpoint path
  (`components/CheckpointPath.tsx`, 3 nodes: "Writing Fundamentals" active,
  "Reading & Recognition" and "Practice & Review" upcoming) matching
  `reference/checkpoints.svg`; added a decorative bottom nav
  (`components/BottomNav.tsx`) matching `reference/navbar.svg`; removed the
  visible "Preview contextual entry" test link.
- Entry B (`KnowieInviteSheet`): unwired from the Topic screen (no longer
  imported there) but not deleted — kept for a possible future entry point.
- `PermissionPrimer.tsx`: visual-only polish. Fixed an invalid Tailwind class
  (`text-headline-m`, not a design.md scale) to `text-headline-s`; regrouped
  spacing per `reference/firstTimeIntro+Permission.svg`'s hierarchy. Copy and
  logic untouched.
- Added 4 new generic icon glyphs to `components/icons.tsx`
  (`ChecklistIcon`, `HomeIcon`, `SearchIcon`, `TargetIcon`, `ProfileIcon`) —
  same hand-authored stroke-icon system already used for `BookIcon` etc.,
  not new assets.
- `npm run build` passes. `npm run lint` has 4 pre-existing
  `react-hooks/set-state-in-effect` errors, one of which is now in
  `app/page.tsx` (the mic-dot mount effect) — this follows the exact same
  pattern already used in `RecallFlow.tsx`/`RecordingArea.tsx`/
  `TypeInsteadSheet.tsx` (reading a `localStorage` flag on mount), so it's
  consistent with existing project convention rather than a new regression.

**Known limitation:** the bottom nav is not viewport-sticky — on a 390×844
device the checkpoint path can make the screen taller than one viewport, and
the nav simply sits at the end of that scrollable content (matches at the
bottom when content is short, via `mt-auto`). Making it stick during scroll
would need `PhoneShell`'s height model changed from `min-h-dvh` to a bounded
height + internal scroll container, which is shared with the recall flow —
out of scope for this pass. Flagged for a future pass if real sticky
behavior is wanted.

---

# Session — 2026-07-08

Status snapshot at end of that session. Nothing further was changed after
this was written until the entry above. See SPEC.md §3 for the decisions
made along the way.

## What's built

- Next.js 16 + TypeScript + Tailwind v4 app, scaffolded manually (existing
  docs/assets prevented `create-next-app` from running in place).
- `app/globals.css` — all design.md tokens (color, spacing, radius, type
  scale) wired as Tailwind v4 theme vars. Includes the two recovered/derived
  values from today: `accent/purple/bold` (#8f7bdc, sampled from the
  reference screenshots) and the app background reusing `text/inverse`.
- `lib/motion.ts` — the four shared Motion presets (gentle/snappy/sheet/soft).
- `lib/concepts.ts` — the 4 fixed Japanese-writing-system concepts with
  deterministic outcomes, transcripts, headlines, coaching copy.
- Topic screen (`app/page.tsx`, Entry A) — book icon + mic, "Preview
  contextual entry" test-only link.
- Entry B — `KnowieInviteSheet` bottom sheet, reachable only via the test
  link, not from the organic flow.
- Full recall loop as one evolving screen — `components/recall/RecallFlow.tsx`
  orchestrates: permission primer → concept idle → recording (start / pause /
  resume / discard / send) → confirmation (Transcript / Headline / None, with
  the persisted purple discovery dot) → thinking → three-band coaching → retry
  or advance → repeats for all 4 concepts → Concept Evidence summary → back to
  Topic screen.
- Text fallback (`TypeInsteadSheet`, pre-filled with the canned transcript)
  and skip, both rejoining the same coaching path.
- `useReducedMotion()` support added for the two looping animations (Knowie's
  thinking bob, the recording pulse/waveform).

## Verified working today

Ran an automated Playwright walkthrough (390×844, dark mode) covering:
- Entry A → permission primer → Allow → concept idle
- Entry B → invitation sheet → both "Yes, let's try" and "Not now"
- Full record → pause → send → confirmation (Transcript) → thinking →
  coaching cycle
- Concept 1 (Hiragana) retry loop: Almost there → Try again → reminder shown
  → retry → Got it
- Concept 2 (Katakana) via **text fallback** → Got it first try
- Concept 3 (Furigana) → Let's build on that → **Skip for now**
- Concept 4 → Got it first try → **Concept Evidence summary**, correct
  evidence rows (3× "your own words", 1× "still practising")
- "Let's keep going" → back to Topic screen
- Confirmation mode = **None** → skips straight to thinking, no confirmation
  screen
- `localStorage` persistence across a reload: confirmation mode, discovery
  dot dismissal, permission primer not reappearing — all correct
- `npm run build` and `npx tsc --noEmit` both pass cleanly

Two real bugs were found via this walkthrough and fixed in the same session:
a bottom-row text-wrap layout bug, and an `AnimatePresence mode="wait"` timing
bug that was stacking extra latency onto the mocked "thinking" delay.

## Known issues / open items for tomorrow

1. **Coral vs. amber coaching tint** — I read the reference screenshots as
   coral → "Let's build on that" and amber/gold → "Almost there" (documented
   in SPEC.md §3). Worth a quick visual sign-off against the built screens,
   since this was inferred rather than confirmed directly.
2. **No PWA manifest / "Add to Home Screen" setup** — `prototype-rules.md`
   asks for a full-screen, no-browser-chrome experience. `app/layout.tsx` only
   sets `viewport-fit=cover` and `theme-color` today; there's no
   `manifest.json`, apple touch icon, or `display: standalone` config yet.
3. **Bottom sheet backdrop stays interactive during its exit animation**
   (~200–300ms window) — a very fast double-tap right as a sheet is
   dismissing could theoretically land on the wrong element. Not hit in
   testing, but not hardened either.
4. **`AnimatePresence` no longer uses `mode="wait"`** — stage transitions can
   briefly overlap in the DOM during the crossfade (this was the deliberate
   fix for the timing bug above). Confirmed harmless in headless testing, but
   not yet checked on lower-powered real hardware.
5. **Real-device testing not done** — everything so far was verified in
   headless Chromium at a fixed 390×844 viewport. Needs an actual phone pass
   (iOS Safari especially) before user testing, including the mic-permission
   primer copy/flow and touch-target feel.
6. **Accessibility contrast not formally audited** — token pairings follow
   design.md, but no automated contrast check has been run yet against the
   actual rendered text/background combinations (prototype-rules.md asks for
   4.5:1 body text / 3:1 large text).
7. **"Knowie" vs "Noe" naming** — still unconfirmed per sprint-context.md
   §20; built entirely as "Knowie."
8. **Dev server** was left running at `http://localhost:3000` for preview;
   it will need restarting (`npm run dev`) next session.
