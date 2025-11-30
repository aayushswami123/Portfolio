<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">

</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6;">

<a name="readme-top"></a>

<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Logo" width="60" height="60">
  <h1 align="center">🌙 Aayush Swami — Portfolio Website</h1>
  <p align="center">
    Software Engineer • AI/ML Developer • Backend & Systems Engineering
    <br><br>
    <img src="https://img.shields.io/badge/Tech-HTML5_|_CSS3_|_JavaScript-3178C6?style=for-the-badge&logo=javascript&logoColor=F7DF1E&labelColor=2a2a2a" />
    <img src="https://img.shields.io/badge/UI-Glassmorphism_|_Dark_Mode-000000?style=for-the-badge&logo=figma&logoColor=C8A2C8&labelColor=2a2a2a" />
    <img src="https://img.shields.io/badge/Code-Hand--rolled_UI-61DAFB?style=for-the-badge&logo=code&logoColor=white&labelColor=2a2a2a" />
  </p>

  <p align="center">
    A modern, dark-mode, fully responsive portfolio website built using <b>vanilla HTML, CSS, and JavaScript</b> — no frameworks.<br>
    Designed to showcase work in Software Engineering, AI/ML, backend systems, research, and automation.

  </p>
</div>

<hr>

<details>
  <summary><h2>📚 Table of Contents</h2></summary>
  <ol>
    <li><a href="#key-features">✨ Key Features</a></li>
    <li><a href="#tech-stack">🛠️ Tech Stack</a></li>
    <li><a href="#folder-structure">📂 Folder Structure</a></li>
    <li><a href="#local-setup">⚙️ Local Setup</a></li>
    <li><a href="#deployment">🚀 Deployment</a></li>
    <li><a href="#workflow">✏️ Development Workflow</a></li>
    <li><a href="#future">📌 Future Improvements</a></li>
    <li><a href="#about">👨‍💻 About Me</a></li>
    <li><a href="#contact">📬 Contact</a></li>
  </ol>
</details>

<hr>

<a name="key-features"></a>
<h2>✨ Key Features</h2>

<ul>
  <li><b>🔥 Modern Dark UI:</b> Neon purple/blue accents, glassmorphism, gradient glows, particle animation.</li>
  <li><b>🧭 Animated Navigation Bar:</b> Floating glass navbar, animated gradient border, mobile dropdown.</li>
  <li><b>🎬 Hero Section:</b> Typewriter text, animated cursor, SWE/AI/ML role tags.</li>
  <li><b>📦 Full Website Sections:</b>
    <ul>
      <li>About Me</li>
      <li>Skills (Languages, ML, Backend, DevOps)</li>
      <li>Experience</li>
      <li>Projects</li>
      <li>Research</li>
      <li>Activities</li>
      <li>Resume</li>
      <li>Contact</li>
    </ul>
  </li>
  <li><b>✨ Animations Everywhere:</b> Scroll reveal, glow, hover effects, pulsing logo.</li>
</ul>

<p align="center">
  <img src="https://via.placeholder.com/900x450?text=Portfolio+Screenshot" width="85%" />
</p>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="tech-stack"></a>
<h2>🛠️ Tech Stack</h2>

<div align="center"><h3>No Frameworks. No Libraries. 100% Handmade UI.</h3></div>

<table>
<tr>
  <th>Category</th>
  <th>Technologies</th>
  <th>Description</th>
</tr>
<tr>
  <td><b>Frontend</b></td>
  <td>HTML5, CSS3, JavaScript (ES6+)</td>
  <td>Core structure, styling, animations</td>
</tr>
<tr>
  <td><b>UI/UX</b></td>
  <td>Custom CSS, gradients, shadows</td>
  <td>Glassmorphism design, responsive layout</td>
</tr>
<tr>
  <td><b>Animations</b></td>
  <td>Canvas API, Keyframes, IntersectionObserver</td>
  <td>Particles, typewriter, scroll reveal</td>
