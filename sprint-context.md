# Knowunity — Voice Recall

**Status:** Module 3 complete → Module 4 (Claude Code prototyping) underway.
The full recall loop, both entry points, and several visual-polish passes are
now built — see `PROGRESS.md` for the session-by-session build log and
`SPEC.md` for current implementation detail.

**Decision state:** Module 2 principles validated. Module 3 Task 1 (product
architecture) and Task 2 (key screen exploration) are both closed. This
document remains the reference file for Module 4 prototyping in Claude Code.

**Purpose:** Living product context for Module 4 prototyping.

---

## 1. Product Context

Voice Recall introduces spoken active recall into Knowunity's learning
experience.

Instead of recognising the correct answer from a list, students explain
concepts aloud in their own words. The goal is not to create an open AI
tutor or a general voice conversation. The goal is to help students prove
they can retrieve knowledge when they need it.

Voice Recall should feel like a natural learning interaction inside
Knowunity, not like leaving the product to enter a chatbot. Every
interaction should reinforce studying, not technology.

Knowie listens, identifies what came through, responds in text, and helps
students keep going when recall is incomplete. The experience should be
lightweight enough to fit inside an existing study session, but supportive
enough that hesitant students feel safe attempting it.

Framing that survived the whole sprint, useful as a north star for tone:
*"Not a new feature. A new role."* Today, Knowie answers and students
complete. With Voice Recall, Knowie asks and students retrieve — students
earn the celebration instead of just checking a box.

---

## 2. The Problem

Students often finish revising without knowing whether they can actually
retrieve what they just studied.

Recognition creates familiarity. Retrieval creates confidence.

Voice Recall exists to transform:
> "I think I know this."

into:

> "I know I can explain this."

The objective is not perfect wording. The objective is confident retrieval.

---

## 3. Product Position — COMMITTED (Module 3 Task 1)

Voice Recall lives inside the existing Exam Plan through **two entry points
that share the same recall loop underneath**:

- **Persistent Topic-level entry point.** The mic lives next to the **book /
  topic-summary icon**, so Helena can practise recall whenever she wants to
  return to a Topic. This entry point is always available while she is working
  through the Topic; it is not gated behind completing all 3 checkpoints.
- **Contextual Knowie invitation.** Knowie can gently suggest Voice Recall
  when the existing Knowunity learning flow indicates that Helena is struggling
  with a checkpoint or concept — for example after repeated recovery through
  **Fix Mistakes**, or when the product's own checkpoint state signals that
  something needs another attempt. This invitation should feel like a helpful
  push, not pressure: Helena can accept it, defer it, or return later through
  the Topic mic.

The important product decision is not A vs. B vs. C as separate destinations.
It is: **one Voice Recall loop, reached either by student choice from the Topic
or by a timely Knowie suggestion based on existing learning signals.**

This keeps Voice Recall native to Knowunity instead of becoming a separate AI
chat or open tutor. It supports discoverability without forcing Helena into a
voice moment when context, confidence, or timing makes speaking difficult.

### Where the persistent entry point lives

The mic icon sits next to the **book icon** — the one that summarises the
Topic's study material across its checkpoints. This means Helena can reach
Voice Recall **before, during, or after** working through the Topic, depending
on when she wants to practise. The mic follows the Topic structure, not an
individual question.

### Contextual suggestion trigger — DOCUMENTED ASSUMPTION, not a locked rule

The prototype should not invent a trigger algorithm. Do **not** hardcode
mistake-percentage thresholds or depend on a fixed number of questions per
checkpoint.

Instead, treat the invitation as conceptually relying on Knowunity's existing
learning signals: checkpoint state, repeated mistakes, recovery through Fix
Mistakes, or other product signals that already show a student may need another
attempt. The prototype only needs to make the invitation plausible; it does not
need to define or simulate the real detection logic.

---

## 4-5. Design Target

We are not designing for demographic personas. We are designing for two
learning situations, named Helena (primary) and Caroline (validation) in
Module 3 screens.

