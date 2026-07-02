---
id: 2026-06-26-obsidian-foundry-redesign
owner: Zenn
created: 2026-06-26
---

# Execute the Obsidian Foundry redesign on the React `ui/`

## Goal

Re-skin and re-content benhickman.dev from "Northwoods / cloud architecture" to the **ZennLogic
"Obsidian Foundry"** design system, positioned around **enterprise-grade agentic engineering, backed
by full-stack AI depth** — implementing the approved design prototype with verified content.

## Source of truth

- **Design prototype:** Claude Design project `0e4b3492-50aa-4565-b158-d26074cf2f6a` (home-v1, cmdk-v1,
  work/writing/about/contact + `theme.css`), built on the ZennLogic DS `5406087f-8b93-4219-9f6d-fc73b049a436`.
- **Content + decisions:** `.claude/content-plan/05-site-brief-and-decisions.md` (locked decisions) and
  `06-verification-and-ownership-corrections.md` (AUTHORITATIVE verified project set — never feature
  `llmfit`/`agent-spec-lab`/`java-spring-ai`/`zennlogic_ai`; `model-training` is "built" not "trained").
- **Per-page specs:** the open intents in `.agents/intents/open/` (home/blog/experience/contact/playground/
  privacy/site-shell-and-seo).
- **Tokens:** the DS values are in `colors_and_type.css` (carbon `#0A0A0B`, surface `#161618`, border
  `#27272A`, text `#F5F5F0`, persimmon `#E65100`, wasabi `#889E48`; Geist headings, JetBrains Mono body).

## Current state

Branch `feat/obsidian-foundry-redesign` off `fix-blog-posts`. The `ui/` theme is **token-driven**:
`ui/src/theme/theme.ts` reads `--color-*-hex` / font / shadow CSS vars from `ui/src/theme/tokens.css`, so
the bulk of the palette reskins by changing token values. `index.html` already loads Geist + JetBrains
Mono (plus dead Orbitron/Pacifico/Clash Display).

## Plan (phased — each phase is a reviewable increment, verified in `npm run dev`)

1. **Foundation (token-driven).** Rewrite `tokens.css` to Obsidian Foundry values; drop shadows in favor of
   1px borders (no glow/blur); add `--radius-pill: 999px`. In `theme.ts`: headings → Geist, body → JetBrains
   Mono (retire Clash Display), shadows → `none`/subtle, fix the `borderRadius` string cast. Trim dead fonts
   from `index.html`. → reskins ~70% of the app at once.
2. **Global shell.** `Header` → floating nav pill (◉ logo, Work/Writing/About/Contact, ⌘K trigger);
   `Footer` → minimal "© 2026 Ben Hickman · built in an IDE". Gate the `App.tsx` route transition behind
   `prefers-reduced-motion`; add focus management on route change. (per `site-shell-and-seo` intent)
3. **Home.** Hero (agentic + ⌘K bar), proof strip (verified), bento (zenn_ai/ZenMind/model-training/
   token-counter/zennlogic.com), stack band, writing teasers, contact CTA. (per `home-modernization`)
4. **Other pages.** Work (project grid, verified set + maturity chips), Writing/Blog, About, Contact
   (form-only + inquiry-type/company fields + a11y), Privacy. (per the matching open intents)
5. **⌘K command palette.** Search/navigate first; AI "ask my work" mode wired to a serverless backend later
   (the proven zennlogic.com pattern). (new flagship)
6. **SEO/meta architecture.** Per-route title/description, OG/Twitter, `Person`/`Article` JSON-LD,
   regenerate sitemap. (per `site-shell-and-seo`)

**Parallel track — Sanity content** (the in-flight `2026-06-22-sanity-content-infrastructure` intent):
register the WIP schema types, seed `project`/`homePage`/`timelineItem` from the verified content packet,
wire GROQ. Decision: **reskin with verified content inline first** (fast visual), migrate to Sanity after.

## Success criteria

