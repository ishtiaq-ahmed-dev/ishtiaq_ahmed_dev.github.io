/* -------- Nav: scroll state + light/dark theme swap -------- */
(() => {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const hero = document.querySelector(".hero");
  const contact = document.querySelector(".contact");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);

    /* light theme when nav is over a light section */
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
    const overLight = heroBottom < 80 && contactTop > 80;
    nav.classList.toggle("is-light", overLight);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile burger */
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

/* -------- Reveal on scroll -------- */
(() => {
  const targets = document.querySelectorAll(
    ".about__headline, .about__body, .about__card, .section-heading, .skill-cat, .research__card, .work-card, .timeline__item, .highlights__col, .contact__headline, .contact__email, .contact__meta"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => io.observe(el));
})();

/* -------- Custom cursor hover state -------- */
(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  function tick() {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hoverables = document.querySelectorAll("a, button, .work-card, .skill-cat li");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
})();

/* -------- Year -------- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
