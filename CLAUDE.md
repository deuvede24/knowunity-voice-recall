# CLAUDE.md — Knowunity Voice Recall Prototype

## Project
- Building: a mobile clickable prototype of **Voice Recall**, a voice active-recall step inside Knowunity's Exam Plan / Topic flow.
- For: students around 14–18 revising on their phone, especially hesitant students like Helena who may know the material but lose confidence when asked to explain it out loud.
- Committed concept: Voice Recall helps students prove they can explain a concept in their own words by giving them a voice-practice option inside the Topic flow — either from the mic next to the Topic summary/book icon or through a timely Knowie suggestion when the existing learning flow shows they are struggling.
- Platform: mobile only, 390px wide, dark mode only.

## Source of Truth

Always consult documentation in this order:

1. design.md
2. prototype-rules.md
3. motion-guide.md
4. SPEC.md
5. reference/
6. public/images/

If documentation exists, follow it instead of inventing new UI.

## This is a test prototype, not working AI
- Mock the recall intelligence. Use fixed example concepts, canned transcripts/headlines, canned coaching responses and deterministic outcomes.
- Never build real speech-to-text, real audio capture, real LLM calls, text-to-speech, or audio playback.
- Knowie replies in **text only**.
- The prototype should feel real enough for user testing, but it is not production code.

## Stack & tools
- Use the stack already scaffolded in the project. Prefer Next.js / React + TypeScript + Tailwind if starting fresh.
- Animations: Motion (`motion/react`); see `motion-guide.md`.
- Style only from `design.md` tokens and existing Knowunity patterns. Never invent raw hex, typography, spacing, radius or new visual systems.
- Use images only from `public/images/`. No placeholder URLs.

## Assets

Always reuse existing Knowunity assets.

Check `/public/images/` before recreating icons or mascot illustrations.

Reference screenshots are for layout and interaction only.

## Commands
- Install: `npm install`
- Dev preview: `npm run dev` (starts on `http://localhost:3000`, falls back to the next free port if it's taken)
- Build/typecheck gate: `npm run build`
- Lint: `npm run lint`
- Always start a local preview so the flow can be tested on a phone-sized viewport.
- Run the available check/build command before considering a task done.

## Always
- Read `sprint-context.md`, `design.md`, `prototype-rules.md`, and `motion-guide.md` before building screens.
- Reuse existing Knowunity patterns from `design.md` and `reference/` before inventing a new layout.
- Keep Voice Recall native to the existing Exam Plan / Topic flow; do not turn it into a separate chatbot.
- Preserve the two entry points: persistent Topic mic next to the book/summary icon, plus optional Knowie invitation when the existing learning flow signals struggle. (As of this pass, the Knowie-invitation entry point — `KnowieInviteSheet` — is implemented but not wired to any visible control; see SPEC.md §8/§16. Keep the component intact for a future trigger rather than deleting it.)
- Build the full recall loop: entry → first-time mic permission → concept prompt → recording controls → pre-feedback confirmation → Knowie thinking → coaching response → retry/skip/next concept → summary.
- Keep the can't-speak text fallback reachable in one tap and able to complete the same loop end to end.
- Keep voice and text equal in dignity: same prompt, same mocked processing, same coaching quality, same recovery logic.
- Use Progressive Trust exactly as documented: **Transcript / Headline / None**. No Keywords mode.
- Show Transcript / Headline / None **before** coaching feedback, because trust comes before coaching.
- Confirmation control behaviour is locked, don't improvise it: default is **Transcript**; the control sits near the mic on the Concept prompt/Idle screen; show a purple discovery dot on first sight that disappears permanently once Helena opens the selector (change not required); her chosen mode is remembered as the default for all future sessions.
- Treat Transcript as confirmation only. It is not a rewrite/editing flow.
- Use internal coaching states only: **Got it / Almost there / Let's build on that**. Student-facing copy must be encouraging and coach-like.
- Make the summary point forward with concept evidence, skipped terms and next steps; do not make it only a score.

## Never
- Never build real STT, real AI, real audio recording, text-to-speech, or audio playback.
- Never add transcript editing, answer rewriting, or chat-style back-and-forth.
- Never use Keywords as a confirmation mode.
- Never show student-facing labels such as “Partial”, “Off”, “wrong”, “failed” or “incorrect”.
- Never make Voice Recall mandatory or forced. Knowie can suggest; Helena chooses.
- Never hardcode trigger algorithms, mistake percentages, or fixed checkpoint question counts.
- Never recreate the full Knowunity app, full Exam Plan, or a full *interactive* checkpoint experience (real checkpoint state, tap-through, mistake tracking). Include only enough context for Voice Recall to feel native — this does allow a decorative, non-interactive checkpoint path on the Entry screen (visual context only; see SPEC.md §16), just not a functional one.
- Never use Knowie expressions that read as judgment (`overIt`, `angry`, `sad`).
- Never add dependencies or refactor unrelated code without asking.

## Where things live
- Product context: `sprint-context.md`
- Design system and real Knowunity patterns: `design.md`
- Build spec, once created: `SPEC.md`
- Prototype behaviour rules: `prototype-rules.md`
- Motion recipes: `motion-guide.md`
- Reference screenshots: `reference/`
- Images / Knowie assets: `public/images/`

## Wireflow

The HTML wireflow is a blueprint.

Use it to understand:

- screen order
- interaction flow
- component hierarchy

Do not reproduce its styling literally.

Always rebuild the UI using the real Knowunity Design System defined in `design.md`.

Treat the HTML as a behavioural blueprint, not as production UI..

## Working style

Prefer updating existing components over creating new ones.

Keep layouts stable.

Update content instead of rebuilding screens.

If multiple screens share the same structure, reuse components.

The prototype should feel like a native mobile app whose content evolves over time, not like a sequence of disconnected pages.

## Definition of done
- The prototype matches the committed flow from `sprint-context.md` and the reference screens from Task 1.
- Mobile dark-mode experience works at 390px width.
- Core voice loop is tappable and legible.
- Recording controls exist: start, pause, resume, discard/cancel, send.
- Text fallback works end to end and reaches the same coaching flow.
- Transcript / Headline / None behave as pre-feedback confirmation modes.
- Knowie thinking is mocked with a short 1–1.5s processing state.
- Coaching responses feel supportive, not judgmental.
- Summary shows concept evidence and points to a next step.
- Build/check passes and the app is ready to deploy to Vercel.

## Good to know
- Claude tends to overcomplicate flows. Keep outputs simple, focused and buildable.
- The product opportunity is not “make students talk”; it is helping them keep explaining when they almost stop.
- The design principle to protect: **Trust before coaching.** Helena decides how much confirmation she needs before accepting feedback.
