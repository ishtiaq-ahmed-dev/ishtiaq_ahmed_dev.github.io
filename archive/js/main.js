// ===== AOS Initialization =====
AOS.init({
    duration: 800,
    once: false, // Allow animations to repeat on scroll for a more dynamic feel
    mirror: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// ===== Canvas Starfield =====
const canvas = document.createElement('canvas');
canvas.id = 'stars-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let dots = [];
const dotCount = 150;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = [];
    for (let i = 0; i < dotCount; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();

        dot.y -= dot.speed;
        if (dot.y < 0) {
            dot.y = canvas.height;
            dot.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawStars();

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.querySelectorAll('.about-card, .skill-category, .timeline-item, .project-card, .contact-card').forEach(el => {
    el.classList.add('fade-in-element');
    fadeInObserver.observe(el);
});

// Add CSS for fade-in animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-category.fade-in-visible,
    .timeline-item.fade-in-visible,
    .project-card.fade-in-visible,
    .contact-card.fade-in-visible {
        transition-delay: calc(var(--delay, 0) * 0.1s);
    }
`;
document.head.appendChild(style);

// Add staggered delays
document.querySelectorAll('.skills-grid .skill-category').forEach((el, i) => {
    el.style.setProperty('--delay', i);
});

document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.setProperty('--delay', i);
});

document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.setProperty('--delay', i);
});

document.querySelectorAll('.contact-card').forEach((el, i) => {
    el.style.setProperty('--delay', i);
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Typing Effect for Hero Title (Optional Enhancement) =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-image-container');
    if (hero && scrolled < 800) {
        hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);

    function update() {
        start += step;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            requestAnimationFrame(update);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    }
    update();
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    const suffix = text.replace(/[0-9]/g, '');
                    stat.dataset.suffix = suffix;
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== Skill Items Hover Effect =====
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1) rotate(3deg)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===== Loading Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== Console Easter Egg =====
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #a855f7;');
console.log('%cThis portfolio was created by Ishtiaq Ahmed', 'font-size: 14px; color: #06b6d4;');
console.log('%c🚀 Building the Future with AI', 'font-size: 12px; color: #71717a;');