- [ ] Site renders in the Obsidian Foundry palette/type, dark-first, no shadows; `npm run build` + Jest green.
- [x] Home matches the approved prototype with only the verified project set; no `llmfit`/broken repos.
- [x] Header is the floating ⌘K nav pill; route transitions respect `prefers-reduced-motion`.
- [ ] Work/Writing/About/Contact rebuilt to the system with verified, IP-safe copy.
- [ ] ⌘K search/navigate works; AI mode stubbed pending backend.
- [ ] Per-route meta + JSON-LD + sitemap in place.

## Out of scope (for now)

- The live ⌘K "ask my work" AI backend (serverless + model key) — design + stub only.
- model-training copy upgrade to "trained" — pending Ben's weekend run + artifacts.

## Risks / open questions

- Big visual change on a deployed site — verify each phase in `npm run dev` (Claude_Preview) before moving on.
- Token swap may surface components that hardcoded old colors — grep for stragglers.
- Branch base: built on `fix-blog-posts`; confirm merge order vs. the Sanity-infra work before the PR.

## Progress

- ✅ **Phase 1 — Foundation** (`c897b26`): `tokens.css` / `theme.ts` / `index.html` reskinned to Obsidian Foundry; tsc + lint green, verified in dev server.
- ✅ **Phase 2 — Global shell** (`7e802be`): floating ⌘K nav pill `Header`, minimal normal-flow `Footer`, surface-styled `MobileDrawer`, `App.tsx` route transition gated on `prefers-reduced-motion` + focus-on-navigate; tsc + lint + prettier green, verified.
- ✅ **Phase 3 — Home** (per `home-modernization` + design `home-v1`): rebuilt `Home.tsx` into six section components under `ui/src/components/features/home/` (`HeroSection` with the ⌘K bar, `ProofStrip`, `FeaturedWork` bento, `StackBand`, `WritingTeasers`, `ContactCta`) + typed `homeContent.ts` / `homeStyles.ts` and shared `SectionHeading` / `CtaLink`. Verified-set bento only (zenn_ai / ZenMind / model-training / token-counter / zennlogic.com); flagship agent-loop trace + reduced-motion guards; X/YouTube socials omitted (open data gap). Deleted the old `HeroBanner` / `heroSkills` / `HomeSummary` / `HomeBlogCTA`. Rewrote `Home.test.tsx` (15 tests incl. a regression guard asserting llmfit/agent-spec-lab/java-spring-ai/zennlogic_ai never render). tsc + lint + prettier + Jest (19/19) green; verified live in dev server desktop + mobile.
  - **Adversarial review pass** (4-lens workflow): content-accuracy caught the hero lede "Shipped on bare metal" overclaim — it's the framing packet §C disclaims for zenn_ai + factually wrong (Proxmox LXC, not bare metal). **Fixed → "Self-hostable, end to end."** A11y + code-quality fixes: focus-visible ring on the ⌘K button, `aria-hidden` on the decorative `>_` glyph, dropped two redundant `as SxProps` casts, un-exported single-use `WRAP_MAX`, literal-substring forbidden-project test guard.
  - **Open items for Ben (not blockers):** (1) the `Rust` stack chip has no verified backing repo in packet §B — confirm a shareable artifact or drop it; (2) muted eyebrow/label color (`#52525b` @ 11px ≈ 2.5:1) fails AA — a **site-wide DS** item (the eyebrow token from Phase 1), best fixed globally, not Home-only.
