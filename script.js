/**
 * NXSYS - Al Rawabi Dairy SuccessFactors Proposal
 * Hyper-Real Presentation Engine
 */

class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.currentSlide = 0;
        this.isAnimating = false;
        this.animationDuration = 1000;

        this.init();
    }

    init() {
        this.createIndicators();
        this.bindEvents();
        this.showPreloader();
        this.updateUI();
    }

    // ==========================================
    // Preloader
    // ==========================================
    showPreloader() {
        const preloader = document.getElementById('preloader');

        setTimeout(() => {
            preloader.classList.add('hidden');
            this.goToSlide(0);
            this.animateCounters();
        }, 2500);
    }

    // ==========================================
    // Slide Indicators
    // ==========================================
    createIndicators() {
        const container = document.getElementById('slideIndicators');

        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'slide-indicator';
            indicator.setAttribute('data-slide', i);
            indicator.addEventListener('click', () => this.goToSlide(i));
            container.appendChild(indicator);
        }
    }

    // ==========================================
    // Event Bindings
    // ==========================================
    bindEvents() {
        // Keyboard navigation only
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Navigation buttons
        document.getElementById('prevSlide').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextSlide').addEventListener('click', () => this.nextSlide());

        // Slide titles nav click handlers
        document.querySelectorAll('.slide-titles-nav .nav-item').forEach((item) => {
            item.addEventListener('click', () => {
                const navIndex = parseInt(item.dataset.nav);
                this.goToSlide(navIndex);
            });
        });
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
            case 'Enter':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
            case 'Backspace':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }

    // ==========================================
    // Slide Navigation
    // ==========================================
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        if (index < 0 || index >= this.totalSlides) return;

        this.isAnimating = true;

        // Remove classes from all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');

            if (i < index) {
                slide.classList.add('prev');
            } else if (i > index) {
                slide.classList.add('next');
            }
        });

        // Activate current slide
        this.slides[index].classList.add('active');
        this.currentSlide = index;

        // Update UI
        this.updateUI();

        // Animate counters on this slide
        this.animateCountersOnSlide(index);

        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
        }, this.animationDuration);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    // ==========================================
    // UI Updates
    // ==========================================
    updateUI() {
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;

        // Update slide counter
        const counter = document.getElementById('slideCounter');
        counter.querySelector('.current').textContent = String(this.currentSlide + 1).padStart(2, '0');

        // Update indicators
        document.querySelectorAll('.slide-indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentSlide);
        });

        // Update nav buttons
        document.getElementById('prevSlide').disabled = this.currentSlide === 0;
        document.getElementById('nextSlide').disabled = this.currentSlide === this.totalSlides - 1;

        // Update slide titles nav
        document.querySelectorAll('.slide-titles-nav .nav-item').forEach((item) => {
            const navIndex = parseInt(item.dataset.nav);
            item.classList.toggle('active', navIndex === this.currentSlide);

            // Scroll active item into view
            if (navIndex === this.currentSlide) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // ==========================================
    // Counter Animations
    // ==========================================
    animateCounters() {
        // Initial counters on first load
        this.animateCountersOnSlide(0);
    }

    animateCountersOnSlide(slideIndex) {
        const slide = this.slides[slideIndex];
        const counters = slide.querySelectorAll('[data-count]');

        counters.forEach(counter => {
            // Check if already animated
            if (counter.dataset.animated === 'true') return;

            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = this.formatNumber(Math.floor(current));
            }, stepDuration);

            counter.dataset.animated = 'true';
        });
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // ==========================================
    // Fullscreen
    // ==========================================
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// ==========================================
// Initialize on DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();

    // Console branding
    console.log(`
%c NXSYS %c Al Rawabi Dairy - SuccessFactors Proposal
%c Hyper-Real Presentation Engine

%c Navigation:
  Arrow Keys         -  Navigate slides
  Space / Enter      -  Next slide
  Page Up/Down       -  Navigate slides
  Home / End         -  First / Last slide
  F                  -  Toggle fullscreen

%c UAE's First AI-Powered SAP Integrator
`,
    'background: #C8102E; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 4px 0 0 4px;',
    'background: #1a1a1a; color: white; font-size: 14px; padding: 10px 20px; border-radius: 0 4px 4px 0;',
    'color: #666; font-size: 11px;',
    'color: #C8102E; font-size: 11px;',
    'color: #888; font-size: 10px; font-style: italic;'
    );

    // Expose presentation instance for debugging
    window.presentation = presentation;
});

// ==========================================
// Prevent accidental navigation
// ==========================================
window.addEventListener('beforeunload', (e) => {
    // Uncomment to show warning when leaving
    // e.preventDefault();
    // e.returnValue = '';
});

// ==========================================
// Handle visibility change (pause/resume)
// ==========================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Presentation hidden
    } else {
        // Presentation visible again
    }
});
