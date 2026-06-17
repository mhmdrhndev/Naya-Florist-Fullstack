// Naya Florist Main Layout & Interactions

document.addEventListener('DOMContentLoaded', () => {
    setupStickyHeader();
    setupMobileMenu();
    setupScrollReveal();
    setupCareGuide();
    setupFallingPetals();
});

// Note: Cart system removed. WhatsApp consultation handled by js/whatsapp.js

// 1. Sticky Navigation Scroll Effect
function setupStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    const nav = header.querySelector('nav');
    let isSticky = false;

    const toggleHeader = () => {
        const shouldBeSticky = window.scrollY > 40;
        if (shouldBeSticky === isSticky) return;

        isSticky = shouldBeSticky;
        if (isSticky) {
            header.classList.add('shadow-md', 'bg-surface/95', 'backdrop-blur-md');
            header.classList.remove('shadow-sm');
            if (nav) {
                nav.classList.add('py-2');
                nav.classList.remove('py-stack-md');
            }
        } else {
            header.classList.remove('shadow-md', 'bg-surface/95');
            header.classList.add('shadow-sm');
            if (nav) {
                nav.classList.remove('py-2');
                nav.classList.add('py-stack-md');
            }
        }
    };

    window.addEventListener('scroll', toggleHeader, { passive: true });
    // Initial run in case page loads pre-scrolled
    toggleHeader();
}