### Primary — Helena (situation-constrained / confidence-losing student)

Often knows more than she believes, but confidence, context, or trust
breaks the retrieval moment: studying on a bus, in a shared room, tired,
interrupted, embarrassed hearing herself speak, unsure whether the AI
understood her, starting to explain then freezing halfway through.

### Validation case — Caroline (voice-comfortable self-tester)

Actively wants retrieval, comfortable speaking, motivated by challenge and
honest feedback. Frustrated by anything that feels slow, patronising, or
inaccurate.

If Voice Recall works for Helena without slowing Caroline down, it scales
to both.

---

## 6. Learning Philosophy

### Explain, don't recite

> Students build confidence by explaining ideas in their own words.

Mastery is not memorising exact wording — it's organising understanding
into a coherent explanation. The "tiger story" metaphor: real understanding
lets you move through an idea with a thread, not just repeat a memorised
sentence.

Hesitation, reformulation, thinking aloud — these are part of learning, not
failure states. The system evaluates understanding, not polish.

---

## 7. Coach Philosophy

Knowie is not an examiner, not an open-ended tutor. Knowie is a learning
coach.

> The best teachers don't answer first. They ask first.

Knowie should invite gently, make the task feel achievable, acknowledge
effort, separate incomplete recall from failure, offer hints without giving
the answer away, encourage another attempt, celebrate without over-scoring.

Knowie should never sound like a grader, make mistakes feel final, turn
every answer into a long explanation, replace the student's own recall with
generated content, or add friction before the student can start.

The student should leave every interaction feeling more capable than when
they started. **This is why certain Knowie expressions (`overIt`, `angry`,
`sad`) are deliberately excluded from the recall loop in `design.md` — they
read as judgment, which this philosophy explicitly rules out.**

---

## 8. Jobs To Be Done

Reduced from 5 to 3 moments during Module 2 review — the three that capture
the highest-stakes design decisions:

1. **Starting recall** — "When I've just revised a topic, help me find out
   whether I actually understand it."
2. **Getting stuck** — "When I freeze or go blank mid-explanation, help me
   keep going instead of feeling like I failed."
3. **Finishing** — "When I complete a recall attempt, help me feel that the
   progress is real, not just checked off."

---

## 9. Retrieval Barriers

Students rarely stop because they've run out of knowledge — they stop
because retrieval is interrupted: confidence loss, public context,
hesitation, embarrassment, interruption, uncertainty about what the AI
heard, feeling judged, lack of recovery.

The strongest product opportunity isn't making students talk. It's helping
them keep explaining when they almost stop.

---

## 10. Design Principles

- **Retrieval over recognition.**
- **Explain, don't recite.**
- **Trust before coaching** — feedback only works once students believe
  they were understood.
- **Voice-first**, with a text floor that has **equal dignity**, never a
  lesser door — context makes voice impossible for many students at many
  moments (this came directly from hidden student research, not assumption).
- **Never trap the student.**
- **Native, not separate.**
- **Progress over perfection.**
- **Generous coaching** — identifies understanding, not speech-recognition
  accuracy. Strictness is the failure mode: a false "wrong" demoralises and
  ends retrieval (validated against a competitor, ELSA).
- **Feedback adapts to evidence, not subject** — it isn't the subject that
  changes the feedback, it's what genuine understanding looks like within
  it.

---

## 11-12. Trust Strategy & Progressive Trust

Trust develops progressively, and the transcript is the mechanism, not the
product. The key question before coaching begins is:

**Did Knowie hear enough of what I meant for the feedback to feel fair?**

This is not a separate editing flow and not a chat. It is a lightweight
pre-feedback confirmation layer that lets Helena choose how much evidence she
wants to see before accepting Knowie's coaching.

Three confirmation modes, from most to least support. This is a **free
choice, not an unlock system** — Helena can switch between the three modes
at any time. The product never removes options; confidence grows because
Helena chooses she no longer needs additional confirmation, not because the
system takes support away:

