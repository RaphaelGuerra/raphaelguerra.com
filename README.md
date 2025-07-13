# Raphael Guerra - Personal Website

A modern, responsive personal website showcasing Raphael Guerra's professional experience, projects, and skills. Features a multi-language system supporting English, Portuguese, French, and Spanish.

## 🌐 Multi-Language Support

The website supports four languages:
- **English (EN)** - Default language
- **Portuguese (PT)** - Português
- **French (FR)** - Français  
- **Spanish (ES)** - Español

### Language Switching
- Click on the language codes in the navigation (EN/PT/FR/ES)
- Language preference is saved in localStorage
- Automatic language detection and persistence

## 📁 Project Structure

```
raphaelguerra.com/
├── index.html              # Main HTML file (351 lines)
├── assets/
│   ├── js/
│   │   ├── translations.js      # All language translations (260 lines)
│   │   └── language-switcher.js # Language switching functionality (103 lines)
│   └── css/                     # CSS files (future use)
└── README.md
```

## 🏗️ Architecture Benefits

### **Separated Approach (Current Implementation)**

**✅ Advantages:**
- **Modularity**: Each concern is in its own file
- **Maintainability**: Easy to find and modify specific functionality
- **Collaboration**: Multiple developers can work on different files
- **Version Control**: Better diff tracking and conflict resolution
- **Reusability**: Translation data can be reused across projects
- **Testing**: Easier to unit test individual components
- **Performance**: Better caching (separate files can be cached independently)
- **Scalability**: Easy to add new languages or features

**❌ Disadvantages:**
- **Multiple HTTP requests**: Additional network calls for external files
- **Dependencies**: Files must be loaded in correct order
- **Setup complexity**: Need to manage file structure

## 🔧 Technical Implementation

### Translation System
- **Data Structure**: Organized by language → section → key
- **HTML Integration**: Uses `data-translate` attributes
- **Dynamic Updates**: Real-time language switching without page reload
- **Persistence**: User's language choice is remembered

### Key Features
- **Responsive Design**: Works on desktop and mobile
- **Smooth Transitions**: CSS animations and hover effects
- **Professional UI**: Modern design with gradient effects
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🚀 Getting Started

1. **Clone the repository**
2. **Open `index.html`** in a web browser
3. **Test language switching** by clicking EN/PT/FR/ES in the navigation

## 📝 Adding New Content

### To add new translatable content:
1. Add `data-translate="unique-key"` to HTML elements
2. Add translations to `assets/js/translations.js` for all languages
3. The language switcher will automatically handle the new content

### To add a new language:
1. Add the new language object to `translations.js`
2. Add language selector links to the HTML navigation
3. Update the language switcher logic if needed

## 🎨 Customization

- **Colors**: Modify CSS variables in the `<style>` section
- **Content**: Update translations in `assets/js/translations.js`
- **Layout**: Edit the HTML structure in `index.html`
- **Functionality**: Modify `assets/js/language-switcher.js`

## 📊 Performance

- **File Size**: HTML reduced from 687 to 351 lines (49% reduction)
- **Modularity**: Translation data separated into dedicated file
- **Caching**: External JS files can be cached independently
- **Loading**: Non-blocking script loading

## 🔮 Future Enhancements

- Add more languages
- Implement RTL support for Arabic/Hebrew
- Add language detection based on browser settings
- Create translation management interface
- Add animation effects for language transitions

---

**Built with**: HTML5, CSS3, JavaScript, Tailwind CSS  
**Inspired by**: Phaelix AI design patterns  
**Maintained by**: Raphael Guerra 