---
id: 2026-06-26-privacy-policy-modernization
owner: Zenn
created: 2026-06-26
---

# Modernize the Privacy Policy and align it with the real consent/analytics system

## Goal
Make `ui/src/pages/PrivacyPolicy.tsx` accurate, complete, and credible for an
enterprise-facing portfolio in 2026 — so the policy text precisely matches what
the consent system, Google Analytics integration, Formspree/hCaptcha contact
form, and Sanity content delivery actually do, and meets GDPR/CCPA/ePrivacy
disclosure expectations.

## Current state
The page renders cleanly (good IA: numbered sections, processor list, GDPR/CCPA
rights, embedded contact form) but has multiple policy-vs-code mismatches and
gaps. Verified against the real source:

- **"Last Updated" is fabricated per render.** Line 22 prints
  `{new Date().toLocaleDateString()}` — the date is *today, every time*, in
  locale-dependent format. A privacy policy must show a fixed, real revision
  date. This is the single most credibility-damaging issue.
- **Consent persistence misdescribed.** Policy calls the consent record an
  "Essential Cookie" named `benhickman_consent_v1` (lines 86, 96). The code
  (`ui/src/lib/consent/storage.ts`) does store a **cookie** of that name via
  `js-cookie`, **365-day expiry, SameSite=Lax, Secure on HTTPS** — none of which
  the policy states. Retention period and attributes should be disclosed.
- **Cross-tab BroadcastChannel undisclosed.** `ConsentProvider.tsx` uses a
  `BroadcastChannel('benhickman_consent_updates')` to sync consent across tabs.
  Minor, but it's client-side processing worth a one-line mention.
- **Consent Mode v2 / ad_storage not described.** `config/analytics.ts` sets
  `gtag('consent','default', { analytics_storage:'denied', ad_storage:'denied' })`
  and only flips `analytics_storage` to granted on consent (`ad_storage` stays
  denied). The policy says nothing about Google Consent Mode or that advertising
  storage is permanently denied — a genuinely positive, disclosable fact.
- **"IP anonymization is enabled where possible" is unsubstantiated** (line 72).
  There is **no** `anonymize_ip` / `allow_google_signals` /
  `allow_ad_personalization_signals` call anywhere in the code (grep returned
  nothing). GA4 anonymizes IP by default, but the policy claims an explicit
  control that the code does not implement. Either remove the claim or describe
  GA4's default behavior accurately.
- **GA cookie specifics absent.** Policy mentions "Google Analytics places
  cookies" generically but does not name `_ga` / `_ga_<id>` or their ~2-year
  lifetimes, which a complete cookie table should list.
- **hCaptcha is real and adequately described** (`ContactForm.tsx` imports
  `@hcaptcha/react-hcaptcha`, renders with a sitekey) — but the policy omits
  that hCaptcha sets its own cookies / is a third-party processor with its own
  privacy terms, and does not link hCaptcha's policy.
- **Formspree & Sanity disclosed but no links / no data-location info.** Good
  that they're named; missing links to their privacy policies and any
  data-residency note (relevant for GDPR transfers).
- **No data controller identity / contact email.** Section 4 routes data-subject
  requests through the same Formspree contact form (lines 121–133) and "the
  details below" — but there are no "details below." GDPR/CCPA expect a named
  controller and a direct contact channel for rights requests.
- **No data-retention, legal-basis, children's-data, or
  international-transfer sections** — standard 2026 policy components.
- **Consent UI copy vs policy drift.** Banner says "improve this site and
  measure traffic"; modal groups everything under a single "Analytics" toggle
  that maps to `consent === 'granted'`. The policy's two-category model
  ("Functional/Necessary" vs "Analytics") matches the modal's two switches
  (Essential disabled-on, Analytics toggle) — consistent — but the policy should
  explicitly state that withdrawing consent is done via the same "Cookie
  Preferences" control and takes effect immediately (it does, via
  BroadcastChannel + Consent Mode update).
- **Accessibility gaps.** No `<h1>`-level landmark issues (heading order h1→h2→h3
  is correct), but: the page sets no document `<title>`/meta for the privacy
  route (App.tsx only sets a global branding title); `ProcessorItem` nests
  `Typography` spans inside `ListItemText` (acceptable) but the disc-bullet
  lists use `ListItem sx={{ display:'list-item' }}` without a semantic `<ul>`
  role wrapper — verify screen-reader list semantics. Contrast of
  `text.secondary` body copy at small sizes should be checked against 4.5:1.
- **SEO/metadata.** There is **no** `noindex` anywhere (no react-helmet in deps;
  `index.html` has no robots meta). A privacy policy page is generally fine to
  index, so noindex is *not* required — but the route has no page-specific
  `<title>`/description, and as an SPA it depends on JS rendering. Decide
  whether per-route metadata (helmet or equivalent) is in scope.

## Success criteria
- [ ] "Last Updated" shows a hard-coded, real ISO date (e.g. `2026-06-26`), not
      `new Date()`, and is in a stable, locale-independent format.