// 2. Dynamic Mobile Menu Injection & Trigger Setup
function setupMobileMenu() {
    // Look for mobile menu toggle button
    const menuBtn = document.querySelector('[data-icon="menu"]');
    if (!menuBtn) return;
    
    const trigger = menuBtn.tagName === 'SPAN' ? menuBtn.parentElement : menuBtn;
    trigger.classList.add('cursor-pointer');

    // Create backdrop and mobile menu element
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'mobile-menu-overlay';
    menuOverlay.className = 'fixed inset-0 z-[45] bg-on-background/30 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 hidden';
    document.body.appendChild(menuOverlay);

    const mobileMenu = document.createElement('aside');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'fixed inset-y-0 left-0 w-[280px] bg-background text-on-surface shadow-2xl z-50 p-6 flex flex-col justify-between transform -translate-x-full transition-transform duration-300 ease-in-out border-r border-outline-variant/30';
    
    mobileMenu.innerHTML = `
        <div>
            <div class="flex justify-between items-center mb-10">
                <span class="font-display-lg text-2xl text-primary font-bold tracking-tight">Naya Florist</span>
                <button id="close-mobile-menu" class="p-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span class="material-symbols-outlined" data-icon="close">close</span>
                </button>
            </div>
            <nav class="flex flex-col gap-6 text-lg font-medium">
                <a href="index.html" class="hover:text-primary transition-colors py-2 border-b border-outline-variant/10">Home</a>
                <a href="collections.html" class="hover:text-primary transition-colors py-2 border-b border-outline-variant/10">Collections</a>
                <a href="about.html" class="hover:text-primary transition-colors py-2 border-b border-outline-variant/10">Our Story</a>
            </nav>
        </div>
        <div class="space-y-4">
            <div class="flex gap-4">
                <a href="https://www.instagram.com/naya_florist.tangerang/" target="_blank" rel="noopener noreferrer" class="text-primary hover:opacity-80 underline text-sm font-semibold">Instagram</a>
            </div>
            <p class="text-xs text-on-surface-variant">© 2026 Naya Florist. Eternal Bloom.</p>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);

    // Event hooks
    const toggleMobileMenu = () => {
        const isOpen = !mobileMenu.classList.contains('-translate-x-full');
        if (isOpen) {
            mobileMenu.classList.add('-translate-x-full');
            menuOverlay.classList.add('opacity-0', 'pointer-events-none');
            menuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            setTimeout(() => {
                if (mobileMenu.classList.contains('-translate-x-full')) {
                    menuOverlay.classList.add('hidden');
                }
            }, 300);
            document.body.style.overflow = '';
        } else {
            menuOverlay.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('-translate-x-full');
                menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
                menuOverlay.classList.add('opacity-100', 'pointer-events-auto');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    };

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    document.getElementById('close-mobile-menu').addEventListener('click', toggleMobileMenu);
    menuOverlay.addEventListener('click', toggleMobileMenu);
}

// 3. Scroll Reveal Animations
function setupScrollReveal() {
    const reveals = document.querySelectorAll('.opacity-0');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.remove('opacity-0', 'translate-y-4', 'translate-y-8');
                el.classList.add('opacity-100', 'translate-y-0');
                el.style.transition = 'all 1.0s cubic-bezier(0.16, 1, 0.3, 1)';
                obs.unobserve(el);
            }
        });
    }, {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// 4. Care Guide Modal Overlay Setup & Controls
function openCareGuide() {
    const modal = document.getElementById('care-guide-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        const contentBox = modal.querySelector('div');
        if (contentBox) {
            contentBox.classList.remove('scale-95');
            contentBox.classList.add('scale-100');
        }
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeCareGuide() {
    const modal = document.getElementById('care-guide-modal');
    if (!modal) return;
    
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    const contentBox = modal.querySelector('div');
    if (contentBox) {
        contentBox.classList.remove('scale-100');
        contentBox.classList.add('scale-95');
    }
    
    setTimeout(() => {
        if (modal.classList.contains('opacity-0')) {
            modal.classList.add('hidden');
        }
    }, 300);
    document.body.style.overflow = '';
}

function setupCareGuide() {
    if (document.getElementById('care-guide-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'care-guide-modal';
    modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 hidden';
    
    modal.innerHTML = `
        <div class="bg-background text-on-surface max-w-lg w-full rounded-lg shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col transform scale-95 transition-all duration-300">
            <!-- Header -->
            <div class="px-6 py-5 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
                <h3 class="font-display-lg text-xl font-bold text-primary">Flower Care Guide / Panduan</h3>
                <button id="close-care-guide-btn" class="text-on-surface-variant hover:text-primary transition-colors p-1 focus:outline-none" aria-label="Close Care Guide">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>
            <!-- Content -->
            <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh] text-sm leading-relaxed font-body-md text-on-surface-variant">
                <!-- Tip 1 -->
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-2xl flex-shrink-0" data-icon="cloud_off">cloud_off</span>
                    <div>
                        <h4 class="font-headline-sm text-sm font-bold text-on-surface mb-1">Keep Dry / Hindari Air</h4>
                        <p>Keep your everlasting arrangement away from water and humid spaces. Dried flowers are especially sensitive to moisture which can cause mildew.</p>
                    </div>
                </div>
                <!-- Tip 2 -->
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-2xl flex-shrink-0" data-icon="wb_sunny">wb_sunny</span>
                    <div>
                        <h4 class="font-headline-sm text-sm font-bold text-on-surface mb-1">Avoid Direct Sun / Hindari Matahari Langsung</h4>
                        <p>Place your creations in indirect light. Prolonged exposure to intense sunlight can fade the colors of artificial silk petals and dried foliage.</p>
                    </div>
                </div>
                <!-- Tip 3 -->
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-2xl flex-shrink-0" data-icon="cleaning_services">cleaning_services</span>
                    <div>
                        <h4 class="font-headline-sm text-sm font-bold text-on-surface mb-1">Gentle Cleaning / Pembersihan Berkala</h4>
                        <p>Use a soft duster, paintbrush, or hairdryer on a cool/low setting to gently remove dust from silk and dried flowers every few months.</p>
                    </div>
                </div>
                <!-- Tip 4 -->
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-2xl flex-shrink-0" data-icon="settings_backup_restore">settings_backup_restore</span>
                    <div>
                        <h4 class="font-headline-sm text-sm font-bold text-on-surface mb-1">Reshaping / Merapikan Kelopak</h4>
                        <p>If silk flower heads become misshapen during transit or display, you can gently reshape the petals by hand or use a clothing steamer from a safe distance.</p>
                    </div>
                </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
                <button id="close-care-guide-btn-footer" class="bg-primary text-on-primary hover:bg-transparent hover:text-primary border border-primary px-5 py-2 font-label-caps text-xs uppercase tracking-widest font-bold rounded transition-all focus:outline-none">
                    Close / Tutup
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Bind close listeners
    document.getElementById('close-care-guide-btn').addEventListener('click', closeCareGuide);
    document.getElementById('close-care-guide-btn-footer').addEventListener('click', closeCareGuide);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCareGuide();
    });
    
    // Bind triggers to Care Guide links across the page
    const bindTriggers = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.textContent.trim().toLowerCase().includes('care guide')) {
                link.href = 'javascript:void(0)';
                // Prevent duplicate listeners if bindTriggers runs multiple times
                link.removeEventListener('click', handleCareGuideClick);
                link.addEventListener('click', handleCareGuideClick);
            }
        });
    };
    
    function handleCareGuideClick(e) {
        e.preventDefault();
        openCareGuide();
    }
    
    bindTriggers();
    
    // Also run search periodically or when DOM mutations occur just in case
    const observer = new MutationObserver(bindTriggers);
    observer.observe(document.body, { childList: true, subtree: true });
}

// 5. Falling Petals Generator
function setupFallingPetals() {
    const container = document.getElementById('petals-canvas');
    if (!container) return;

    const petalCount = 12; // Moderate count to keep GPU load low
    for (let i = 0; i < petalCount; i++) {
        createPetal(container);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Randomize dimensions
    const size = Math.random() * 14 + 8; // 8px to 22px
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    // Randomize horizontal/vertical start placements
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `-${Math.random() * 50 + 20}px`;
    
    // Randomize animation properties
    const duration = Math.random() * 12 + 10; // 10s to 22s
    const delay = Math.random() * 10; // 0s to 10s delay
    petal.style.animation = `fall ${duration}s linear ${delay}s infinite`;
    
    // Depth simulation (blur small petals)
    if (size < 12) {
        petal.style.filter = 'blur(1.5px)';
        petal.style.opacity = '0.6';
    } else {
        petal.style.filter = 'none';
        petal.style.opacity = `${Math.random() * 0.3 + 0.6}`; // 0.6 to 0.9
    }
    
    container.appendChild(petal);
}

