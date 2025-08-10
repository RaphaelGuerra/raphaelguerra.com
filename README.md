# Raphael Guerra - Personal Website

A modern, responsive personal website showcasing Raphael Guerra's professional experience, projects, and skills. Features a multi-language system supporting English, Portuguese, French, and Spanish.

## 🌐 Multi-Language Support

The website supports four languages:
- **English (EN)** - Default language
- **Portuguese (PT)** - Português
- **French (FR)** - Français  
- **Spanish (ES)** - Español

### Language Switching
- Use the dropdown selector in the header
- Preference saved in localStorage
- URL parameter support: `?lang=pt|fr|es`
- Automatic browser language detection with fallback to English

## 📁 Project Structure

```
raphaelguerra.com/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── main.css          # Styles
│   └── js/
│       ├── i18n.js           # i18n manager (loads /locales/*.json)
│       ├── language-switcher.js
│       └── main.js           # UI behavior
├── locales/                  # JSON translations
│   ├── en.json
│   ├── pt.json
│   ├── fr.json
│   └── es.json
├── CNAME                     # Custom domain (GitHub Pages)
└── README.md
```

## 🚀 Getting Started

1. Clone the repository
2. Serve locally with a static server (needed for JSON fetch):
   - Python: `python3 -m http.server 5173`
   - Node: `npx http-server -p 5173`
3. Open `http://localhost:5173/`
4. Test language switching via the dropdown or `?lang=pt|fr|es`

## 🎨 Customization

- **Content**: Update text in `locales/*.json` (add `meta-description` for SEO)
- **Layout**: Edit `index.html`
- **Styles**: Edit `assets/css/main.css`
- **Behavior**: Update `assets/js/*.js`

---

**Built with**: HTML5, CSS3, JavaScript, Tailwind CSS  
**Maintained by**: Raphael Guerra 