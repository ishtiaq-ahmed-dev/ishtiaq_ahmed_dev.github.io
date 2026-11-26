<div align="center">

# Ishtiaq Ahmed

**AI engineer and full-stack developer. This is the source of my personal site.**

<a href="https://ishtiaq-ahmed-dev.github.io/ishtiaq_ahmed_dev.github.io/"><img src="https://img.shields.io/badge/live-ishtiaq--ahmed--dev.github.io-e8b662?style=flat-square&labelColor=0a0f1e" alt="Live site"></a>
<a href="https://github.com/ishtiaq-ahmed-dev/ishtiaq_ahmed_dev.github.io/actions/workflows/static.yml"><img src="https://img.shields.io/github/actions/workflow/status/ishtiaq-ahmed-dev/ishtiaq_ahmed_dev.github.io/static.yml?branch=main&style=flat-square&label=deploy" alt="Deploy status"></a>
<img src="https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="GitHub Pages">
<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js">
<img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP">
<img src="https://img.shields.io/badge/Swiper-6332F6?style=flat-square&logo=swiper&logoColor=white" alt="Swiper">

[Live site](https://ishtiaq-ahmed-dev.github.io/ishtiaq_ahmed_dev.github.io/) · [What's on it](#whats-on-the-site) · [Tech stack](#tech-stack) · [Run locally](#run-locally) · [Layout](#project-layout) · [Author](#author)

</div>

---

One HTML page, one stylesheet, one script. No framework and no build step. The libraries come from a CDN, so what you see in the repo is exactly what GitHub Pages serves.

## What's on the site

| Section | Contents |
| --- | --- |
| Hero | Name, role line and a few headline numbers, over a Vanta HALO background |
| About | Who I am, where I study, and what I'm working on now |
| Toolkit | The tools I use, grouped into AI/ML, automation, web, systems/DSA and tooling |
| Research | CardioFusion-SSL, my ECG and heart-sound (PCG) fusion project |
| Work | Six selected projects in a 3D coverflow carousel (drag, swipe or arrow keys) |
| Experience | Work history and education as a timeline |
| Highlights | Honors, certifications and languages |
| Contact | Email, location and profile links, over a Vanta GLOBE background |

The previous version of the site lives in [`archive/`](archive/index.html) and is linked from the footer as "Previous Site".

## Tech stack

| Piece | Used for |
| --- | --- |
| HTML, CSS, vanilla JavaScript | The page itself |
| [Three.js](https://threejs.org/) r134 + [Vanta](https://www.vantajs.com/) 0.5.24 | Animated 3D backgrounds in the hero and footer |
| [Lenis](https://github.com/darkroomengineering/lenis) 1.1.14 | Smooth scrolling |
| [GSAP](https://gsap.com/) 3.12.5 + ScrollTrigger | Scroll-triggered reveals |
| [Swiper](https://swiperjs.com/) 11 | The coverflow carousel in the Work section |
| Google Fonts | Instrument Serif, Inter, JetBrains Mono |
| GitHub Actions + GitHub Pages | Deploys on every push to `main` |

If the visitor has reduced motion turned on, the 3D backgrounds are skipped and the carousel stops autoplaying.

## Run locally

Any static file server works. With Python:

```bash
git clone https://github.com/ishtiaq-ahmed-dev/ishtiaq_ahmed_dev.github.io.git
cd ishtiaq_ahmed_dev.github.io
python -m http.server 8000
```

Then open <http://localhost:8000>. You need an internet connection, because the libraries and fonts load from CDNs.

## Deploying

[`.github/workflows/static.yml`](.github/workflows/static.yml) uploads the repository root to GitHub Pages on every push to `main`. It can also be run by hand from the Actions tab.

`index.html` loads `css/main.css` and `js/app.js` with a `?v=` query string. Bump it when you change either file, or returning visitors may get a cached copy.

## Project layout

```text
.
├── index.html               the whole site
├── css/main.css             styles
├── js/app.js                Vanta, Lenis, nav, Swiper and GSAP setup
├── images/                  profile photo, project thumbnails, tool icons
├── archive/                 previous version of the site (HTML, CSS, JS, videos)
└── .github/workflows/
    └── static.yml           GitHub Pages deploy
```

## Author

**Ishtiaq Ahmed**, BS Artificial Intelligence student at IMSciences Peshawar.

[GitHub](https://github.com/ishtiaq-ahmed-dev) · [LinkedIn](https://www.linkedin.com/in/ishtiaq-ahmed-90a70b35a/) · [Fiverr](https://www.fiverr.com/dev__ishtiaq) · [iashtiaqkhattak@gmail.com](mailto:iashtiaqkhattak@gmail.com)
