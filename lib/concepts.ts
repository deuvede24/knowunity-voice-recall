import type { Concept } from "./types";

// Fixed, deterministic mocked content — SPEC.md §9. Same outcome every run,
// regardless of voice or text-fallback path (equal dignity).
export const CONCEPTS: Concept[] = [
  {
    id: "hiragana",
    term: "Hiragana",
    transcript:
      "You use hiragana for native Japanese words and grammar bits, like verb endings and particles.",
    headline: "Hiragana used for native words and grammar.",
    firstAttemptBand: "almostThere",
    firstAttemptExpression: "thinking",
    firstAttemptCopy: {
      title: "Almost there,you're really close.",
      body: "You already explained that hiragana is used for native words. Now think about when you'd actually use it.",
    },
    retry: {
      band: "gotIt",
      expression: "approving",
      copy: {
        title: "Nice!",
        body: "You connected hiragana to grammar and verb endings, not just the name.",
      },
      reminder: "Reminder: Try connecting hiragana to grammar, particles, or verb endings.",
    },
    demoResolution: "retryThenGotIt",
  },
  {
    id: "katakana",
    term: "Katakana",
    transcript:
      "Katakana is for foreign words, loanwords, and sometimes for emphasis, like English words borrowed into Japanese.",
    headline: "Katakana used for foreign and loanwords.",
    firstAttemptBand: "gotIt",
    firstAttemptExpression: "giggling",
    firstAttemptCopy: {
      title: "Exactly.",
      body: "You identified katakana's role for loanwords and emphasis.",
    },
    demoResolution: "gotItFirstTry",
  },
  {
    id: "furigana",
    term: "Furigana",
    transcript:
      "Furigana are the little characters above kanji... I think they help you read it? I'm not totally sure why they're needed though.",
    headline: "Furigana helps with reading kanji.",
    firstAttemptBand: "letsBuildOnThat",
    firstAttemptExpression: "dazed",
    firstAttemptCopy: {
      title: "Good start.",
      body: "You spotted part of the idea. Now focus on why furigana matters even when you already know the kanji.",
    },
    retry: {
      band: "gotIt",
      expression: "approving",
      copy: {
        title: "You nailed it!",
        body: "You connected furigana to helping people read unfamiliar kanji.",
      },
      reminder: "Reminder:Think about the problem furigana solves for readers.",
    },
    demoResolution: "retryThenGotIt",
  },
  {
    id: "three-writing-systems",
    term: "Why three writing systems?",
    transcript:
      "Japanese uses all three together in one sentence — hiragana for grammar, katakana for foreign words, and kanji for meaning, so it's kind of a mix depending on the word.",
    headline: "The three systems work together in one sentence.",
    firstAttemptBand: "gotIt",
    firstAttemptExpression: "approving",
    firstAttemptCopy: {
      title: "Exactly.",
      body: "You explained how the three systems divide the work instead of overlapping.",
    },
    demoResolution: "gotItFirstTry",
  },
];
