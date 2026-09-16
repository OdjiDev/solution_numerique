// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ========== MENU MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== COMPTEURS ANIMÉS ==========
const animateCounters = () => {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 60;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target + suffix;
            }
        };
        updateCounter();
    });
};

// ========== REVEAL AU SCROLL ==========
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.section-header, .service-card, .project-card, .process-step, .stack-category');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
};

// ========== ANNÉE DANS LE FOOTER ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========== LANCEMENT ==========
window.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();

    // Compteurs déclenchés quand la section stats devient visible
    const statsSection = document.querySelector('.stats');
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
});