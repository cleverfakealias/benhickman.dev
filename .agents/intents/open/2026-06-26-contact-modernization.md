---
id: 2026-06-26-contact-modernization
owner: Zenn
created: 2026-06-26
---

# Modernize the Contact page for enterprise agentic-engineering inquiries

## Goal
Turn the Contact page from a generic "send a message" form into a conversion-focused
intake that qualifies enterprise/consulting inquiries, sets clear response expectations,
and meets 2026 WCAG 2.1 AA, privacy, and SEO standards.

## Current state
- `ui/src/pages/Contact.tsx` renders a centered header **"Get in Touch"** with subcopy
  *"Let's discuss your project, collaboration opportunities, or just connect."* and two
  `<h2>` sections inside one card: **"Contact Information"** and **"Send a Message"**.
- `ui/src/components/common/ContactInformation.tsx` is a `Paper` CTA titled
  **"Let's Work Together"** with body *"Whether you have a project in mind, want to
  discuss collaboration opportunities, or just want to connect, I'd love to hear from
  you. Feel free to reach out through any of the channels below!"* — followed by
  `<SocialLinks />` (LinkedIn + GitHub only, via `linkedin.benhickman.dev` /
  `github.benhickman.dev`). No email address, no phone, no location/timezone, no
  response-time or availability statement.
- `ui/src/components/common/FormspreeContactForm.tsx`:
  - **Duplicates the page header** — it renders its own `component="h1"` **"Get in Touch"**
    plus an `<h3>` subtitle *"I'd love to hear from you! Fill out the form below..."*,
    on top of the page's existing H1. Result: two `<h1>`s and redundant copy on one page.
  - Fields: **Name** (required), **Email** (required), **Phone (optional)**, **Message**
    (required, 4 rows). Generic helper text ("Enter your full name", etc.). No fields that
    qualify an enterprise lead (company, role, inquiry type, budget/timeline, project context).
  - Validation: required + regex email; runs on a `setTimeout(validateForm, 80)` per keystroke;
    submit button is disabled until `isFormValid && captchaVerified`. Errors surface only via
    per-field `helperText`; there is **no `role="alert"` / `aria-live`** region announcing
    validation errors or the top-level `<Alert>` to screen readers, and **no focus management**
    to the first invalid field or to the success state.
  - Spam protection: **hCaptcha** (`@hcaptcha/react-hcaptcha`) + **Formspree** POST with
    `h-captcha-response`, 15s `AbortController` timeout, urlencoded body. Captcha is centered
    with no label.
  - Success state: full-form replacement with **"Thank You!"** + *"Your message has been
    successfully sent. I will get back to you soon."* + "Send Another Message". Success text
    is not focus-moved or announced.
- Privacy/consent: a full consent system exists (`ConsentProvider`, `useConsent`,
  `ConsentBanner`, `/privacy` route) but the contact form shows **no consent/privacy notice**
  near the submit button and does not link to `/privacy`.
- SEO/metadata: `updateMetaTags()` exists in `ui/src/config/domainConfig.ts` and is called
  by PrivacyPolicy / Playground / HomePreview, but **Contact.tsx never sets per-page title,
  description, canonical, or OG tags** — it inherits the site default. No `ContactPage`
  JSON-LD.

## Success criteria
- [ ] Exactly one `<h1>` on the route; `FormspreeContactForm`'s duplicate "Get in Touch" H1
      and redundant subtitle are removed (form keeps only field-level content).
- [ ] Page copy is rewritten for enterprise positioning (e.g. "Start an engagement" /
      qualifying language) instead of "just connect".
- [ ] Form captures lead-qualifying data: at minimum an **inquiry type** select
      (e.g. Consulting / Full-time / Speaking / Other) and a **company/organization** field;
      timeline or project-context optional. New fields are typed and posted to Formspree.
