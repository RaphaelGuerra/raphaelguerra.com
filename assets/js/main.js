/**
 * Main JavaScript functionality for Raphael Guerra's website
 * Handles mobile menu and other interactive features
 */

class MainApp {
    constructor() {
        this.isInitialized = false;
        this.chatbotSectionId = 'chatbot';
        this.chatbotShell = null;
        this.chatbotEmbed = null;
        this.chatbotLoaded = false;
        this.chatbotReady = false;
        this.chatbotReadyObserver = null;
        this.chatbotReadyTimer = null;
        this.chatbotLoadObserver = null;
    }

    /**
     * Initialize the main application
     */
    initialize() {
        if (this.isInitialized) return;

        this.initializeMobileMenu();
        this.initializeChatbotShell();
        this.initializeScrollEffects();
        this.initializeCopyEmail();
        
        this.isInitialized = true;
    }

    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn && mobileMenu) {
            const closeMobileMenu = () => {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            };

            menuBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                menuBtn.setAttribute('aria-expanded', String(!isHidden));
            });

            // Close menu only for in-page section navigation links (not language links).
            const sectionLinks = mobileMenu.querySelectorAll('a[href^="#"]:not([href="#"])');
            sectionLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMobileMenu();
                });
            });

            // Prevent outside-click handler from firing when interacting inside the menu
            mobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    closeMobileMenu();
                }
            });
        }
    }

    /**
     * Initialize chatbot shell and lazy-load triggers
     */
    initializeChatbotShell() {
        this.chatbotShell = document.querySelector('[data-chatbot-shell]');
        this.chatbotEmbed = this.chatbotShell?.querySelector('gradio-app');
        if (!this.chatbotShell || !this.chatbotEmbed) return;

        this.initializeChatbotLazyLoad();
    }

    initializeChatbotLazyLoad() {
        const initialHash = window.location.hash;
        const shouldDeferVisibilityObserver = Boolean(initialHash) && !this.isChatbotHash(initialHash);

        const loadFromChatbotHash = () => {
            if (this.isChatbotHash(window.location.hash)) {
                this.loadChatbot();
            }
        };

        document.addEventListener('click', (event) => {
            const selector = `a[href="#${this.chatbotSectionId}"]`;
            const link = event.target.closest(selector);
            if (!link) return;
            this.loadChatbot();
        }, true);

        window.addEventListener('hashchange', loadFromChatbotHash);
        loadFromChatbotHash();

        if (shouldDeferVisibilityObserver) {
            window.setTimeout(() => this.startChatbotVisibilityObserver(), 1500);
            return;
        }

        this.startChatbotVisibilityObserver();
    }

    startChatbotVisibilityObserver() {
        if (this.chatbotLoaded || this.chatbotLoadObserver) return;

        if (!('IntersectionObserver' in window)) {
            this.loadChatbot();
            return;
        }

        this.chatbotLoadObserver = new IntersectionObserver((entries) => {
            const shouldLoad = entries.some((entry) => entry.isIntersecting);
            if (!shouldLoad) return;
            this.loadChatbot();
            this.chatbotLoadObserver?.disconnect();
            this.chatbotLoadObserver = null;
        }, { rootMargin: '600px 0px', threshold: 0 });

        this.chatbotLoadObserver.observe(this.chatbotShell);
    }

    isChatbotHash(rawHash) {
        if (typeof rawHash !== 'string' || !rawHash.startsWith('#')) return false;

        try {
            return decodeURIComponent(rawHash.slice(1)).trim() === this.chatbotSectionId;
        } catch (error) {
            return rawHash.slice(1).trim() === this.chatbotSectionId;
        }
    }

    loadChatbot() {
        if (this.chatbotLoaded || !this.chatbotEmbed) return;

        const source = this.chatbotEmbed.getAttribute('data-src');
        if (!source) return;

        this.chatbotLoaded = true;
        this.chatbotEmbed.setAttribute('src', source);
        this.activateChatbotReadyMonitoring();
    }

    activateChatbotReadyMonitoring() {
        if (this.chatbotReady || !this.chatbotEmbed || !this.chatbotShell) return;

        const markReady = () => {
            if (this.chatbotReady) return;
            this.chatbotReady = true;
            this.chatbotShell.classList.add('is-ready');
            this.chatbotEmbed.setAttribute('aria-busy', 'false');
            this.chatbotReadyObserver?.disconnect();
            this.chatbotReadyObserver = null;
            if (this.chatbotReadyTimer) {
                clearTimeout(this.chatbotReadyTimer);
                this.chatbotReadyTimer = null;
            }
        };

        const detectEmbed = () => {
            if (
                this.chatbotEmbed.querySelector('iframe') ||
                this.chatbotEmbed.shadowRoot?.querySelector('iframe')
            ) {
                markReady();
            }
        };

        this.chatbotEmbed.setAttribute('aria-busy', 'true');
        this.chatbotReadyObserver = new MutationObserver(detectEmbed);
        this.chatbotReadyObserver.observe(this.chatbotEmbed, { childList: true, subtree: true });

        ['load', 'ready', 'gradio-ready', 'gradio-loaded'].forEach((eventName) => {
            this.chatbotEmbed.addEventListener(eventName, markReady, { once: true });
        });

        this.chatbotReadyTimer = window.setTimeout(markReady, 6000);
        detectEmbed();
    }

    /**
     * Initialize scroll effects
     */
    initializeScrollEffects() {
        // Add scroll-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Initialize copy-to-clipboard for email CTA
     */
    initializeCopyEmail() {
        const copyButton = document.querySelector('[data-copy-email]');
        if (!copyButton) return;

        copyButton.addEventListener('click', async () => {
            const email = copyButton.getAttribute('data-copy-email');
            if (!email) return;

            const copiedMessage = window.i18n?.t('contact-copied') || 'Email copied to clipboard.';
            const errorMessage = window.i18n?.t('contact-copy-failed') || 'Unable to copy email.';

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                    this.showNotification(copiedMessage, 'success');
                    return;
                }

                if (this.fallbackCopyEmail(email)) {
                    this.showNotification(copiedMessage, 'success');
                } else {
                    this.showNotification(errorMessage, 'error');
                }
            } catch (error) {
                if (this.fallbackCopyEmail(email)) {
                    this.showNotification(copiedMessage, 'success');
                } else {
                    this.showNotification(errorMessage, 'error');
                }
            }
        });
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyEmail(email) {
        const input = document.createElement('input');
        input.value = email;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (error) {
            success = false;
        }

        document.body.removeChild(input);
        return success;
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    /**
     * Handle URL parameters on page load
     */
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && window.i18n) {
            window.i18n.setLanguage(langParam);
        }
    }
}

// Create global instance
window.mainApp = new MainApp();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp.initialize();
    window.mainApp.handleURLParameters();
}); 
