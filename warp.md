# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Static, multi-page site (no build toolchain). Main files: index.html, team.html, join-us.html, join.html, styles.css, script.js, emailjs.config.js, assets/.
- Brand color: #3b538b; background: white (see README.md).

Commands
- Preview locally (from repo root):
  ```bash path=null start=null
  python3 -m http.server 8080
  ```
  Then open http://localhost:8080
- There is no build, lint, or test setup in this repo.

Architecture and key responsibilities
- HTML pages
  - index.html: Lightweight landing with header/nav, hero, footer. Inline year script only on this page.
  - team.html: Rich content page with “Our Team” sections (advisor, executive council, members, alumni). Re-implements header/nav/footer markup used by other pages.
  - join-us.html: “Join GIN!” marketing page with mission/vision and “How to Join” info cards; buttons use generic .cta-button/.info-button classes.
  - join.html: Membership + Contact page; includes EmailJS SDK + config; contact form posts via EmailJS when configured.
  - Note: Nav menus reference about.html and events.html, which do not exist. Either add those pages or update nav links across pages.
- CSS (styles.css)
  - Centralized styling for navigation, hero, sections, grids, cards, buttons, responsive breakpoints, and themed components (events, projects, team, join pages).
  - Hero backgrounds are set via CSS (e.g., linear-gradient over an image). To use a local hero asset, update the background URL; assets/gin-hero.png is the conventional location.
- JavaScript (script.js)
  - Mobile nav: toggles .hamburger and .nav-menu, closes on link click.
  - Active link highlighting based on window.location.pathname.
  - CTA routing: Only buttons with exact text “Join Now” navigate to join.html and “Get Membership Info” navigate to join.html#contact. Other labels won’t auto-route.
  - EmailJS integration (used on join.html):
    - Expects window.EMAILJS_CONFIG (from emailjs.config.js) and window.emailjs (SDK). If unset or placeholder-like, a user-facing status message appears and form submit is disabled.
    - On success, alerts and resets; on failure, alerts with fallback email.
  - UX polish: scroll animations, title live clock, hero typing effect, optional parallax, stat counters, “Winter Fest” countdown (targets 2025-12-06; safe to adjust or remove as needed).
- EmailJS configuration (emailjs.config.js)
  - Defines PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID, TO_EMAIL on window.EMAILJS_CONFIG. join.html includes both the SDK and this config.
  - If modifying, keep keys consistent with the EmailJS dashboard; PUBLIC_KEY is frontend-safe by design. Do not inline keys into HTML files.
- Assets
  - assets/README.txt describes expected gin-hero.png placement; CSS references control whether it’s used.

Cross-page considerations
- Nav/header/footer markup is duplicated across pages; edits must be made in each file to keep consistent.
- The “active” nav state relies on exact hrefs matching the current filename.
- CTA button behavior depends on exact text content (see script.js). When changing labels, also update script.js logic or add data attributes to avoid text coupling.
- Some links (about.html, events.html) are placeholders — creating these pages or updating links avoids 404s in production.