- [ ] A visible **response-time / availability** trust signal is shown (e.g. "Replies within
      2 business days"), plus a direct email `mailto:` link as a no-form alternative.
- [ ] Validation errors are announced to assistive tech via an `aria-live="assertive"` /
      `role="alert"` region; on failed submit, focus moves to the first invalid field.
- [ ] On success, focus moves to the confirmation heading and it is announced (`role="status"`
      or focus + `tabIndex={-1}`).
- [ ] hCaptcha has an accessible label/description and its presence is explained
      ("protected by hCaptcha"); captcha/Formspree env-misconfig still degrades gracefully
      (current `configError` behavior preserved).
- [ ] A privacy/consent line appears near submit, linking to `/privacy`, stating how the
      message is processed (Formspree) — consistent with the site consent system.
- [ ] Contact route sets its own `<title>`, meta description, canonical, and OG tags
      (via `updateMetaTags` or a dedicated head effect) and emits `ContactPage` JSON-LD.
- [ ] Color contrast of helper/secondary text and the gradient submit button meets 4.5:1;
      `prefers-reduced-motion` respected for the `Fade`/`translateY` hover animations.
- [ ] `npm run typecheck`, `npm run lint`, and `npm test` pass in `ui/`.

## Scope
- `ui/src/pages/Contact.tsx`
- `ui/src/components/common/FormspreeContactForm.tsx`
- `ui/src/components/common/ContactInformation.tsx`
- `ui/src/components/common/SocialLinks.tsx`
- `ui/src/config/domainConfig.ts` (per-page meta for `/contact`; possibly a `contact`-specific
  branding/meta entry)
- Copy only; reuse existing consent components and `/privacy` route.

## Out of scope
- Replacing Formspree or hCaptcha with another provider.
- Backend/serverless inbox, CRM, or auto-responder integration.
- Redesigning the global consent banner or `ConsentProvider`.
- The standalone header `Socials.tsx` (layout) beyond keeping links in sync.
- Adding social networks not currently owned (only LinkedIn/GitHub confirmed).

## Plan
1. De-duplicate headings: remove the in-form `<h1>` "Get in Touch" + subtitle from
   `FormspreeContactForm`; keep the single page `<h1>` in `Contact.tsx` and rewrite its
   subcopy for enterprise framing.
2. Rework `ContactInformation`/`SocialLinks` into a trust panel: add response-time +
   availability statement, a `mailto:` direct-contact link, and (optionally) location/timezone;
   keep LinkedIn/GitHub.
3. Extend `FormData` with `inquiryType` (MUI `Select`) and `company`; wire them into validation
   and the urlencoded Formspree body. Improve helper text to be qualifying, not filler.
4. Add accessibility: a live-region error summary (`role="alert"`/`aria-live`), focus-to-first-
   invalid-field on submit failure, and focus/announce on the success confirmation; label the
   hCaptcha widget.
5. Add a privacy/consent microcopy line above/below submit linking to `/privacy` and naming
   Formspree as processor.
6. Add per-page SEO: set Contact title/description/canonical/OG (extend `domainConfig` or a
   page-level effect) and inject `ContactPage` JSON-LD.
7. Pass contrast + reduced-motion checks; run `npm run typecheck && npm run lint && npm test`.

## Risks / open questions
- **Formspree free tier**: extra fields are fine, but server-side hCaptcha verification and
  field labels depend on the form's Formspree config; new fields must be added to the
  Formspree form template to appear in notifications.
- **hCaptcha accessibility**: the widget is third-party; we can label its container but cannot
  fully control its internal a11y — document the accessibility-cookie/no-JS fallback.
- Decision: which qualifying fields are mandatory vs optional? Over-asking (budget) can depress
  conversion; recommend inquiry type required, company optional.
- Decision: should the duplicate-H1 fix keep the form heading as an `<h2>` "Send a message"
  (already present in `Contact.tsx`) — confirm no other component renders an H1.
- Email exposure: a `mailto:` invites scraping; consider obfuscation or routing through the
  form only. Confirm Ben wants a public address.

## Linked
- PRs:
