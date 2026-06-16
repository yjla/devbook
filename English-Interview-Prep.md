# English Interview Prep — Yijiang Lu (陆钇江)

> Frontend / Agent Engineer · 4 years at Trip.com (Ctrip)
> Owner of Trip.com airport-transfer post-order & the car-business cross-platform base library

---

## 0. How to use this doc

Four sections, in interview order:

1. **Self-Introduction** — a 60–90s spoken opener.
2. **Project Introduction** — the three flagship projects, each with a 30s "elevator" version and a 2-min "deep" version.
3. **Extension Questions** — the technical follow-ups an interviewer is likely to dig into, with answers.
4. **Impromptu Q&A** — behavioral / HR / open-ended questions.

> Tip: speak in **STAR** form for behavioral answers (Situation → Task → Action → Result) and always **land on a number** for project answers.

---

## 1. Self-Introduction (自我介绍)

### Short version (~45s)

> Hi, I'm Yijiang. I'm a frontend engineer with 4 years of experience at Trip.com, Ctrip's international brand. I own the post-order flow for airport transfers and the cross-platform base library for our whole car-rental business.
>
> My work splits into two themes. The first is **cross-platform engineering** — I built our base library from scratch so one codebase runs on React Native, H5, and PC at the same time, which cut our release cycle by more than half. The second is **applying AI agents to real engineering problems** — I built an MCP-based tool that migrates legacy code automatically, and a UI-driven end-to-end testing system on top of a multimodal LLM. Both are running in production today.
>
> I'm looking for a role where I can keep working at this intersection of frontend infrastructure and agent engineering.

### Full version (~90s)

> Hi, I'm Yijiang Lu. I have a master's in Computer Science from University of Malaya, and for the past 4 years I've been a senior frontend engineer in the travel R&D department at Trip.com.
>
> I'm the **owner of two areas**: the post-order experience for airport transfers, and the cross-platform base library that the entire car-rental business builds on. I've consistently held an A / B+ performance rating.
>
> I think about my impact in four dimensions:
>
> - **Business** — through multiple rounds of A/B testing on the post-order page, I cut the human service-contact rate, bringing manual CPO down from 20% to 6%.
> - **Efficiency** — I led the cross-platform base library from zero to one, shrinking our iteration cycle from 3 days to 1.3 days. I also built an MCP migration tool that made legacy refactoring 60–70% faster.
> - **Quality** — I built a UI-driven cross-platform E2E system on Midscene, where one test case runs on all three platforms, replacing 2–3 hours of manual regression.
> - **Performance** — I keep the post-order pages fast: RN instant-open rate stays above 95%, and on H5/PC, FCP is under 1 second and LCP under 1.8 seconds.
>
> What excites me most lately is bringing agent-based engineering — code migration, automated testing — into real business workflows, not just demos. That's the direction I want to grow in.

### Self-intro cheat-sheet (memorize these anchors)

| Anchor | Number |
|---|---|
| Experience | 4 years, Trip.com |
| Ownership | Airport-transfer post-order + car-business cross-platform base library |
| Service-contact (CPO) | 20% → 6% |
| Iteration cycle | 3 days → 1.3 days |
| Code-reuse rate | 85%+ |
| Migration speedup | 60–70% |
| RN instant-open | 95%+ |
| H5/PC perf | FCP < 1s, LCP < 1.8s |

---

## 2. Project Introduction (项目介绍)

### Project A — Hydra: cross-platform base library (2023.08 – 2025.08)

**Elevator (30s)**

> Our car-rental business maintained two separate base libraries — Stark for React Native and Thanos for H5 — that were never aligned. Every feature had to be written twice, from the base layer up to business code. I designed a unified cross-platform base library called **Hydra**, built on xTaro, so one codebase runs on both RN and H5. It now covers 10+ core projects, pushed core code reuse above 85%, and cut the airport-transfer iteration cycle from 3 days to 1.3 days.

**Deep (2 min) — structure your answer in three technical highlights:**

