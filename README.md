# Raphael Guerra — Personal Website

Clean, responsive personal website that presents my work, selected projects, and ways to reach me. Built as a lightweight static site with multi‑language support (EN, PT, ES, FR).

This is a portfolio project focused on clarity and performance. It highlights functionality and content over framework complexity.

## What It Does
- Introduces who I am and how I work
- Highlights selected projects with links to code and live demos
- Multi‑language UI with instant switching and saved preference
- Contact and social links (email, LinkedIn, etc.)
- Lightweight offline support (basic PWA behavior)

## Highlights
- Fast, accessible, mobile‑first design
- Simple client‑side i18n (JSON locales + language switcher)
- SEO‑friendly metadata and clean structure

## Run Locally
Serve statically to allow loading JSON locale files:

```bash
python3 -m http.server 5173
# or
npx http-server -p 5173
# then open http://localhost:5173
```

## Status & Learnings
- Functional personal site showcasing portfolio and content
- Learnings: pragmatic i18n, simple PWA, content‑first design

## License
All rights reserved. Personal portfolio project — not for production use.
