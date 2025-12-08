# raphaelguerra.com

Last updated: 2025-12-08

## Table of Contents

<!-- TOC start -->
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Local Dev](#local-dev)
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

## Deploy

- Host on any static provider (e.g., GitHub Pages, Netlify, Vercel static).
- `_headers` is compatible with Netlify-style header configuration.

## Status & License

- Personal site; content and assets © Raphael Guerra.