1. **Unified core capabilities.** I re-wrapped the core primitives — App, Page, Modal, fetch — to reconcile the differences between RN and H5 in lifecycle, component behavior, and interface protocols. The business layer writes once and runs on both platforms.

2. **Design Tokens + automatic dark mode.** I designed a unified Design Tokens system across our C/Q/T brands. For dark mode on the app, instead of hand-writing two themes, I used **compile-time placeholders plus a PostCSS rewrite** so dark mode adapts automatically.

3. **Three-platform isomorphism.** I led the airport-transfer post-order page to render isomorphically on App / H5 / PC — the DOM structure and logic layer are fully shared across all three, with only PC getting independent SCSS fine-tuning.

**Result:** 10+ core projects covered, iteration 3d → 1.3d, core code reuse > 85%.

**Why it mattered:** before this, "platform difference" was handled by scattered `if (isRN)` conditionals everywhere — fragile and duplicated. Hydra moved that difference *down into the base library* so business developers never see it.

---

### Project B — xTaro migration MCP tool (2025.10 – 2026.04)

**Elevator (30s)**

> Our team was migrating a large legacy codebase from CRN to xTaro — hundreds of component and API mappings. It's the classic "rules are clear but the volume is huge" grind: look up the doc, change the import, adjust props, over and over. A pure AST codemod can only do mechanical find-and-replace; it can't handle conversions where the semantics differ and you need context. So I built an **MCP-server-based migration tool** that gets API conversion accuracy above 90% with almost no manual fixing, taking a mid-size component from 2 days down to half a day.

**Deep (2 min) — the key design idea is "code for the deterministic parts, LLM for the semantic parts":**

1. **Mappings as retrievable Resources.** I distilled the migration rules into structured **YAML Resources indexed by URI**, addressed uniformly through a Resource Template. The LLM reads them on demand instead of loading everything — this avoids context explosion.

2. **`generate-mapping`** automatically locates the old and new source code by name and generates a mapping scaffold, using the source code as the single source of truth (not stale docs).

3. **`convert-to-xtaro`** orchestrates a pipeline: **dependency analysis → LLM semantic conversion → tsc compile check.** The deterministic steps run as plain code — stable and zero-token — while only the semantic conversion is handed to the LLM to reason about on the spot.

**Result:** API conversion accuracy 90%+, basically no manual correction; mid-size component (a few thousand lines) 2 days → half a day, ~60–70% faster.

**Why MCP and not just a script:** the tool is reusable across any agent client that speaks MCP, and the URI-addressable Resource design keeps the LLM's context small and focused.

---

### Project C — Midscene-based E2E testing for chartered-car tours (2026.04 – present)

**Elevator (30s)**

> Our chartered-car-tour product only had unit tests — no E2E on the main flow, so every release needed 2–3 hours of manual regression. Selector-based tools like Appium and Playwright break the moment the element structure changes, and you have to write Web and App separately, so E2E never stuck. I built a **UI-driven cross-platform E2E system on Midscene.js**: test cases are written in natural language, one flow runs on H5 / iOS / Android, and regression is moving toward one-click automation.

**Deep (2 min) — four highlights:**

1. **Semantic location instead of selectors.** Midscene uses screenshots plus a multimodal LLM to locate elements by meaning, so a case just describes *intent* in natural language — no selectors, no coordinates. It doesn't break when the page is restyled.

2. **One flow, three platforms.** The business steps are written once as a natural-language flow; an **adapter middle layer** converges Midscene's three-platform integration differences into one unified interface, so H5 / iOS / Android share the same case.

3. **Knowledge as a skill.** I distilled the business semantics and writing conventions into a reusable **skill** — the AI drafts cases to spec, a human reviews and calibrates, and the knowledge evolves with the code and can be reused when writing feature code too.

4. **Caching to cut cost.** I enabled AI planning/location caching — if the page hasn't changed, it hits the cache and skips the model call, so token cost and latency drop sharply and regression approaches zero marginal cost.

