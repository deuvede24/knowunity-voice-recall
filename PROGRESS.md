# PROGRESS.md — Session Notes

Status snapshots, most recent first. See SPEC.md for the full build spec.

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
