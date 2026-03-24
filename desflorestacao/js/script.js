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

    // ===== SITE STATISTICS TRACKING =====
    (function () {
        const STORAGE_KEY = 'siteStats';

        function getStats() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;
                return JSON.parse(raw);
            } catch { return null; }
        }

        function initStats() {
            return {
                totalVisits: 0,
                totalPages: 0,
                firstVisit: new Date().toISOString(),
                pageCounts: {},
                dailyVisits: {},
                sessionTimes: []
            };
        }

        function saveStats(stats) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        }

        // Determine page name from URL
        const path = window.location.pathname;
        const pageName = path.includes('index.html') || path.endsWith('/') || path.endsWith('/desflorestacao/')
            ? 'Início'
            : {
                'sobre.html': 'Sobre',
                'florestas.html': 'Florestas',
                'causas.html': 'Causas',
                'noticias.html': 'Notícias',
                'solucoes.html': 'Soluções',
                'conclusao.html': 'Conclusão',
                'estatisticas.html': 'Estatísticas',
                'sitemap.html': 'Mapa do Site'
            }[path.split('/').pop()] || path.split('/').pop();

        let stats = getStats() || initStats();

        // Track page view
        stats.totalPages++;
        stats.pageCounts[pageName] = (stats.pageCounts[pageName] || 0) + 1;

        // Track daily visit (unique per day)
        const today = new Date().toISOString().slice(0, 10);
        if (!sessionStorage.getItem('visitCounted')) {
            stats.totalVisits++;
            stats.dailyVisits[today] = (stats.dailyVisits[today] || 0) + 1;
            sessionStorage.setItem('visitCounted', '1');
        }

        // Track session pages
        const sessionPages = parseInt(sessionStorage.getItem('sessionPages') || '0', 10) + 1;
        sessionStorage.setItem('sessionPages', String(sessionPages));

        // Session start time
        if (!sessionStorage.getItem('sessionStart')) {
            sessionStorage.setItem('sessionStart', String(Date.now()));
        }

        // Save session time on unload
        window.addEventListener('beforeunload', () => {
            const start = parseInt(sessionStorage.getItem('sessionStart') || '0', 10);
            if (start) {
                const duration = Math.round((Date.now() - start) / 1000);
                const s = getStats() || initStats();
                s.sessionTimes.push(duration);
                // Keep only last 50 sessions
                if (s.sessionTimes.length > 50) s.sessionTimes = s.sessionTimes.slice(-50);
                saveStats(s);
            }
        });

        saveStats(stats);

        // ===== POPULATE STATISTICS PAGE =====
        if (document.getElementById('stat-total-visits')) {
            populateStatsPage(stats);
        }

        function populateStatsPage(s) {
            // Overview cards
            animateStatNumber('stat-total-visits', s.totalVisits);
            animateStatNumber('stat-total-pages', s.totalPages);

            // Average time
            const avgEl = document.getElementById('stat-avg-time');
            if (s.sessionTimes.length > 0) {
                const avg = Math.round(s.sessionTimes.reduce((a, b) => a + b, 0) / s.sessionTimes.length);
                avgEl.textContent = formatDuration(avg);
            } else {
                avgEl.textContent = '—';
            }

            // First visit
            const firstEl = document.getElementById('stat-first-visit');
            if (s.firstVisit) {
                const d = new Date(s.firstVisit);
                firstEl.textContent = d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
            }

            // Pages ranking
            const listEl = document.getElementById('stats-pages-list');
            if (listEl) {
                const sorted = Object.entries(s.pageCounts).sort((a, b) => b[1] - a[1]);
                const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
                listEl.innerHTML = sorted.map(([name, count], i) => {
                    const pct = Math.round((count / maxCount) * 100);
                    return '<div class="stats-page-row fade-in">' +
                        '<span class="stats-page-rank">#' + (i + 1) + '</span>' +
                        '<span class="stats-page-name">' + escapeHtml(name) + '</span>' +
                        '<div class="stats-page-bar-track"><div class="stats-page-bar-fill" style="width:' + pct + '%"></div></div>' +
                        '<span class="stats-page-count">' + count + '</span>' +
                    '</div>';
                }).join('');
                document.querySelectorAll('.stats-page-row').forEach(el => observer.observe(el));
            }

            // Daily chart (last 7 days)
            const chartEl = document.getElementById('stats-chart');
            if (chartEl) {
                const days = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    days.push(d.toISOString().slice(0, 10));
                }
                const maxDaily = Math.max(1, ...days.map(d => s.dailyVisits[d] || 0));
                chartEl.innerHTML = '<div class="stats-chart-bars">' +
                    days.map(day => {
                        const count = s.dailyVisits[day] || 0;
                        const height = Math.max(4, Math.round((count / maxDaily) * 100));
                        const label = new Date(day + 'T00:00:00').toLocaleDateString('pt-PT', { weekday: 'short' });
                        return '<div class="stats-chart-col">' +
                            '<div class="stats-chart-value">' + count + '</div>' +
                            '<div class="stats-chart-bar" style="height:' + height + '%"></div>' +
                            '<div class="stats-chart-label">' + label + '</div>' +
                        '</div>';
                    }).join('') +
                '</div>';
            }

            // Session info
            const sessionStartTs = parseInt(sessionStorage.getItem('sessionStart') || '0', 10);
            const sessionTimeEl = document.getElementById('session-time');
            const sessionPagesEl = document.getElementById('session-pages');
            const browserEl = document.getElementById('session-browser');
            const resEl = document.getElementById('session-resolution');

            if (sessionPagesEl) sessionPagesEl.textContent = sessionStorage.getItem('sessionPages') || '1';
            if (browserEl) browserEl.textContent = detectBrowser();
            if (resEl) resEl.textContent = window.screen.width + ' × ' + window.screen.height;

            // Live session timer
            if (sessionTimeEl && sessionStartTs) {
                function updateSessionTime() {
                    const elapsed = Math.round((Date.now() - sessionStartTs) / 1000);
                    sessionTimeEl.textContent = formatDuration(elapsed);
                }
                updateSessionTime();
                setInterval(updateSessionTime, 1000);
            }
        }

        function animateStatNumber(id, target) {
            const el = document.getElementById(id);
            if (!el) return;
            const duration = 1200;
            const start = performance.now();
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * ease).toLocaleString('pt-PT');
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        function formatDuration(secs) {
            if (secs < 60) return secs + 's';
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            return m + 'min ' + (s < 10 ? '0' : '') + s + 's';
        }

        function detectBrowser() {
            const ua = navigator.userAgent;
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Edg/')) return 'Edge';
            if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
            if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
            if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
            return 'Outro';
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(text));
            return div.innerHTML;
        }
    })();
});
