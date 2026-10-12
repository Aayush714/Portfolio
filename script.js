// Navigation toggle, theme toggle, and scroll effects
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');

    // 1. Toggle mobile navigation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Close nav when link clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });

    // 2. Scroll spy to highlight current nav link
    function setActiveNav() {
        let index = sections.length;
        while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
        navLinks.forEach(link => link.classList.remove('active'));
        if (sections[index]) {
            const id = sections[index].getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }
    setActiveNav();
    window.addEventListener('scroll', setActiveNav);

    // 3. Dark / Light Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            // Switch icon
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 4. Scroll-Triggered Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
                observer.unobserve(entry.target); // Animate once per page load
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 5. Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy');
            const textElement = document.getElementById(targetId);
            if (!textElement) return;
            const text = textElement.innerText.trim();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    btn.textContent = '✔';
                    setTimeout(() => {
                        btn.textContent = '📋';
                    }, 2000);
                }).catch(() => {
                    console.warn('Clipboard write failed');
                });
            }
        });
    });

    // 6. Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
