document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll effect ───────────────── */
    const navbar = document.getElementById('navbar');
    const navAnchors = document.querySelectorAll('.nav-anchor');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        highlightActiveNav();
    });

    /* ── Mobile nav toggle ──────────────────── */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

    /* Close mobile nav on link click */
    navAnchors.forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

    /* ── Active nav on scroll ───────────────── */
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-anchor[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active-nav', scrollPos >= top && scrollPos < bottom);
            }
        });
    }

    /* ── Animated Counters ──────────────────── */
    const counters = document.querySelectorAll('.counter-num');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(el => {
            const target = parseInt(el.closest('.ticker-item')?.dataset.target || el.dataset.target || '0', 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current).toLocaleString();
                if (current >= target) {
                    el.textContent = target.toLocaleString() + (el.id === 'c4' ? '%' : '+');
                    clearInterval(timer);
                }
            }, 16);
        });
    }

    /* Trigger when stats-ticker is visible */
    const ticker = document.querySelector('.stats-ticker');
    if (ticker && 'IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) startCounters();
        }, { threshold: 0.3 }).observe(ticker);
    }

    /* ── Login Modal ────────────────────────── */
    const loginModal   = document.getElementById('loginModal');
    const loginForm    = document.getElementById('loginForm');
    const loginError   = document.getElementById('loginError');
    const ranchInput   = document.getElementById('ranchName');
    const passwordInput = document.getElementById('password');
    const togglePw     = document.getElementById('togglePw');

    // Valid credentials (demo)
    const VALID_CREDENTIALS = [
        { ranch: 'HappyCow',    password: 'bovi2024' },
        { ranch: 'SunriseFarm', password: 'ranch123' },
        { ranch: 'demo',        password: 'demo'     },
    ];

    function openModal() { loginModal.classList.add('show'); ranchInput?.focus(); }
    function closeModal() {
        loginModal.classList.remove('show');
        loginForm?.reset();
        loginError && (loginError.style.display = 'none');
    }

    document.getElementById('loginBtn')?.addEventListener('click', openModal);
    document.getElementById('heroLoginBtn')?.addEventListener('click', openModal);
    document.getElementById('closeLogin')?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === loginModal) closeModal(); });

    /* Password visibility toggle */
    togglePw?.addEventListener('click', () => {
        const isText = passwordInput.type === 'text';
        passwordInput.type = isText ? 'password' : 'text';
        togglePw.querySelector('i').className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });

    /* Form submit */
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const ranch = ranchInput.value.trim();
        const pw    = passwordInput.value.trim();

        const found = VALID_CREDENTIALS.find(
            c => c.ranch.toLowerCase() === ranch.toLowerCase() && c.password === pw
        );

        if (found) {
            localStorage.setItem('bovicare_ranch_name', ranch);
            loginError && (loginError.style.display = 'none');
            window.location.href = 'dashboard.html';
        } else {
            loginError && (loginError.style.display = 'flex');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    /* ── IoT Panel live clock ───────────────── */
    const iotTimeEl = document.getElementById('iotTime');
    function updateIotTime() {
        if (!iotTimeEl) return;
        const now = new Date();
        iotTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    updateIotTime();
    setInterval(updateIotTime, 1000);

    /* ── Smooth-scroll for CTA button ──────── */
    document.querySelectorAll('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.querySelector(btn.dataset.scroll);
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
