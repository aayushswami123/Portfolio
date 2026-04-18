/* ═══════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
(function setupCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ═══════════════════════════════════════════════
   MESH / AURORA BACKGROUND CANVAS
═══════════════════════════════════════════════ */
(function setupCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  // Orbs
  const orbs = [
    { x: 0.1, y: 0.15, r: 0.55, hue: 80, sat: 90, lit: 55, speed: 0.00018, phase: 0 },    // lime
    { x: 0.85, y: 0.75, r: 0.5,  hue: 260, sat: 85, lit: 60, speed: 0.00022, phase: 2 },   // violet
    { x: 0.55, y: 0.45, r: 0.35, hue: 190, sat: 80, lit: 58, speed: 0.00015, phase: 4 },   // cyan
    { x: 0.3,  y: 0.8,  r: 0.28, hue: 80,  sat: 70, lit: 55, speed: 0.00025, phase: 1 },   // lime2
  ];

  let t = 0;

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    orbs.forEach(o => {
      const cx = (o.x + Math.sin(t * o.speed + o.phase) * 0.12) * W;
      const cy = (o.y + Math.cos(t * o.speed * 0.8 + o.phase) * 0.1) * H;
      const rad = o.r * Math.max(W, H);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `hsla(${o.hue},${o.sat}%,${o.lit}%,0.12)`);
      g.addColorStop(0.45, `hsla(${o.hue},${o.sat}%,${o.lit}%,0.04)`);
      g.addColorStop(1, `hsla(${o.hue},${o.sat}%,${o.lit}%,0)`);

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  draw();
})();

/* ═══════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════ */
(function setupTypewriter() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const phrases = [
    'Software Engineer',
    'AI/ML Developer',
    'Backend & Systems',
    'Serverless & Cloud',
    'Scientific ML',
    'Trading Automation',
  ];

  let pi = 0, ci = 0, deleting = false;
  const BASE = 88;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) {
        setTimeout(() => { deleting = true; }, 1500);
        return;
      }
    } else {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? BASE * 0.4 : BASE);
  }

  setTimeout(tick, 1400);
})();

/* ═══════════════════════════════════════════════
   NAVBAR SCROLL STATE
═══════════════════════════════════════════════ */
(function setupNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close on link click
  navLinks && navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      hamburger && hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
})();

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER REVEALS
═══════════════════════════════════════════════ */
(function setupReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════ */
(function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0');
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = (ease * target).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ═══════════════════════════════════════════════
   TILT ON HERO CARDS
═══════════════════════════════════════════════ */
(function setupTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();