**Result:** built from zero a UI-driven cross-platform E2E system covering the main chartered-car booking flow; regression moving from 2–3 hours of manual work toward one-click auto-run + human confirmation, and cases don't break en masse on a redesign.

---

## 3. Extension Questions (拓展问题)

> The deeper technical follow-ups. Prepare these — they separate "did the work" from "understands the work."

### On cross-platform / Hydra

**Q: Why build your own base library instead of using Taro directly?**
> We do build on xTaro (our internal Taro fork). The gap Taro doesn't close is *business-level consistency* — lifecycle timing, component default behavior, and interface protocols still differ subtly between RN and H5. Hydra is the thin layer that reconciles those so the business layer is truly write-once. Taro gives us the compiler; Hydra gives us the contract.

**Q: How does the compile-time placeholder + PostCSS dark mode actually work?**
> At authoring time we reference semantic color tokens as placeholders rather than literal colors. At compile time, PostCSS rewrites those placeholders into a structure that resolves the right value per theme. So a component is written once, and switching to dark mode is a token-resolution concern, not a second hand-written stylesheet. This avoids the classic bug where someone adds a color in light mode and forgets the dark variant.

**Q: What's the hardest part of three-platform isomorphism?**
> Keeping the DOM and logic layer genuinely shared while letting PC diverge *only* where it must. The trap is letting PC-specific tweaks leak into shared code as conditionals. We kept shared logic platform-agnostic and isolated PC differences to independent SCSS, so the shared surface stays clean.

**Q: How do you measure "85% code reuse"? Isn't that easy to game?**
> It's measured at the module level — shared modules vs. platform-specific modules across the covered projects. It's not a vanity metric because the *remaining* 15% is exactly the irreducible platform-specific surface (PC layout tweaks, native-only capabilities). The honest framing is "85% shared, and we know precisely why the other 15% can't be."

### On the MCP migration tool

**Q: Why is an AST codemod not enough?**
> A codemod is perfect when the transform is a pure structural rewrite — rename an import, reshape a prop. It fails when the mapping is *semantic*: when the new API isn't a 1:1 of the old one, when behavior depends on surrounding context, or when you need to choose between several valid targets. Those need understanding, which is where the LLM earns its place.

**Q: How do you keep the LLM from hallucinating wrong mappings?**
> Three guards. First, mappings are grounded in **actual source code**, not docs that drift. Second, the pipeline ends with a **tsc compile check** — anything that doesn't type-check is caught immediately. Third, I keep deterministic work (dependency analysis, addressing) in plain code so the LLM only does the one job it's good at. That combination is why accuracy lands above 90%.

**Q: Why structure mappings as URI-addressed Resources?**
> Context budget. If you stuff hundreds of mappings into the prompt, you get context explosion and degraded reasoning. With a Resource Template, the LLM retrieves only the few mappings relevant to the file it's converting. It's retrieval-augmented, but scoped by URI rather than embedding search, which is more precise for a known, finite rule set.

**Q: What happens to the 10% that's wrong?**
> They surface at the tsc step or in review, and they're usually the genuinely ambiguous cases. I treat them as feedback: a recurring failure becomes a new mapping rule, so the tool gets better over time rather than failing the same way twice.

### On Midscene E2E

**Q: LLM-based location is non-deterministic — how do you trust it in CI?**
> Two things. The caching layer makes a passing run *replayable*: if the page is unchanged, we hit the cache and skip the model, so it's deterministic for unchanged flows. And the final gate is "auto-run + human confirmation," not fully blind automation yet — we're deliberately staging the trust. The win isn't "zero humans," it's "2–3 hours → a few minutes of confirmation."

**Q: Isn't running a multimodal LLM per step slow and expensive?**
> That's exactly what the planning/location cache solves. The model is only called when the page actually changes; steady-state regression hits cache and approaches zero marginal cost. The expensive call happens once when a flow is new or a page genuinely changed.

**Q: Why does selector-based testing keep failing where this doesn't?**
> Selectors couple your test to the *implementation* — a class name, a DOM path. Restyle the page and every selector breaks. Semantic location couples to *intent* — "tap the Confirm button" — which survives restyles. That's why our cases don't break en masse on a redesign, which was the whole reason E2E never stuck before.

