/**
 * Main JavaScript functionality for Raphael Guerra's website
 * Handles mobile menu, smooth scrolling, and other interactive features
 */

class MainApp {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the main application
     */
    initialize() {
        if (this.isInitialized) return;

        this.initializeMobileMenu();
        this.initializeSmoothScrolling();
        this.initializeScrollEffects();
        this.initializeContactForm();
        this.initializeCopyEmail();
        this.initializeProjectSorting();
        
        this.isInitialized = true;
    }

    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                menuBtn.setAttribute('aria-expanded', String(!isHidden));
            });

            // Close menu when a link is clicked
            const menuLinks = mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                });
            });

            // Prevent outside-click handler from firing when interacting inside the menu
            mobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
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
     * Initialize contact form functionality
     */
    initializeContactForm() {
        const contactForm = document.querySelector('#contact form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
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
     * Sort project cards by creation date (newest first)
     */
    initializeProjectSorting() {
        const projectSection = document.getElementById('projects');
        if (!projectSection) return;

        const projectGrid = projectSection.querySelector('.grid');
        if (!projectGrid) return;

        const projectCards = Array.from(projectGrid.querySelectorAll(':scope > .gradient-border'));
        if (projectCards.length === 0) return;

        const createdAtByProjectKey = {
            'project-ez-match-title': '2026-02-19T16:03:08Z',
            'project-ez-order-title': '2026-02-07T12:54:53Z',
            'project-stellar-title': '2026-01-22T02:11:23Z',
            'project-eco-game-title': '2026-01-21T18:12:14Z',
            'project-pos-title': '2025-09-21T23:32:39Z',
            'project-weight-title': '2025-09-05T15:27:43Z',
            'project-next-image-title': '2025-08-28T20:32:43Z',
            'project-ledger-title': '2025-08-27T21:14:39Z',
            'project-vison-title': '2025-08-27T14:43:52Z',
            'project-converter-title': '2025-08-26T19:04:15Z',
            'project-txtrefine-title': '2025-08-23T21:09:55Z',
            'project-transcriber-title': '2025-08-23T19:35:46Z',
            'project-eco-explorer-title': '2025-06-30T13:15:43Z',
            'project-eco-website-title': '2025-06-29T13:39:57Z',
        };

        const cardIndexByNode = new Map(projectCards.map((card, index) => [card, index]));
        const getCreatedAt = (card) => {
            const titleNode = card.querySelector('h4[data-translate]');
            const projectKey = titleNode?.getAttribute('data-translate');
            if (!projectKey) return null;

            const createdAt = createdAtByProjectKey[projectKey];
            if (!createdAt) return null;

            const timestamp = Date.parse(createdAt);
            return Number.isNaN(timestamp) ? null : timestamp;
        };

        const sortedCards = [...projectCards].sort((a, b) => {
            const dateA = getCreatedAt(a);
            const dateB = getCreatedAt(b);

            if (dateA === null && dateB === null) {
                return (cardIndexByNode.get(a) ?? 0) - (cardIndexByNode.get(b) ?? 0);
            }
            if (dateA === null) return 1;
            if (dateB === null) return -1;

            return dateB - dateA;
        });

        sortedCards.forEach(card => projectGrid.appendChild(card));
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
     * Handle contact form submission
     */
    async handleContactForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
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
