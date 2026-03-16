/**
 * Main JavaScript functionality for Raphael Guerra's website
 * Handles mobile menu and other interactive features
 */

class MainApp {
    constructor() {
        this.isInitialized = false;
        this.chatbotSectionId = 'chatbot';
        this.pendingNavigationTarget = null;
        this.pendingNavigationExpiresAt = 0;
        this.navigationCorrectionTimer = null;
        this.chatbotShell = null;
        this.chatbotEmbed = null;
    }

    /**
     * Initialize the main application
     */
    initialize() {
        if (this.isInitialized) return;

        this.initializeInPageNavigationTracking();
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
     * Track in-page navigation so chatbot autofocus cannot override section selection
     */
    initializeInPageNavigationTracking() {
        this.trackNavigationTarget(window.location.hash);

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]:not([href="#"])');
            if (!link) return;
            this.trackNavigationTarget(link.getAttribute('href'));
        }, true);

        window.addEventListener('hashchange', () => {
            this.trackNavigationTarget(window.location.hash);
        });

        const settlePendingTarget = () => this.clearPendingTargetIfSettled();
        window.addEventListener('scroll', settlePendingTarget, { passive: true });
        window.addEventListener('resize', settlePendingTarget);
    }

    /**
     * Stabilize chatbot area while external embed initializes
     */
    initializeChatbotShell() {
        this.chatbotShell = document.querySelector('[data-chatbot-shell]');
        this.chatbotEmbed = this.chatbotShell?.querySelector('gradio-app');
        if (!this.chatbotShell || !this.chatbotEmbed) return;

        let ready = false;
        let fallbackTimer = null;
        const observer = new MutationObserver(() => {
            if (
                this.chatbotEmbed.querySelector('iframe') ||
                this.chatbotEmbed.shadowRoot?.querySelector('iframe')
            ) {
                markReady();
            }
        });

        const markReady = () => {
            if (ready) return;
            ready = true;
            this.chatbotShell.classList.add('is-ready');
            this.chatbotEmbed.setAttribute('aria-busy', 'false');
            this.restorePendingNavigationTarget();
            observer.disconnect();
            if (fallbackTimer) {
                clearTimeout(fallbackTimer);
                fallbackTimer = null;
            }
        };

        this.chatbotEmbed.setAttribute('aria-busy', 'true');
        observer.observe(this.chatbotEmbed, { childList: true, subtree: true });

        ['load', 'ready', 'gradio-ready', 'gradio-loaded'].forEach(eventName => {
            this.chatbotEmbed.addEventListener(eventName, markReady, { once: true });
        });

        document.addEventListener('focusin', (event) => {
            if (!this.chatbotShell?.contains(event.target)) return;
            this.restorePendingNavigationTarget();
        }, true);

        fallbackTimer = window.setTimeout(markReady, 6000);
    }

    /**
     * Normalize hash values and track the current intended in-page destination
     */
    trackNavigationTarget(rawHash) {
        const targetId = this.getHashTargetId(rawHash);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        if (this.isChatbotTarget(targetId)) {
            this.clearPendingNavigationTarget();
            return;
        }

        this.pendingNavigationTarget = targetId;
        this.pendingNavigationExpiresAt = Date.now() + 8000;
    }

    getHashTargetId(rawHash) {
        if (typeof rawHash !== 'string' || !rawHash.startsWith('#')) return null;

        try {
            const targetId = decodeURIComponent(rawHash.slice(1)).trim();
            return targetId || null;
        } catch (error) {
            return rawHash.slice(1).trim() || null;
        }
    }

    isChatbotTarget(targetId) {
        return targetId === this.chatbotSectionId;
    }

    clearPendingNavigationTarget() {
        this.pendingNavigationTarget = null;
        this.pendingNavigationExpiresAt = 0;

        if (!this.navigationCorrectionTimer) return;
        clearTimeout(this.navigationCorrectionTimer);
        this.navigationCorrectionTimer = null;
    }

    clearPendingTargetIfSettled() {
        const targetId = this.pendingNavigationTarget;
        if (!targetId) return;

        if (Date.now() > this.pendingNavigationExpiresAt) {
            this.clearPendingNavigationTarget();
            return;
        }

        const target = document.getElementById(targetId);
        if (!target) {
            this.clearPendingNavigationTarget();
            return;
        }

        if (this.isElementAlignedWithViewport(target)) {
            this.clearPendingNavigationTarget();
        }
    }

    isElementAlignedWithViewport(element) {
        const rect = element.getBoundingClientRect();
        const headerOffset = this.getHeaderOffset();
        const tolerance = 36;

        const topAligned = Math.abs(rect.top - headerOffset) <= tolerance;
        const passesHeader = rect.top <= headerOffset + tolerance && rect.bottom > headerOffset + 16;
        return topAligned || passesHeader;
    }

    getHeaderOffset() {
        const rootStyles = getComputedStyle(document.documentElement);
        const scrollPaddingTop = parseFloat(rootStyles.scrollPaddingTop);
        if (!Number.isNaN(scrollPaddingTop) && scrollPaddingTop > 0) return scrollPaddingTop;

        const header = document.querySelector('header');
        return header?.getBoundingClientRect().height || 0;
    }

    restorePendingNavigationTarget() {
        const targetId = this.pendingNavigationTarget;
        if (!targetId) return;

        if (Date.now() > this.pendingNavigationExpiresAt) {
            this.clearPendingNavigationTarget();
            return;
        }

        const target = document.getElementById(targetId);
        if (!target) {
            this.clearPendingNavigationTarget();
            return;
        }

        if (this.isElementAlignedWithViewport(target)) {
            this.clearPendingNavigationTarget();
            return;
        }

        if (this.chatbotShell?.contains(document.activeElement)) {
            document.activeElement.blur?.();
        }

        if (this.navigationCorrectionTimer) return;
        this.navigationCorrectionTimer = window.setTimeout(() => {
            this.navigationCorrectionTimer = null;
            target.scrollIntoView({ block: 'start', inline: 'nearest' });
            this.clearPendingTargetIfSettled();
        }, 60);
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
