document.addEventListener('DOMContentLoaded', () => {
    // ===== LOADING SCREEN =====
    const loader = document.querySelector('.loader-screen');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 800);
        });
        // Fallback: remove loader after 3s regardless
        setTimeout(() => loader.classList.add('hidden'), 3000);
    }

    // ===== PAGE TRANSITION =====
    document.body.classList.add('page-transition');

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-leave');
            setTimeout(() => { window.location.href = href; }, 300);
        });
    });

    // ===== NAVBAR SCROLL (transparent → solid) =====
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');

    function updateNavbar() {
        if (!hero) {
            // Sub-pages: always solid
            navbar.classList.add('scrolled');
            return;
        }
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ===== DARK MODE =====
    const darkBtn = document.querySelector('.dark-toggle');
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkIcon();

    if (darkBtn) {
        darkBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            updateDarkIcon();
        });
    }

    function updateDarkIcon() {
        if (!darkBtn) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        darkBtn.textContent = isDark ? '☀️' : '🌙';
        darkBtn.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo escuro');
    }

    // ===== BACK TO TOP =====
    const backTop = document.querySelector('.back-to-top');
    if (backTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backTop.classList.add('visible');
            } else {
                backTop.classList.remove('visible');
            }
        }, { passive: true });

        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== TYPEWRITER =====
    const tw = document.querySelector('.typewriter-text');
    if (tw) {
        const phrases = [
            '"A Terra não é uma herança dos nossos pais, é um empréstimo dos nossos filhos."',
            '"Plantar uma árvore é escrever o futuro."',
            '"Sem florestas, não há vida — nem presente, nem futuro."'
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;

        function typewriterTick() {
            const current = phrases[phraseIdx];
            if (!deleting) {
                tw.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx >= current.length) {
                    setTimeout(() => { deleting = true; typewriterTick(); }, 2500);
                    return;
                }
                setTimeout(typewriterTick, 45);
            } else {
                tw.textContent = current.slice(0, charIdx);
                charIdx--;
                if (charIdx < 0) {
                    deleting = false;
                    charIdx = 0;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(typewriterTick, 400);
                    return;
                }
                setTimeout(typewriterTick, 25);
            }
        }
        typewriterTick();
    }

    // ===== FADE-IN ANIMATION TARGETS =====
    const animatedSelectors = [
        '.about-grid > *',
        '.ods-content',
        '.highlight-box',
        '.cause-item',
        '.conseq-card',
        '.news-card',
        '.solution-block',
        '.sol-card',
        '.video-wrapper',
        '.conclusion-content',
        '.bib-group',
        '.fact-item',
        '.target-card',
        '.importance-item',
        '.data-bar-item',
        '.chain-step',
        '.success-card',
        '.home-card',
        '.region-card'
    ];

    document.querySelectorAll(animatedSelectors.join(',')).forEach(el => {
        el.classList.add('fade-in');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach(el => observer.observe(el));

    // ===== ANIMATED COUNTER =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.textContent.replace(/[\d.,]/g, '');
        const isDecimal = String(target).includes('.');
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.round(current).toLocaleString('pt-BR') + suffix;
            }

            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ===== PARTICLES IN HERO =====
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 35; i++) {
            const p = document.createElement('span');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (4 + Math.random() * 6) + 's';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.width = p.style.height = (3 + Math.random() * 5) + 'px';
            particlesContainer.appendChild(p);
        }
    }

    // ===== DATA BAR FILL =====
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.data-bar-fill');
                if (fill) {
                    fill.style.width = fill.dataset.width + '%';
                }
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.data-bar-item').forEach(el => barObserver.observe(el));

    // ===== REGION BAR FILL =====
    const regionBarObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.region-bar-fill');
                if (fill) fill.style.width = fill.dataset.width;
                regionBarObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.region-card').forEach(el => regionBarObs.observe(el));

    // ===== MOBILE NAV =====
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ===== ACTIVE NAV ON SCROLL =====
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    });
});
