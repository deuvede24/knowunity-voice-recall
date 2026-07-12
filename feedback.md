# Module 5 — User Testing Documentation
## Knowunity × Yummy Labs — Voice Recall Prototype

---

## 1. Testing Overview

| Item | Details |
|---|---|
| Prototype | Spoken Active Recall |
| Platform | Mobile web prototype tested on real phones; home-screen installation included where possible |
| Test type | Moderated usability testing |
| Sessions | 5 |
| Goal | Validate whether students understand the voice recall flow, feel confident speaking, and complete a recall session naturally. |

---

## 2. Test Script

### Introduction

Explain to participants:
- This is an early prototype.
- We're testing the product, not you.
- Please think aloud.
- There are no right or wrong answers.

### Tasks

| Task | Success Criteria |
|---|---|
| Start a voice recall session | User discovers entry point naturally |
| Record an explanation | User understands recording state |
| Review transcript/headline | User understands confirmation |
| Continue | User understands AI feedback |
| Finish session | User reaches summary |

### Follow-up Questions

- What felt most natural?
- What felt confusing?
- At what moment did you hesitate?
- Did you ever wonder what would happen next?
- Would you use this to study?

---

## 3. Participant Profile and Cross-session Patterns

| Tester | Profile |
|---|---|
| Tester 1 | Target-age student |
| Tester 2 | Target-age student |
| Tester 3 | Participant less comfortable speaking aloud |
| Tester 4 | Participant familiar with study apps |
| Tester 5 | General usability participant |

**Observed patterns across sessions:**

- All testers completed the recall flow independently after the entry step.
- All testers noticed the confirmation selector, helped by the temporary discovery dot, but some needed time to understand what Transcript, Headline and None changed and that Transcript was the default.
- 5/5 appreciated having control over the confirmation shown before feedback.
- 3/5 hesitated briefly on the Send button during recording.
- One tester noted that Knowie felt somewhat passive/quiet during the session.
- 2/5 explicitly appreciated the option to switch to a lighter confirmation mode once they trusted Knowie's understanding.
- 5/5 completed the full session.

---

## 4. Synthesis of Findings

### ✅ Worked well

| Finding | Evidence |
|---|---|
| Knowie was immediately perceived as friendly and encouraging | All testers reacted positively to Knowie |
| Transcript confirmation increased confidence that Knowie had understood them correctly | Testers liked checking what was understood before continuing |
| Giving users control over confirmation experiences was appreciated | Several testers liked choosing how much reassurance they wanted |
| Nobody missed seeing skipped questions in the summary | The simplified summary felt cleaner and more motivating |
| Once inside the recall experience, the interaction itself felt natural | All testers completed it after understanding how to start it |
| Summary genuinely reflected each tester's choices | Everyone appreciated that the summary changed depending on what they selected, instead of being generic |
| Skipping didn't feel punishing | Testers who skipped everything got a friendly closing message instead of a guilt-tripping one: "Nothing saved yet. Nothing was saved this time. You can always come back and give it another try." |

### ⚠️ Confusing / Opportunity

| Finding | Evidence | Outcome |
|---|---|---|
| Entry B invitation sounded like it assumed a returning user | First-time testers weren't sure why Knowie was already inviting them to record | Rewritten in v2 — Entry B was kept as the entry point; the copy now clearly introduces the feature for first-time users before the mic permission primer |
| Knowie felt friendly but initially too passive | One tester noted limited interaction during the session | Fixed in v2 — added progress messages, encouragement, responsive chat bubbles and positive state changes, while avoiding any negative reactions |
| Confirmation selector required time to understand | All testers noticed the selector, helped by the temporary discovery dot, but some needed time to grasp what each option (Transcript / Headline / None) changed, and that Transcript was the starting default | Improved in v2 — copy simplified, Transcript-as-default now stated directly on the mic permission page |
| Too much text to read in the first version | Users tended to skim long explanations | Copy simplified across the flow |
| Recording controls felt too small | Some users hesitated before pressing them | Fixed in v2 — touch targets and button sizes increased |
| Mobile viewport and keyboard layout issues | Real device testing broke layout that desktop testing missed | Fixed in v2 — layout stabilized |
| SEND button during recording wasn't immediately obvious | Hesitation observed in 3/5 sessions | Pending — remains the top open priority |

### 👀 Things users didn't notice

- Small visual polish and decorative details
- Some micro-animations

