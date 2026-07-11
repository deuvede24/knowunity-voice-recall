---
name: build-screen
description: Builds one screen from SPEC.md and verifies it against its reference image and design.md. Use when building or rebuilding a screen.
---
When I name a screen to build:
1. Read SPEC.md (the screen and the states it needs), design.md (tokens + patterns), and the matching image in reference/.
2. Build that ONE screen with every state SPEC.md lists for it. Use only tokens from design.md, never raw hex. Dark mode. Reuse a Knowunity pattern before inventing one.
3. Screenshot the result and compare it to the reference image. List every difference (layout, spacing, color, type, missing state) and fix them. Repeat until it matches.
4. Keep the can't-speak text fallback reachable in one tap on every recall screen.
5. Do NOT touch any screen or style I did not name.
Show me the before/after screenshots when you are done.
