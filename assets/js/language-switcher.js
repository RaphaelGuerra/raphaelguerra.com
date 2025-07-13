// Language switcher functionality for Raphael Guerra's website

// Language switching functionality
function switchLanguage(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language selector active state
    updateLanguageSelector(lang);
    
    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

function updateLanguageSelector(activeLang) {
    // Update desktop language selector
    const desktopLangLinks = document.querySelectorAll('.desktop-lang-selector a');
    desktopLangLinks.forEach(link => {
        const lang = link.getAttribute('data-lang');
        if (lang === activeLang) {
            link.classList.add('font-bold', 'text-white');
            link.classList.remove('text-slate-400', 'hover:text-white');
        } else {
            link.classList.remove('font-bold', 'text-white');
            link.classList.add('text-slate-400', 'hover:text-white');
        }
    });
    
    // Update mobile language selector
    const mobileLangLinks = document.querySelectorAll('.mobile-lang-selector a');
    mobileLangLinks.forEach(link => {
        const lang = link.getAttribute('data-lang');
        if (lang === activeLang) {
            link.classList.add('font-bold', 'text-white');
            link.classList.remove('text-slate-400', 'hover:text-white');
        } else {
            link.classList.remove('font-bold', 'text-white');
            link.classList.add('text-slate-400', 'hover:text-white');
        }
    });
}

// Initialize language system
function initializeLanguageSystem() {
    // Get saved language preference or default to English
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(savedLang);
    
    // Add click event listeners to language selector links
    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        const menuLinks = menu.getElementsByTagName('a');
        for (let i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSystem();
    initializeMobileMenu();
});

// Export functions for potential use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchLanguage,
        updateLanguageSelector,
        initializeLanguageSystem,
        initializeMobileMenu
    };
} 