| Mode | What the student sees before feedback | When it helps |
|---|---|---|
| Transcript (default early) | Full text of what Knowie heard | Early sessions, hesitant students, or when trust is low |
| Headline | One-line summary: "You explained..." | Growing confidence, without reading the whole transcript |
| None | No confirmation layer before coaching; Knowie goes directly from Send → Thinking → Coaching | Confident students or moments where fluency matters more than reassurance |

**No transcript editing in V1.** The transcript is a confirmation layer, not an editing step. It shows what Knowie heard before coaching so Helena can decide whether she trusts the feedback. It should not become a way to rewrite or polish the answer before feedback. The first explanation, even imperfect, is the learning signal worth protecting.

### Stable interaction

From the first recall concept until the Concept Evidence screen, Helena should feel like she is staying in the same experience.

Knowie remains in a fixed position, the concept stays visible, and the recording area keeps the same layout whenever recording is available.

Rather than navigating through different screens, the interface updates its content over time (recording → confirmation → thinking → coaching → reminder → retry, when needed).

This creates the feeling of a native mobile interaction instead of a sequence of separate pages.

### Confirmation control — exact behaviour (locked, so Claude Code doesn't improvise)

- **Default mode: Transcript**, selected automatically on first use.
- The confirmation control (mode selector) is shown **near the microphone**
  on the Concept prompt / Idle screen — it belongs to the speaking moment,
  not somewhere else on the screen.
- On Helena's **first** time seeing the control, show a small **purple dot**
  as a discovery cue for a new option — not a persistent notification.
- The purple dot **disappears permanently** the first time Helena **opens**
  the selector, whether or not she changes the mode.
- Whatever mode Helena picks (Transcript / Headline / None) is **remembered**
  as her default for **future Voice Recall sessions** — she is never asked
  to choose again from scratch each concept or each session.
- She can still open the selector and change her preference at any time;
  free choice, not an unlock system (see above).

---


## 13. Recording Control Strategy

```
Tap / hold to speak → Recording → Pause / Resume if needed →
Discard if needed → Release / send → Confirmation layer (per Progressive
Trust mode) → Knowie thinking → Coach response
```

Pause/Resume mirrors familiar mobile voice patterns (WhatsApp-style) without
copying literally. Discard means "start again," not editing — supports
"never trap the student." No editing after the transcript appears: students
control *participation*, not the evidence of their first recall.

---

## 14. Can't-Speak Strategy

Text fallback has **equal dignity**, not lesser status — this was corrected
during Module 3 after review flagged an earlier draft implying a
co-equal-but-secondary hierarchy. Same prompt, same coaching quality bar,
same feedback tone, same recovery logic. Available in one tap, on every
recall screen, without repeating the mic-permission primer.

---

## 15. Permission Strategy

Mic permission requested only on intentional first mic interaction, with a
lightweight primer before the OS prompt: *"You are about to use Voice
Recall. We need mic access so you can explain the term out loud."* No repeat
after granted. If denied, text fallback is immediately available.

---

## 16. The Three-Band Coaching Response

Every recall attempt resolves to one of three internal coaching bands — **Got it /
Almost there / Let's build on that** — modeled on the Cambridge FCE coaching parallel: affirm what
came through, signal what's missing, never give the full answer unprompted.

These labels are internal only. They should never appear as student-facing labels. Knowie identifies what Helena has understood and gives a supportive next step. The product tone stays coach-like: useful, honest, and non-punitive.

For the Module 4 prototype, this intelligence is mocked. The real product may
later use LLM reasoning and Knowunity's existing learning signals to identify
where a student needs help, but the prototype should not attempt to build that
logic.

---

## 17. Constraints

- Voice is the primary interaction; text is an equal-dignity fallback.
- Experience stays inside Knowunity's Exam Plan.
- Knowie responds in text, not voice, for V1.
- Transcript editing is not part of V1.
- Recording controls include pause, resume, discard/cancel, and send.
- Mic permission requested only after intentional mic interaction.
- Prototype includes only enough Exam Plan context to make the recall
  interaction understandable — not the full Exam Plan or checkpoint experience.
