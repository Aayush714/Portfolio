// Navigation toggle, theme toggle, scroll active links, canvas network, typed effect, and tilt cards
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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });

    // 2. Scroll spy & Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');

    function checkScroll() {
        // Scroll spy
        let index = sections.length;
        while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
        navLinks.forEach(link => link.classList.remove('active'));
        if (sections[index]) {
            const id = sections[index].getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }

        // Reveal elements
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // 3. Dark / Light Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 4. Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 5. Interactive Canvas Network Background (Nodes & Lines)
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        draw() {
            ctx.fillStyle = document.body.classList.contains('dark-theme') ? 'rgba(56, 189, 248, 0.4)' : 'rgba(53, 110, 221, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const count = Math.min(window.innerWidth / 15, 70);
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 130) {
                    const alpha = (1 - (distance / 130)) * 0.2;
                    ctx.strokeStyle = document.body.classList.contains('dark-theme') ? `rgba(56, 189, 248, ${alpha})` : `rgba(53, 110, 221, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 6. Typed Text Effect
    const words = [
        "PhD in Computer Science specializing in distributed algorithms & ML.",
        "Software Engineer at Google Cloud building failure diagnosis pipelines.",
        "Researcher in network resilience and high-performance systems."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTarget = document.getElementById('typedText');

    function typeWriter() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2500; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(typeWriter, typeSpeed);
    }
    if (typedTarget) {
        typeWriter();
    }

    // 7. Interactive 3D Card Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
});
