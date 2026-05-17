// ── Theme Toggle ──
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const themeQuery = window.matchMedia('(prefers-color-scheme: light)');
const favicon = document.getElementById('favicon');
const themeColorMeta = document.getElementById('themeColorMeta');

function getSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
}

function updateFavicon(theme) {
  if (!favicon) return;
  favicon.href = theme === 'light' ? 'assets/img/favicon-light.svg' : 'assets/img/favicon-dark.svg';
}

function updateThemeColor(theme) {
  if (!themeColorMeta) return;
  themeColorMeta.content = theme === 'light' ? '#f4f7fb' : '#0a0a0f';
}

function updateThemeUi(theme) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function applyTheme(theme, persist = true) {
  root.dataset.theme = theme;
  updateThemeUi(theme);
  updateFavicon(theme);
  updateThemeColor(theme);
  if (persist) localStorage.setItem('theme', theme);
}

const initialTheme = root.dataset.theme || getSavedTheme() || (themeQuery.matches ? 'light' : 'dark');
applyTheme(initialTheme, false);

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

themeQuery.addEventListener('change', event => {
  if (getSavedTheme()) return;
  applyTheme(event.matches ? 'light' : 'dark', false);
});

// ── Particle Background ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 140)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Typing Effect ──
const typedEl = document.getElementById('typed');
const titles = ['Cybersecurity Student', 'Network Technology Enthusiast', 'Linux Systems Learner', 'Practical Solution Builder'];
let titleIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = titles[titleIdx];
  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
    setTimeout(typeEffect, 80);
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      setTimeout(typeEffect, 400);
      return;
    }
    setTimeout(typeEffect, 40);
  }
}
typeEffect();

// ── Navbar ──
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.getElementById('hamburger');
const navUl = document.querySelector('.nav-links');

function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 200;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

function setMenuState(isOpen) {
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  navUl.classList.toggle('open', isOpen);
  navbar.classList.toggle('menu-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

hamburger.addEventListener('click', () => {
  setMenuState(!navUl.classList.contains('open'));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});

window.addEventListener('scroll', updateNavbarState);
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navUl.classList.contains('open')) setMenuState(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navUl.classList.contains('open')) setMenuState(false);
});

updateNavbarState();

// ── Scroll Animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Skill bars
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const w = fill.dataset.width;
        setTimeout(() => fill.style.width = w + '%', 200);
      });

      // Stat counters
      const nums = entry.target.querySelectorAll('.stat-number');
      nums.forEach(num => {
        const target = +num.dataset.target;
        if (num.dataset.counted) return;
        num.dataset.counted = true;
        let count = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          num.textContent = count;
        }, 30);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ── Contact Form ──
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const submitBtn = contactForm.querySelector('.btn-submit');
  const submitLabel = submitBtn.querySelector('span');
  const submitIcon = submitBtn.querySelector('i');
  const formStatus = document.getElementById('formStatus');
  const defaultButtonLabel = 'Send Message';

  function setFormStatus(message, type = '') {
    formStatus.textContent = message;
    formStatus.className = 'form-status';
    if (type) formStatus.classList.add(`is-${type}`);
  }

  function setSubmittingState(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitLabel.textContent = isSubmitting ? 'Sending...' : defaultButtonLabel;
    submitIcon.className = isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane';
  }

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!navigator.onLine) {
      setFormStatus('No internet connection. Please reconnect and try again.', 'error');
      return;
    }

    setSubmittingState(true);
    setFormStatus('');

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        contactForm.reset();
        setFormStatus('Message sent successfully. Thanks for reaching out.', 'success');
        return;
      }

      if (response.status === 429) {
        setFormStatus('Sending is temporarily blocked. Please wait a moment and try again.', 'error');
        return;
      }

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        const hasBlockedError = result.errors.some(error => {
          const message = String(error.message || '').toLowerCase();
          return message.includes('blocked') || message.includes('spam') || message.includes('rate');
        });

        if (hasBlockedError) {
          setFormStatus('Sending was blocked for safety reasons. Please try again in a little while.', 'error');
          return;
        }

        setFormStatus(result.errors.map(error => error.message).join(' '), 'error');
        return;
      }

      setFormStatus('Your message could not be sent right now. Please try again shortly.', 'error');
    } catch (error) {
      setFormStatus('Unable to send your message right now. Please check your connection and try again.', 'error');
    } finally {
      setSubmittingState(false);
    }
  });
}

// ── SmoothScroll for older browsers ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