</tr>
<tr>
  <td><b>Deployment</b></td>
  <td>GitHub Pages, Netlify, Vercel</td>
  <td>Instant static hosting</td>
</tr>
</table>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="folder-structure"></a>
<h2>📂 Folder Structure</h2>

<pre>
portfolio/
│
├── index.html        # Main site
├── style.css         # Styling + animations
├── script.js         # JS logic (particles, reveal, navbar)
│
├── assets/
│   ├── favicon.png
│   ├── Aayush_Resume_swe_2025.pdf
│   └── images/
│
└── README.md
</pre>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="local-setup"></a>
<h2>⚙️ Local Setup</h2>

<h3>Clone Repository</h3>

<pre>
git clone https://github.com/aayushswami123/portfolio.git
cd portfolio
</pre>

<h3>Run Local Server (recommended)</h3>

<pre>
python3 -m http.server
</pre>

Then open:  
<b>http://localhost:8000</b>

<details>
<summary><b>Alternative: Open index.html directly</b></summary>
<p>
Some JS features may be restricted due to browser security policies (CORS).
</p>
</details>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="deployment"></a>
<h2>🚀 Deployment</h2>

<h3>📌 GitHub Pages</h3>

<ol>
  <li>Push code to GitHub</li>
  <li>Go to <b>Settings → Pages</b></li>
  <li>Select branch: <b>main</b> → root</li>
  <li>Save</li>
</ol>

<h3>Other Hosting</h3>
<ul>
  <li>Netlify</li>
  <li>Vercel</li>
  <li>Cloudflare Pages</li>
</ul>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="workflow"></a>
<h2>✏️ Development Workflow</h2>

<table>
<tr><th>Prefix</th><th>Use Case</th><th>Example</th></tr>
<tr><td><code>feat:</code></td><td>New features</td><td>feat: add AI section</td></tr>
<tr><td><code>style:</code></td><td>UI updates</td><td>style(nav): glow effect</td></tr>
<tr><td><code>fix:</code></td><td>Bug fixes</td><td>fix: navbar alignment</td></tr>
<tr><td><code>refactor:</code></td><td>Code cleanup</td><td>refactor: optimize scripts</td></tr>
<tr><td><code>chore:</code></td><td>Maintenance</td><td>chore: update resume PDF</td></tr>
</table>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="future"></a>
<h2>📌 Future Improvements</h2>

<ul>
  <li>Blog / articles section</li>
  <li>Backend-enabled contact form</li>
  <li>Project gallery with screenshots</li>
  <li>AI chatbot on homepage</li>
  <li>Light/dark theme toggle</li>
</ul>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="about"></a>
<h2>👨‍💻 About Me</h2>

<p>
I’m <b>Aayush Swami</b>, CS Junior @ ASU (GPA 3.88), focused on:
</p>

<ul>
  <li>AI/ML pipelines (BLIP-2, GPR, multimodal ML)</li>
  <li>Backend systems (FastAPI, Node.js, PostgreSQL)</li>
  <li>Cloud computing (Docker, Cloudflare Workers, GitHub Actions)</li>
  <li>Trading automation + agentic AI</li>
  <li>Real-time telemetry dashboards</li>
</ul>

<p>
Currently seeking <b>Software Engineering / AI/ML internships for Summer–Fall 2026</b>.
</p>

<p align="right"><a href="#readme-top">back to top</a></p>

<hr>

<a name="contact"></a>
<h2>📬 Contact</h2>

<div align="center">

<a href="mailto:aayushswami.dev@gmail.com">
  <img src="https://img.shields.io/badge/Email-aayushswami.dev%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
</a>

<a href="https://github.com/aayushswami123" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-aayushswami123-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://linkedin.com/in/aayush-swami" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-aayush--swami-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

</div>

<p align="right"><a href="#readme-top">back to top</a></p>

</body>
</html>
