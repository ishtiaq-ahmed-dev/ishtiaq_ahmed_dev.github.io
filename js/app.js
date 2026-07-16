/* =========================================================
   Ishtiaq Ahmed — portfolio JS
   Libraries (loaded via CDN in index.html):
     - three.min.js (r134)   — WebGL runtime
     - vanta.halo/globe      — plug-and-play 3D backgrounds
     - lenis                 — smooth scroll (studio-freight)
     - gsap + ScrollTrigger  — animation timelines
   ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   1) Vanta 3D backgrounds
   HALO for hero (dark, glowing concentric rings),
   GLOBE for footer (wireframe globe with connections).
   ========================================================= */
(function initVanta() {
  if (prefersReducedMotion || !window.VANTA) return;

  if (window.VANTA.HALO && document.getElementById("vanta-hero")) {
    window.VANTA.HALO({
      el: "#vanta-hero",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      baseColor: 0x1a2540,       // deep navy base
      backgroundColor: 0x0a0f1e, // matches --bg-dark
      amplitudeFactor: 1.6,
      xOffset: 0.20,
      yOffset: 0.0,
      size: 1.2,
    });
  }

  if (window.VANTA.GLOBE && document.getElementById("vanta-footer")) {
    window.VANTA.GLOBE({
      el: "#vanta-footer",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xe8b662,           // gold points
      color2: 0xff6a3d,          // orange highlights
      size: 1.0,
      backgroundColor: 0x0a0f1e,
    });
  }
})();

/* =========================================================
   2) Lenis smooth scroll
   Standard studio-freight setup. Anchor links use its
   scrollTo so they respect the smooth-scroll timeline.
   ========================================================= */
(function initLenis() {
  if (prefersReducedMotion || typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20, duration: 1.4 });
    });
  });

  window.__lenis = lenis;

  // Hook Lenis into ScrollTrigger so reveals fire in sync with smooth scroll
  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
})();

/* =========================================================
   3) Nav: scrolled state + light/dark swap
   ========================================================= */
(function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const hero = document.querySelector(".hero");
  const contact = document.querySelector(".contact");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
    const overLight = heroBottom < 80 && contactTop > 80;
    nav.classList.toggle("is-light", overLight);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = nav.querySelector(".nav__burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("is-open"));
    });
  }
})();

/* =========================================================
   4) Work 3D coverflow — Swiper.js
   Standard coverflow effect: cards rotate in perspective as
   they scroll, current card front-and-center. Autoplay + drag
   + keyboard + wheel-to-scroll horizontally.
   ========================================================= */
(function initWorkSwiper() {
  if (typeof Swiper === "undefined") return;
  const el = document.querySelector(".work-swiper");
  if (!el) return;

  new Swiper(el, {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    speed: 700,
    coverflowEffect: {
      rotate: 35,
      stretch: 0,
      depth: 260,
      modifier: 1,
      slideShadows: false,
    },
    autoplay: prefersReducedMotion ? false : { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
    keyboard: { enabled: true },
    navigation: {
      nextEl: ".work-3d__nav--next",
      prevEl: ".work-3d__nav--prev",
    },
    pagination: {
      el: ".work-swiper .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0:    { spaceBetween: 20 },
      768:  { spaceBetween: 30 },
      1200: { spaceBetween: 40 },
    },
  });
})();

/* =========================================================
   5) GSAP scroll reveals
   Instead of hand-rolled IntersectionObserver + CSS classes,
   drive everything from GSAP timelines with ScrollTrigger.
   Feel: subtle rise + fade, staggered, with a smoother ease.
   ========================================================= */
(function initReveals() {
  if (typeof gsap === "undefined" || prefersReducedMotion) return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  // Hero: intro timeline
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero__meta", { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
    .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".hero__name", { y: 60, opacity: 0, duration: 1.1, ease: "power4.out" }, "-=0.3")
    .from(".hero__sub-line", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
    .from(".hero__sub-tag", { y: 20, opacity: 0, duration: 0.6 }, "-=0.35")
    .from(".hero__stats > div", { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.2")
    .from(".hero__scroll", { y: 12, opacity: 0, duration: 0.5 }, "-=0.2");

  // Utility: reveal a group when it enters the viewport
  function reveal(selector, opts = {}) {
    const els = gsap.utils.toArray(selector);
    els.forEach((el) => {
      gsap.from(el, {
        y: opts.y ?? 40,
        opacity: 0,
        duration: opts.duration ?? 0.9,
        ease: opts.ease ?? "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  reveal(".about__headline", { y: 30 });
  reveal(".about__body");
  reveal(".about__card");
  reveal(".section-heading");

  gsap.utils.toArray(".skill-cat").forEach((el, i) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
      delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
    });
  });

  reveal(".research__card", { y: 60, duration: 1.1 });

  gsap.utils.toArray(".work-card").forEach((el, i) => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
      delay: (i % 2) * 0.1,
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
    });
  });

  gsap.utils.toArray(".timeline__item").forEach((el) => {
    gsap.from(el, {
      x: -30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  reveal(".highlights__col", { y: 30 });
  reveal(".contact__headline", { y: 40, duration: 1.1 });
  reveal(".contact__email");
  reveal(".contact__meta");
  reveal(".contact__socials");

  // Parallax on the profile portrait — moves gently as you scroll
  const photo = document.querySelector(".about__photo img");
  if (photo) {
    gsap.to(photo, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".about__photo",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }
})();

/* =========================================================
   6) Year + tiny extras
   ========================================================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
