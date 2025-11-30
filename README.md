This is excellent content for a professional README\! Below is the copy-pastable code using HTML tags for centering, detailed organization, and visual appeal, as requested.

```html
<a name="readme-top"></a>

<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Logo" width="60" height="60">
  <h1 align="center">🌙 Aayush Swami — Portfolio Website</h1>
  <p align="center">
    Software Engineer • AI/ML Developer • Backend & Systems Engineering
    <br />
    <br />
    <img src="https://img.shields.io/badge/Tech-HTML5_|_CSS3_|_JavaScript-E34F26?style=for-the-badge&logo=javascript&logoColor=F7DF1E&labelColor=2a2a2a" alt="Tech Stack Badge">
    <img src="https://img.shields.io/badge/UI-Glassmorphism_|_Dark_Mode-000000?style=for-the-badge&logo=figma&logoColor=C8A2C8&labelColor=2a2a2a" alt="UI Style Badge">
    <img src="https://img.shields.io/badge/Code-Hand--rolled_UI-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=2a2a2a" alt="Hand Rolled Badge">
  </p>
</div>

<div align="center">
  <p>
    A modern, dark-mode, fully responsive portfolio website built using **vanilla HTML, CSS, and JavaScript** — no frameworks. Designed to showcase work in software engineering, AI/ML, backend systems, research, and automation.
    <br>
    <a href="https://github.com/aayushswami123/portfolio"><strong>View Live Demo »</strong></a>
    ·
    <a href="https://github.com/aayushswami123/portfolio/issues">Report Issue</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#key-features">✨ Key Features</a></li>
    <li><a href="#tech-stack">🛠️ Tech Stack</a></li>
    <li><a href="#folder-structure">📂 Folder Structure</a></li>
    <li><a href="#local-setup">⚙️ Local Setup</a></li>
    <li><a href="#deployment">🚀 Deployment</a></li>
    <li><a href="#future-improvements">📌 Future Improvements</a></li>
    <li><a href="#about-the-developer">👨‍💻 About Me</a></li>
    <li><a href="#contact">📬 Contact</a></li>
  </ol>
</details>

<br>
## ✨ Key Features

This release includes a **full redesign** with glassmorphism UI, animated navbar, typewriter hero text, particle background, and updated content aligned with SWE + AI/ML roles.

<a name="features-list"></a>
<div align="left">
  <ul>
    <li>🔥 <b>Modern Dark UI</b>: Neon purple/blue accent theme, soft gradients, glassmorphism cards, dynamic glow effects, and a custom particle background animation.</li>
    <li>🧭 <b>Animated Navigation Bar</b>: Floating glass navbar with an animated gradient border, smooth scroll transitions, sticky behavior, and responsive mobile dropdown.</li>
    <li>🎬 <b>Hero Section</b>: Typewriter text animation, fading text, animated cursor, and SWE • AI/ML • Systems intro tags.</li>
    <li>📦 <b>Full Website Sections</b>:
      <ul>
        <li><b>About Me</b> — CS @ ASU, AI/ML + backend focus</li>
        <li><b>Skills</b> — languages, ML frameworks, backend, DevOps</li>
        <li><b>Experience</b> — Rolston Lab, Odyssey Rover, Spectra Consultancy</li>
        <li><b>Projects</b> — AI Chart Analyzer, Trading Bot, Voice Assistant, Rover Dashboard</li>
        <li><b>Research</b> — BLIP-2 scientific ML, GPR battery modeling</li>
        <li><b>Activities</b> — GDG Core Team, Adobe Student Ambassador</li>
        <li><b>Resume</b> — direct PDF link</li>
        <li><b>Contact</b> — email, GitHub, LinkedIn</li>
      </ul>
    </li>
    <li>✨ <b>Animations Everywhere</b>: Scroll reveal (IntersectionObserver), hover card animations, neon glow highlights, and animated navbar pulse.</li>
  </ul>
  <p align="center">
    <img src="https://via.placeholder.com/800x450?text=Glassmorphism+Portfolio+Screenshot" alt="Website Screenshot" width="800" />
  </p>
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a name="tech-stack"></a>
## 🛠️ Tech Stack

<div align="center">
  <h3>The 100% Hand-Rolled UI Commitment: No Frameworks. No Libraries.</h3>
</div>

| Category | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Core development using modern standards. |
| **Styling** | Custom CSS (Glassmorphism, Gradients, Keyframes) | Custom particle background, typewriter engine, and all visual effects built from scratch. |
| **Animations & Effects** | Canvas API, Intersection Observer | Used for the custom particle background, scroll reveal, and fade effects. |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a name="folder-structure"></a>
## 📂 Folder Structure

```