- [ ] Policy names the consent cookie (`benhickman_consent_v1`), states it is a
      first-party cookie, its 365-day retention, and SameSite=Lax/Secure.
- [ ] Policy describes Google Consent Mode behavior: analytics denied by
      default, only enabled on explicit opt-in, and `ad_storage` always denied.
- [ ] The "IP anonymization is enabled where possible" sentence is either backed
      by a real `anonymize_ip`/equivalent setting in `config/analytics.ts` **or**
      rewritten to accurately reflect GA4 default behavior.
- [ ] GA cookies (`_ga`, `_ga_*`) named with purpose and approximate lifetime in
      a cookie list/table.
- [ ] hCaptcha, Formspree, and Sanity each link to their respective privacy
      policies; hCaptcha noted as a spam-protection processor that may set its
      own cookies.
- [ ] A named data controller and a direct contact method (email or stable form)
      for data-subject / CCPA "do not sell/share" requests is present — Section 4
      no longer references nonexistent "details below."
- [ ] Sections added for: legal basis (GDPR Art. 6), data retention, children's
      data, and international transfers (or an explicit statement that none
      apply).
- [ ] Policy explicitly states how to withdraw consent ("Cookie Preferences" in
      footer) and that withdrawal takes effect immediately across tabs.
- [ ] Heading order, list semantics, and `text.secondary` contrast verified to
      WCAG 2.1 AA; privacy route gets a page-specific `<title>`/meta (or a
      documented decision not to).
- [ ] Decision recorded on `noindex` for `/privacy` (recommendation: keep
      indexable; do not add noindex).
- [ ] Consent banner/modal copy reviewed for consistency with final policy
      wording; no contradictory claims.

## Scope
- `ui/src/pages/PrivacyPolicy.tsx` (primary — content + structure).
- Cross-reference only (read, not necessarily edit):
  `ui/src/lib/consent/storage.ts`, `ui/src/contexts/consent/ConsentProvider.tsx`,
  `ui/src/config/analytics.ts`,
  `ui/src/components/common/{ConsentBanner,CookieSettingsModal,AnalyticsTracker}.tsx`,
  `ui/src/components/common/FormspreeContactForm/*`.
- Optional metadata: per-route `<title>`/meta strategy in `ui/src/App.tsx` or a
  helmet-style helper (separate decision).

## Out of scope
- This is **not legal advice.** A qualified privacy lawyer should review final
  wording before publication — specifically the legal-basis, controller
  identity, CCPA "sale/share" classification, and international-transfer
  language. Flag these for counsel.
- Changing the consent **mechanism** itself (banner/modal behavior, cookie
  lifetime, BroadcastChannel) — unless a fix is needed purely to make a truthful
  claim (e.g. adding `anonymize_ip`). Behavioral changes belong in a separate
  intent.
- Adding a full cookie-scanner/CMP vendor; the existing in-house consent system
  stays.

## Plan
1. Replace the dynamic `Last Updated` date with a hard-coded constant and a
   stable format; establish a convention for bumping it on edits.
2. Re-read the consent/analytics source and build a factual inventory: cookie
   names, lifetimes, attributes, processors, Consent Mode defaults. Use it as
   the single source of truth for the rewrite.
3. Rewrite Section 1 (Data We Collect) and Section 2 (Cookies) to match that
   inventory — add a cookie table (name, provider, purpose, retention), correct
   the IP/anonymization claim, document Consent Mode and `ad_storage: denied`.
4. Add external privacy-policy links for Formspree, hCaptcha, and Sanity; note
   hCaptcha as a third-party processor.
5. Add a real data-controller block and a direct rights-request contact;
   rewrite Section 4 so it no longer points at absent "details below."
6. Add the missing standard sections (legal basis, retention, children's data,
   international transfers, withdrawal of consent).
7. Verify accessibility (heading order, list semantics, contrast) and decide on
   per-route `<title>`/meta; record the noindex decision (keep indexable).
8. Review ConsentBanner/CookieSettingsModal copy for consistency with the final
   policy; reconcile any contradictions.
9. Route the finished draft to a privacy lawyer for the items flagged under Out
   of scope before it goes live.

## Risks / open questions
- **Legal accuracy:** controller identity, CCPA sale/share stance, and transfer
  mechanisms are legal determinations, not engineering ones — needs counsel.
- **Truthfulness gate:** every claim added must be backed by real code. If we
  *say* IP is anonymized, the code must do it (add `anonymize_ip:true` or
  document GA4 defaults) — do not paper over with aspirational language.
- **Contact channel:** publishing a direct email invites spam; decide between a
  dedicated rights-request alias vs. the existing hCaptcha-protected form.
- **Metadata strategy:** adding react-helmet (or equivalent) is a new dependency
  — surface for review; otherwise per-route `<title>` must be set imperatively
  like App.tsx already does.
- **Data residency:** confirm where Formspree/Sanity store data (US vs EU) before
  writing transfer language.

## Linked
- PRs:
