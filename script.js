// ---------- TYPEWRITER / FADING TEXT ----------
const typedElement = document.getElementById("hero-typed");
const cursorElement = document.querySelector(".cursor");

// phrases to cycle through
const phrases = [
  "Welcome to Aayush's Portfolio",
  "Software Engineer",
  "AI/ML Developer",
  "Backend & Systems",
  "Serverless & Cloud",
  "Scientific ML & Trading Automation"
];

let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;
let typingSpeed = 90; // base typing speed (ms)

function typeLoop() {
  const phrase = phrases[currentPhrase];

  if (!isDeleting) {
    // typing forward
    currentChar++;
    typedElement.textContent = phrase.slice(0, currentChar);
    if (currentChar === phrase.length) {
      // pause at full word
      setTimeout(() => {
        isDeleting = true;
      }, 1300);
    }
  } else {
    // deleting
    currentChar--;
    typedElement.textContent = phrase.slice(0, currentChar);
    if (currentChar === 0) {
      isDeleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
    }
  }

  const delay = isDeleting ? typingSpeed * 0.45 : typingSpeed;
  setTimeout(typeLoop, delay);
}

// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- INTERSECTION OBSERVER FOR REVEALS ----------
function setupRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // fallback
    reveals.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ---------- NAVBAR SCROLL STATE + MOBILE MENU ----------
function setupNavbar() {
  const nav = document.querySelector(".nav");
  const navInner = document.querySelector(".nav-inner");
  const navLinks = document.querySelector(".nav-links");
  const toggle = document.querySelector(".nav-toggle");

  // scroll state
  const onScroll = () => {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // mobile toggle
  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
  }

  // close mobile nav on link click
  navInner.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
    }
  });
}

// ---------- PARTICLE BACKGROUND ----------
function setupParticles() {
  const canvas = document.getElementById("bg-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_SPEED = 0.35;

  let width = window.innerWidth;
  let height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.7 + 0.6,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      alpha: Math.random() * 0.45 + 0.1
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.radius * 4
      );
      gradient.addColorStop(
        0,
        `rgba(108, 196, 255, ${p.alpha + 0.15})`
      );
      gradient.addColorStop(
        1,
        `rgba(154, 91, 255, 0)`
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", onResize);
  draw();
}

// ---------- FOOTER YEAR ----------
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  typeLoop();
  setupSmoothScroll();
  setupRevealAnimations();
  setupNavbar();
  setupParticles();
  setYear();
});
