// ===== ANTIGRAVITY PARTICLE DOTS — Canvas-based scattered dashes =====
// Inspired by the Antigravity IDE website: small colored dashes scattered
// across the viewport that drift and react to mouse proximity.

const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let W, H;
let mouseX = -1000, mouseY = -1000;
const MOUSE_RADIUS = 180;
const MOUSE_FORCE = 0.08;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Particle colors — warm palette: brown, terracotta, amber, olive, muted rose
const COLORS = [
  '#8b6914',  // brown gold
  '#c08b30',  // warm amber
  '#c4613a',  // terracotta
  '#d4a24a',  // golden
  '#a07850',  // mocha
  '#7a8450',  // olive
  '#d48a6a',  // salmon
  '#9e7044',  // sienna
  '#b8956a',  // tan
  '#c9785a',  // burnt orange
];

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.originX = this.x;
    this.originY = this.y;
    this.size = Math.random() * 3 + 1.5;
    this.length = Math.random() * 8 + 4;
    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = Math.random() * 0.5 + 0.2;
    this.baseOpacity = this.opacity;
    // Gentle drifting
    this.driftSpeed = Math.random() * 0.2 + 0.05;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftRadius = Math.random() * 15 + 5;
    this.phase = Math.random() * Math.PI * 2;
    // Velocity for mouse repulsion
    this.vx = 0;
    this.vy = 0;
  }

  update(time) {
    // Gentle autonomous floating
    const driftX = Math.cos(time * this.driftSpeed + this.phase) * this.driftRadius;
    const driftY = Math.sin(time * this.driftSpeed * 0.7 + this.phase) * this.driftRadius;

    const targetX = this.originX + driftX;
    const targetY = this.originY + driftY;

    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
      const ax = (dx / dist) * force * 60;
      const ay = (dy / dist) * force * 60;
      this.vx += ax;
      this.vy += ay;
      this.opacity = Math.min(this.baseOpacity + 0.4, 1);
      this.targetAngle = Math.atan2(dy, dx);
    } else {
      this.opacity += (this.baseOpacity - this.opacity) * 0.03;
    }

    // Spring back to origin + drift
    this.vx += (targetX - this.x) * 0.015;
    this.vy += (targetY - this.y) * 0.015;

    // Damping
    this.vx *= 0.92;
    this.vy *= 0.92;

    this.x += this.vx;
    this.y += this.vy;

    // Smoothly rotate toward target angle
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.angle += angleDiff * 0.08;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-this.length / 2, 0);
    ctx.lineTo(this.length / 2, 0);
    ctx.stroke();
    ctx.restore();
  }
}

// Create particles
const PARTICLE_COUNT = 280;
let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Re-init on resize
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

let startTime = performance.now();

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  const time = (performance.now() - startTime) / 1000;

  for (const p of particles) {
    p.update(time);
    p.draw();
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();


// ===== TYPING EFFECT =====
const typedTextEl = document.getElementById('typed-text');
const roles = [
  'Software Engineer',
  'Backend Developer',
  'Microservices Architect',
  'Spring Boot Specialist',
  'API Designer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else {
      typingSpeed = 80;
    }
  } else {
    typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }
  }

  setTimeout(typeEffect, typingSpeed);
}

setTimeout(typeEffect, 800);


// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.prepend(scrollProgress);

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });


// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function highlightNav() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${sectionId}`) {
          a.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });


// ===== SCROLL REVEAL ANIMATIONS (staggered) =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children).filter(
          el => el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')
        );
        const siblingIdx = siblings.indexOf(entry.target);
        const delay = siblingIdx * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));


// ===== CLICK RIPPLE EFFECT =====
function createRipple(e) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.btn, .project-card, .skill-category, .about-highlight-card, .education-card, .achievement-card, .contact-link, .footer-social').forEach(el => {
  el.classList.add('ripple-container');
  el.addEventListener('click', createRipple);
});


// ===== 3D TILT on PROJECT CARDS =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    card.style.transition = 'transform 0.1s ease-out';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
});


// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    btn.style.transition = 'transform 0.1s ease-out';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
});


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('form-submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    Message Sent!
  `;
  submitBtn.style.background = 'linear-gradient(135deg, #7a8450, #6b7a42)';
  submitBtn.style.color = '#fff';

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = '';
    submitBtn.style.color = '';
    contactForm.reset();
  }, 3000);
});


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