---

## 5. Quotes

| Quote | Context / Insight |
|---|---|
| "Ahh, it's here!!!" | Said upon finally finding the entry point — reflects the friction in the original Entry B copy, before it was rewritten for first-time users |
| "It feels really smooth, I like that." | Reaction to the recall flow once inside it |
| "It feels really smooth, but even though I know it's listening to me through the transcript, a bit more interaction from it would be nice." | The comment that led directly to adding progress messages and responsive chat bubbles for Knowie |

**Observed comments** (paraphrased, not verbatim):

- Several testers described the recording controls as looking small.
- One tester noticed the mic control was doing something during recording but couldn't identify exactly what it was — there was a button whose function wasn't immediately clear.

---

## 6. Prioritization

### Resolved in v2

| Change | Why it mattered |
|---|---|
| Entry B copy rewritten for first-time users | Root cause of the biggest early confusion |
| Knowie made more interactive (progress messages, bubbles, no negative reactions) | Addressed the "too passive" feedback |
| Recording controls enlarged | Directly affects task completion and confidence on real phones |
| Mobile viewport / keyboard layout fixed | Was breaking the recording experience on real devices |
| Transcript-as-default stated on the mic permission page | Reduced time needed to understand the selector |
| CTAs and buttons rebuilt with the Design System | Consistency and clarity across screens |

### Remaining priorities

| Priority | Change | Why |
|---|---|---|
| **Must Fix** | Make the recording / Send interaction unmistakable on real phones | 3/5 testers hesitated at this exact point |
| **Nice to Have** | Increase the visual prominence of the Replay control | The control worked as expected but was visually secondary during the recording flow |
| **Nice to Have** | Keep refining confirmation-selector copy | Reduce time-to-understand even further |

### Not prioritized

| Item | Why |
|---|---|
| Minor animation timing | Not noticed by testers |
| Decorative visual details | Not noticed by testers |

---

## 7. What Changed After Testing

- Entry B invitation rewritten for first-time users: the original version sounded as though the student had already used Voice Recall before; the new version introduces the feature more clearly before the mic permission primer. Entry B itself was kept, not replaced.
- Real mobile testing revealed touch and layout issues that desktop testing hadn't surfaced.
- Fixed mobile viewport and keyboard layout issues that were breaking the recording experience on real devices.
- Native keyboard behavior refined; composer stabilized to prevent layout shift.
- Recording controls simplified and enlarged.
- Confirmation UI improved to appear clearly before AI "thinking" state.
- CTA repositioned toward the bottom of the screen for thumb reach.
- All CTAs and buttons enlarged and rebuilt using Knowunity's Design System components.
- Knowie's coaching made more interactive: added progress messages ("2 more to go"), celebratory animations on success, responsive chat bubbles for presence, and removed any discouraging ("sad") reactions to keep tone supportive at all times.
- Transcript kept as the default for first-time users, with Headline/None available once confidence increases — validating the **Progressive Trust** approach.

### Note on Confirmation Preferences

All testers noticed the confirmation selector — the temporary discovery dot helped surface it. What took time, for some testers, was understanding what each option (Transcript, Headline, None) actually changed, and that Transcript was the starting default. This is why Transcript-as-default is now stated directly on the mic permission page, before users reach the selector itself.

Two testers explicitly appreciated the option to switch to a lighter confirmation mode once they'd verified that Knowie understood them correctly — this validates the Progressive Trust direction that came out of concept development.

---

## 8. Reflection

**What surprised you most from testing?**
The biggest surprise wasn't whether students wanted transcripts — it was that they wanted *control*. Instead of one fixed experience, testers appreciated being able to gradually reduce reassurance as their confidence increased. This validated the Progressive Trust approach much more strongly than expected.

**What did users not even notice?**
Removing the skipped-questions view from the summary went completely unnoticed — nobody asked for it back, which confirmed the simpler summary was the right call. Micro-animations and decorative visual polish also got little to no attention, reinforcing that clarity of interaction mattered far more than visual detail.

**What's the single most important thing you need to fix before moving forward?**
The next priority is making the recording and Send interaction unmistakable on real phones. Three testers hesitated at this exact point, so it remains the most important interaction to refine before moving forward — especially now that the Entry B rewrite has addressed the earlier point of confusion.

---

*Voice Recall Sprint · Knowunity × Yummy Labs*