### Cross-cutting

**Q: Across all three projects, what's your design philosophy?**
> Put the boundary in the right place. In Hydra, push platform difference down so business code never sees it. In the MCP tool, split deterministic-vs-semantic so each part is done by whatever's best at it. In Midscene, couple tests to intent not implementation. It's the same instinct each time: find the right seam and let each side do what it's good at.

**Q: How do you decide when an LLM belongs in the pipeline vs. plain code?**
> Default to code. Code is stable, free, and testable. Reach for the LLM only where the task genuinely needs *understanding* — semantic conversion, intent-based location — and even then, fence it with deterministic checks on both sides (grounding input, validating output).

---

## 4. Impromptu Q&A (即兴问答)

> Behavioral, motivational, and open-ended. Answer with a real example, keep it under a minute, end on a result or a lesson.

**Q: Tell me about a hard technical problem you solved.**
> The dark-mode problem in Hydra. The naive approach was a second hand-written theme, which is duplication and a constant source of "forgot to add the dark variant" bugs. I moved it to compile time — semantic token placeholders rewritten by PostCSS — so dark mode resolves automatically from one source of truth. The lesson: when something feels like repetitive manual work, the real fix is usually to move it to a different layer, not to do it more carefully.

**Q: Tell me about a time you failed or something didn't work.**
> Early on with the E2E work, I underestimated how non-deterministic naive LLM location was — flaky runs killed trust fast. Instead of forcing full automation, I stepped back and staged it: caching for replayability, plus human confirmation as the final gate. It taught me to *earn* trust in an automated system incrementally rather than demand it up front.

**Q: Why are you looking to leave / change?**
> I'm not running from anything — Trip.com gave me real ownership and great problems. I'm pulled toward the agent-engineering direction. I've now shipped agent-based tooling into production, and I want a role where that's the core of the work, not a side project.

**Q: Why frontend + agent, specifically?**
> Frontend is where ambiguity lives — UIs change, intent matters more than structure. That's exactly where LLMs add value over rigid automation. My migration tool and E2E system are both bets that the next leap in frontend productivity comes from agents that understand context, and I want to keep building at that edge.

**Q: What are your strengths?**
> Finding the right abstraction boundary, and shipping infrastructure that other engineers actually adopt — Hydra covers 10+ projects because it made their lives easier, not because anyone mandated it. I think in terms of leverage: build the thing once that saves everyone time.

**Q: What's a weakness you're working on?**
> I tend to over-invest in making infrastructure clean before proving it's needed. I've been countering that by shipping a thin version first and letting real adoption tell me where to harden — the E2E system started as one flow before I generalized the adapter layer.

**Q: Where do you see yourself in a few years?**
> Owning the agent-engineering practice for a frontend org — the tooling, the conventions, the systems that let a team move faster with AI in the loop. The three projects are early steps toward that.

**Q: How do you keep up with new tech?**
> I learn by building. MCP, multimodal location, Midscene — I picked each one up by shipping a real project on it, then distilling what I learned into reusable skills and docs so the team compounds on it.

**Q: Do you have any questions for us?** (always have 2–3 ready)
> - How does this team currently use AI/agents in its own workflow, and where do you want that to go?
> - What does the path from "human-confirmed automation" to "trusted automation" look like here?
> - What would success in this role look like in the first 6 months?

---

## 5. Pronunciation / phrasing watch-list

| Term | Note |
|---|---|
| isomorphic / isomorphism | "render the same on all platforms" |
| deterministic | "same input, same output" — your key word for the MCP design |
| multimodal | screenshots + text together |
| regression (testing) | re-checking that old features still work |
| marginal cost | cost of one *more* run |
| grounding (an LLM) | tying it to real source-of-truth data |

**Three phrases to reuse all interview:**
- "write once, run on all three platforms"
- "code for the deterministic parts, LLM for the semantic parts"
- "couple to intent, not implementation"