- The flow includes realistic states, not just the happy path.

---

## 18. Success Metrics

Activation, completion, recovery, felt mastery, reduced dependence on
reassurance (Transcript → Headline → None), natural
explanation over recitation, and trust that Knowie understood well enough
for feedback to feel fair. North star: **felt mastery, single session** —
not activation, not completion — because the reason this feature exists is
the retrieval rep being real.

---

## 19. Prototype Scope

Only enough surrounding context for Voice Recall to feel native — not the
full Exam Plan or checkpoint UI. Focus: entry → first-time mic permission →
recording states → confirmation/trust moment → Knowie thinking → coach
response → recovery after incomplete recall → text fallback → finish/
continuation that points forward (repeat missed terms, come back later —
not a dead-end "you're ready" screen).

---

## 20. Open Questions — remaining going into Module 4

Most architectural decisions from Module 3 are now committed. The remaining
open questions are mostly interaction and prototyping details:

- **Exact contextual invitation moment** — the direction is committed: Knowie
  may invite Helena when the existing learning flow indicates struggle. The
  exact moment (after Fix Mistakes, when a checkpoint changes state, or another
  existing product signal) should be treated as a prototype assumption, not a
  hardcoded product rule.
- **How much surrounding Exam Plan context to show** — include only enough
  Topic / Checkpoint context for the Voice Recall entry to make sense. Do not
  recreate the full Exam Plan.
- **Knowie vs. "Noe" naming** — flagged in an earlier pass as needing
  verification before touching it; treat as unconfirmed, don't assume either
  name going into the prototype.

---

## 21. Working Concept Statement

Voice Recall helps students transform recognition into retrieval by
encouraging them to explain concepts in their own words inside the existing
Exam Plan. Rather than rewarding perfect definitions, Knowie supports
students through hesitation, confidence loss, and incomplete recall until
they discover what they actually know.

---

## 22. Current Direction — COMMITTED

See §3. One shared recall loop with two ways in: a persistent Topic-level
mic next to the book / summary icon, and a contextual Knowie invitation when
the existing learning flow indicates that Helena is struggling and could
benefit from a Voice Recall rep.

---

## 23. Concept Statement (Module 3 Task 1 format)

> My recall step helps students prove they can explain a concept in their
> own words by giving them a voice-practice option inside the Topic flow —
> either from the mic next to the Topic summary or through a timely Knowie
> suggestion when the learning flow shows they are struggling — which makes
> progress feel like *earned* mastery instead of a checked-off task.

*(Reconstructed from the sprint's rationale material — reread this against
whatever exact wording was finalized on the Notion board, and adjust if it
drifted.)*

---

## 24. Committed Direction — full rationale

**Where does Voice Recall live?** Inside the existing Exam Plan / Topic flow,
not as a separate chatbot. It has a persistent Topic-level entry point and a
contextual Knowie invitation. Both lead to the same recall loop.

**How does the student enter it?** Either deliberately, by tapping the mic next
to the Topic book / summary icon, or through a gentle Knowie suggestion when
the existing learning flow signals that she is struggling with a concept or
checkpoint. Helena can defer the suggestion and return later.

**Why this over the alternatives?** A purely optional destination respects
student agency but can suffer from discoverability. A purely forced in-path
step risks pressuring Helena into voice at the wrong moment. The chosen
direction keeps agency while still letting Knowie surface Voice Recall when it
would genuinely help.

**What does this direction intentionally leave out?** A separate open-ended AI
tutor, a new chat product, or a hardcoded trigger algorithm. The contextual
suggestion should conceptually reuse Knowunity's existing learning signals
instead of inventing new scoring rules for the prototype.

---

## 25. Core User Flow

The entry context can vary, but the recall loop underneath stays the same.
Module 4 Task 1 should design this full path from entry to exit, including the
small transition states that make it feel like a real mobile app.

