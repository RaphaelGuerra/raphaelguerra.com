# raphaelguerra.com

Last updated: 2026-03-09

## Table of Contents

<!-- TOC start -->
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Local Dev](#local-dev)
- [Quality Checks](#quality-checks)
- [Deploy](#deploy)
- [Status & License](#status--license)
<!-- TOC end -->

[![Lint](https://github.com/RaphaelGuerra/raphaelguerra.com/actions/workflows/lint.yml/badge.svg)](https://github.com/RaphaelGuerra/raphaelguerra.com/actions/workflows/lint.yml)
[![Security](https://github.com/RaphaelGuerra/raphaelguerra.com/actions/workflows/security.yml/badge.svg)](https://github.com/RaphaelGuerra/raphaelguerra.com/actions/workflows/security.yml)

## Overview

- Static personal website with localized content (`/locales`).
- Plain HTML, CSS, and a bit of vanilla JavaScript.
- Includes an `_headers` file for static hosting tweaks (e.g., security
  headers).

## Tech Stack

- Static HTML/CSS
- Vanilla JavaScript
- JSON-based i18n (`/locales/*.json`)

## Local Dev

Prerequisites: any static file server

Option A (Python):

```bash
cd websites/raphaelguerra.com
python3 -m http.server 5173
# open http://localhost:5173
```

Option B (Node):

```bash
npx serve . -l 5173
# open http://localhost:5173
```

Optional (Tailwind build + asset hashes):

```bash
npm install
npm run build
```

Build details:

- `npm run build:css`: compiles Tailwind output to `assets/css/tailwind.css`
- `npm run build:hash`: runs `scripts/hash-assets.mjs` to hash CSS/JS assets
  and update version query strings in `index.html`

## Quality Checks

```bash
npm run check
```

- Validates locale key consistency across all files in `locales/`
- Verifies all `data-translate` and runtime `window.i18n.t(...)` keys
  exist in each locale
- Verifies `index.html` asset version hashes match file contents

```bash
npm run check:build
```

- Rebuilds Tailwind + asset hashes and fails if committed build artifacts drift
- Used in CI to guarantee reproducible static output

## Deploy

- Host on any static provider (e.g., GitHub Pages, Netlify, Vercel static).
- `_headers` is compatible with Netlify-style header configuration.

## Status & License

- Personal site; content and assets © Raphael Guerra.
