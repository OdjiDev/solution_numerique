// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ========== MENU MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========== COMPTEURS ANIMÉS ==========
const animateCounters = () => {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const duration = 1500; // ms
        const start = performance.now();

        const updateCounter = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target + suffix;
            }
        };
        requestAnimationFrame(updateCounter);
    });
};

// ========== REVEAL AU SCROLL ==========
const revealOnScroll = () => {
    const selector = '.section-header, .service-card, .project-card, .process-step, .stack-category, .about-grid > *';
    const reveals = document.querySelectorAll(selector);
    reveals.forEach(el => el.classList.add('reveal'));

    // Si IntersectionObserver n'est pas supporté, tout afficher
    if (!('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(index * 60, 400));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
};

// ========== ANNÉE DANS LE FOOTER ==========
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ========== FORMULAIRE DE CONTACT ==========
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.textContent = 'Envoi en cours...';
        if (status) {
            status.textContent = '';
            status.className = 'form-status';
        }

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();

            if (data.success) {
                status.textContent = '✅ Merci ! Votre message a bien été envoyé. Je vous réponds sous 24h.';
                status.className = 'form-status success';
                form.reset();
            } else {
                throw new Error(data.message || 'Erreur inconnue');
            }
        } catch (err) {
            status.textContent = '❌ Erreur d\'envoi. Contactez-moi directement à contact@solutionnumerique.ml';
            status.className = 'form-status error';
            console.error('Form error:', err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
}

// ========== SMOOTH SCROLL POUR ANCRES (fallback Safari) ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== LANCEMENT ==========
window.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();

    // Compteurs déclenchés quand la section stats devient visible
    const statsSection = document.querySelector('.stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    } else if (statsSection) {
        animateCounters();
    }
});