```
Entry context
  → Helena taps the mic next to the Topic book / summary icon
    OR Knowie gently invites her after the existing learning flow signals
    struggle with a concept or checkpoint
  → If first mic use: lightweight mic-permission primer
  → Recall prompt: Knowie asks Helena to explain the concept in her own words
  → Recording state: tap / hold, pause, resume, discard available
  → Send / confirmation layer: Transcript / Headline / None
    according to the Progressive Trust mode (§12)
  → Knowie thinking / processing state
  → Three-band coaching response: Got it / Almost there / Let’s build on that
  → If Almost there or Let’s build on that: hint / retry path, never a dead end
  → Text fallback available from the recall screens in one tap and able to
    complete the same loop end to end
  → Finish: summary that points forward — repeat missed terms, come back
    later, or continue studying — not a static "you're ready" screen
```

For the prototype, build enough surrounding Topic / Checkpoint context for the
entry to make sense, but do not recreate the whole Exam Plan.

---

## 26. Design Tensions

- Voice-first vs. equal-dignity text fallback.
- Immediate reassurance (transcript) vs. conversational fluency (less
  transcript over time).
- Student control (pause/discard) vs. added interface friction.
- Honest feedback (three-band coaching response) vs. emotional safety
  (generous coaching, never sounding like a grader).
- Native integration (inside Exam Plan) vs. feature visibility (students
  need to discover the Topic mic exists).
- Spontaneous recall vs. answer refinement (resolved: no transcript editing in V1).
- Contextual Knowie invitation vs. topic-level opt-in — resolved as two
  entry points into the same recall loop (§3).

---

## 27. Key Screens (Module 3 Task 2 — closed)

Delivered as a single grouped exploration (`module3-task2-screens.html`),
organized by moment rather than as separate files:

1. **Entry** — both doors (persistent Topic mic / contextual Knowie
   invitation), first encounter with mic permission.
2. **Recall moment** — recording states.
3. **Confirmation / Trust Layer** — simplified from an original 8-screen,
   3-full-sequence exploration down to **3 screens, one per confidence
   level** (matching the Transcript/Headline/None logic in §12).
   The Topic icon was also simplified from a literal replica to a generic
   "lesson" icon — the design point that matters is "the mic lives next to
   the node," not glyph precision.
4. **Coach Response** — 6 screens, 3 behaviours (Got it / Almost there / Let's build on that),
   left at this scope since it wasn't flagged as over-designed. These are internal behaviours, not labels shown to the student.
5. **Progress / Finish** — session summary that points forward.

---

## Source documents

- `Design Brief` (Notion) — official problem statement, hypothesis,
  goals/success criteria, functional requirements (F1-F10, especially
  **F5**, which named the two placement arms independently confirmed here),
  non-goals v1, open questions from Harry.
- `Voice UX Reference` (Notion) — six voice UX principles, states-to-design
  checklist, sourced from NN/g research.
- `design.md` — real design tokens + Knowie expression mapping, extracted
  from Figma via MCP for Module 4.
- `Helena's Trust Journey` (HTML) — editorial bridge, Module 2 → 3, trust
  relationship only.
- `Designing for Helena` (HTML) — persona document, world/context/JTBD,
  Caroline as validation.
- Module 2 Notion — Task 1 (Experience Audit, Teaching Notes, Tiger
  Principle, Research Appendix), Task 2 (User Profiles + JTBD, Why One
  Learner, From Needs to Features, Design Target & Validation Case), Task 3
  (North Star/Scan/Brainstorm, Ideas We Didn't Ship, Design Decisions Log,
  The Feedback Opportunity, References).
- Module 3 — Task 1 (`module3-task1-flows.html`, product architecture,
  Direction A/B/C comparison), Task 2 (`module3-task2-screens.html`, key
  screens).

## Notes for Claude Review

When reviewing this document, do not redesign the product. Please only
flag: contradictions with the official Design Brief; assumptions that are
unsupported; missing constraints that would affect Module 4; places where
implementation assumptions should be separated more clearly from product
decisions; wording that may create confusion for prototyping.

Preserve the product philosophy and direction unless they directly conflict
with the Design Brief.