portfolio/
│
├── index.html        \# Main website page
├── style.css         \# Styling + animations + responsive layouts
├── script.js         \# Typewriter, particles, navbar, reveal effects
│
├── assets/
│   ├── favicon.svg / favicon.png
│   ├── Aayush\_Resume\_swe\_2025.pdf
│   └── images/
│
└── README.md

````

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<a name="local-setup"></a>
## ⚙️ Local Setup

### Clone the repository

```sh
git clone [https://github.com/aayushswami123/portfolio.git](https://github.com/aayushswami123/portfolio.git)
cd portfolio
````

### Open Locally (Recommended)

Running a local server is recommended to ensure all scripts and assets load correctly.

```sh
python3 -m http.server
```

Then open:

```
http://localhost:8000
```

\<details\>
\<summary\>Alternative: Double-Click Method\</summary\>
\<p\>
Just open \<code\>index.html\</code\>. Some JavaScript features might behave differently due to browser file security restrictions (CORS), but the main content should load.
\</p\>
\</details\>

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

\<a name="deployment"\>\</a\>

## 🚀 Deployment

The simplicity of this vanilla stack makes deployment exceptionally easy.

### GitHub Pages

1.  Push your code to GitHub.
2.  Go to: **Settings → Pages**.
3.  Select branch: `main` → `/root`.
4.  **Save**.

\<div align="center"\>
Your portfolio goes live instantly 🎉
\</div\>

### Vercel / Netlify / Cloudflare Pages

Just drag & drop the folder or connect the repository — the site works instantly with zero configuration needed.

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

## ✏️ Development Workflow

The project follows **Conventional Commits** for clear version control history.

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | New features | `feat: add projects gallery` |
| `style:` | UI updates / styling | `style(navbar): add animated gradient glow` |
| `fix:` | Bug fixes | `fix: resolve mobile dropdown issue` |
| `refactor:` | Structure updates | `refactor: move particles to separate file` |
| `chore:` | Minor updates (CI/CD, dependencies) | `chore: update resume PDF link` |

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

\<a name="future-improvements"\>\</a\>

## 📌 Future Improvements

  * Add a dedicated **blog / articles** section.
  * Implement a backend for **analytics** or functional **contact forms**.
  * Enhance the projects gallery with more detailed **images and videos**.
  * Integrate an **AI chatbot assistant** on the homepage for interactive Q\&A.
  * Add a **dark/light mode toggle** (currently dark mode only).

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

\<a name="about-the-developer"\>\</a\>

## 👨‍💻 About Me

\<div align="left"\>
\<p\>
I’m **Aayush Swami**, a CS Junior at ASU (GPA 3.88) actively seeking Software Engineering / AI/ML internships for Summer–Fall 2026. My focus areas include:
\</p\>
\<ul\>
\<li\>AI/ML pipelines (BLIP-2, GPR, multimodal scientific ML)\</li\>
\<li\>Backend systems (FastAPI, Node.js, PostgreSQL)\</li\>
\<li\>Cloud + Distributed systems (Docker, Cloudflare Workers, GitHub Actions)\</li\>
\<li\>Trading automation + agentic AI\</li\>
\<li\>Real-time telemetry dashboards\</li\>
\</ul\>
\</div\>

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

\<a name="contact"\>\</a\>

## 📬 Contact

\<div align="center"\>
\<a href="mailto:aayushswami.dev@gmail.com"\>\<img src="https://www.google.com/search?q=https://img.shields.io/badge/Email-aayushswami.dev%40gmail.com-D14836%3Fstyle%3Dfor-the-badge%26logo%3Dgmail%26logoColor%3Dwhite" alt="Email Badge"\>\</a\>
\<a href="https://github.com/aayushswami123" target="\_blank"\>\<img src="https://www.google.com/search?q=https://img.shields.io/badge/GitHub-aayushswami123-181717%3Fstyle%3Dfor-the-badge%26logo%3Dgithub%26logoColor%3Dwhite" alt="GitHub Badge"\>\</a\>
\<a href="https://linkedin.com/in/aayush-swami" target="\_blank"\>\<img src="https://www.google.com/search?q=https://img.shields.io/badge/LinkedIn-aayush--swami-0077B5%3Fstyle%3Dfor-the-badge%26logo%3Dlinkedin%26logoColor%3Dwhite" alt="LinkedIn Badge"\>\</a\>
\</div\>

\<p align="right"\>(\<a href="\#readme-top"\>back to top\</a\>)\</p\>

```
```