- ✅ **Code-cleanup pass** (2026-06-28, post-Phase-3; driven by a 5-lens `ui-cleanup-audit` workflow + styling QA):
  - **Spacing bug (high impact):** the custom MUI `spacing()` returned `var(--space-${factor})`, but only integer tokens `--space-0…7` exist — so every **fractional** spacing value (`px:1.5`, `gap:0.25`, …) collapsed to 0 app-wide (the nav links ran together). Fixed: integer 0–7 → fluid token; else 8px base. Verified desktop/tablet/mobile.
  - **Dead code purged:** legacy MUI theme (`styles/theme.ts` + `colorTokens` + `themeUtils` + `types/theme.d.ts`), the dead Sanity home pipeline (`HomePreview`, `HomeHero`, `HomeContentSection`, `useSanityHomePage`, `types/home.ts` + 3 `sanityClient` fns), 4 orphaned components (`NavigationDrawer`/`LogoBanner`/`PageShell`/`UiButton`), and 6 orphaned public assets.
  - **Correctness:** `/blog/:slug` redirect now substitutes the slug (`LegacyBlogRedirect`); OG/Twitter/JSON-LD image path `BH monogram.png` → `monogram.png`; favicon MIME fixed.
  - **Perf:** removed per-image `console.*` from `BlogBody` (+lazy/async decode); memoized `getDomainConfig`.
  - **Consistency:** new `--color-border-hover` token (fixes a latent light-mode bug; killed 9 `#3a3a40` literals); extracted `cardSx`/`tagSx`/`kbdSx`/`eyebrowAccentSx` into `homeStyles.ts`; hoisted `navLinks` → `config/navLinks.ts` (Header+Footer); single-sourced socials → `config/socialLinks.ts`; `ContactCta` uses `SectionHeading`; new home/shell components converted to **named exports**. tsc+lint+prettier+Jest(19/19) green; live-verified.
  - **Deliberately deferred (net-negative if applied blindly):** `useTheme` writes `data-theme` in render *on purpose* — moving it to an effect lags MUI's synchronous CSS-var read by a frame and breaks the theme toggle; the `AnimatedPageContainer` CSS-keyframes refactor was skipped because a `key={pathname}` remount would re-trigger the Suspense fallback + reset focus-on-navigate for negligible gain.
- ✅ **Responsive navigation — mobile bottom tab bar** (2026-06-28; designed first in Claude Design `nav-system.html`, Variant B approved): desktop keeps the floating top pill; below `md` it swaps to a fixed bottom tab bar (`components/layout/BottomNav.tsx`) — Home · Work · **⌘ Ask** (elevated center, coming-soon stub until Phase 5) · Writing · Contact, system glyphs (`⌂ ▤ ✎ ✉`, U+FE0E to force text glyphs), Persimmon active + 2px top indicator, 44px+ targets, `safe-area-inset-bottom`. Retired the hamburger + `MobileDrawer` (and its `focus-trap-react` usage — dep now removable from `ui/package.json`); ⌘K is desktop-header-only. Footer gets `--bottom-nav-h` bottom padding on mobile so it clears the fixed bar (the `html`-scroller / `height:100%` chain makes `body` padding ineffective); consent banner offset above the bar. Relabeled the desktop nav `Experience` → `Work` to match the approved design. tsc+lint+prettier+Jest(19/19) green; live-verified mobile (bar, active states, footer clearance, tab nav) + desktop (unchanged header).
- ▶ **Next: Phase 4 — Other pages** (Work / Writing / About / Contact / Privacy). Note: Home's work CTAs (`See the work`, `All work`) point at `/experience` until the dedicated `/work` route lands in Phase 4 — repoint then. Carry-over styling item: the un-redesigned Contact page's old `SocialLinks` cards use hardcoded brand colors (GitHub circle near-invisible on dark) — fix during the Contact redesign.
- ⚠️ The Claude format/lint hook can't resolve `eslint` from the workspace root (`pnpm` recursive-exec). Verify instead with `pnpm --filter ui run typecheck` + `pnpm --filter ui run lint` + `pnpm --filter ui exec prettier --check <files>`. Run Jest via `pnpm --filter ui run test <path>` (not `npx jest` — the destructive-bash guard blocks it). Dev server: `.claude/launch.json` config `ui-dev` (preview port 5173; if contended, the harness `autoPort` + a `--port`-pinned vite invocation gets a free port).

## Linked

- PRs:
