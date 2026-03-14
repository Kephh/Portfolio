// ===== BLENDED COLOR BLOBS + SUBTLE MICRO-PARTICLES =====
// Layer 1: Soft gradient color blobs that follow mouse gently (aurora effect)
// Layer 2: Very tiny, semi-transparent particles for texture

const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let W, H;
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let smoothMouseX = mouseX, smoothMouseY = mouseY;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// --- LAYER 1: Soft Blended Color Blobs ---
const blobs = [
  { x: 0.3, y: 0.3, r: 400, color: 'rgba(192, 139, 48, 0.22)', phase: 0, speed: 0.4 },
  { x: 0.7, y: 0.2, r: 350, color: 'rgba(196, 97, 58, 0.18)', phase: 1.5, speed: 0.3 },
  { x: 0.5, y: 0.7, r: 420, color: 'rgba(139, 105, 20, 0.20)', phase: 3.0, speed: 0.35 },
  { x: 0.2, y: 0.8, r: 320, color: 'rgba(212, 162, 74, 0.15)', phase: 4.5, speed: 0.25 },
  { x: 0.8, y: 0.6, r: 380, color: 'rgba(160, 120, 80, 0.18)', phase: 2.0, speed: 0.3 },
];

function drawBlobs(time) {
  // Smooth mouse follow
  smoothMouseX += (mouseX - smoothMouseX) * 0.15;
  smoothMouseY += (mouseY - smoothMouseY) * 0.15;

  const mouseOffsetX = (smoothMouseX / W - 0.5) * 150;
  const mouseOffsetY = (smoothMouseY / H - 0.5) * 150;

  for (const blob of blobs) {
    const driftX = Math.cos(time * blob.speed + blob.phase) * 40;
    const driftY = Math.sin(time * blob.speed * 0.8 + blob.phase) * 35;

    const bx = blob.x * W + driftX + mouseOffsetX * (blob.speed / 0.4);
    const by = blob.y * H + driftY + mouseOffsetY * (blob.speed / 0.4);

    const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, blob.r);
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(bx - blob.r, by - blob.r, blob.r * 2, blob.r * 2);
  }
}

// --- LAYER 2: Micro-Particles (very tiny, subtle) ---
const COLORS = [
  '#8b6914', '#c08b30', '#c4613a', '#d4a24a',
  '#a07850', '#7a8450', '#b8956a', '#c9785a',
];

class MicroParticle {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.originX = this.x;
    this.originY = this.y;
    this.size = Math.random() * 2 + 1;          // small dots: 1 - 3px
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = Math.random() * 0.3 + 0.15;   // visible: 0.15 - 0.45
    this.baseOpacity = this.opacity;
    this.driftSpeed = Math.random() * 0.15 + 0.03;
    this.driftRadius = Math.random() * 10 + 3;
    this.phase = Math.random() * Math.PI * 2;
    this.vx = 0;
    this.vy = 0;
  }

  update(time) {
    const driftX = Math.cos(time * this.driftSpeed + this.phase) * this.driftRadius;
    const driftY = Math.sin(time * this.driftSpeed * 0.7 + this.phase) * this.driftRadius;
    const targetX = this.originX + driftX;
    const targetY = this.originY + driftY;

    // Gentle mouse repulsion
    const dx = this.x - smoothMouseX;
    const dy = this.y - smoothMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 140 && dist > 0) {
      const force = (1 - dist / 140) * 0.04;
      this.vx += (dx / dist) * force * 30;
      this.vy += (dy / dist) * force * 30;
      this.opacity = Math.min(this.baseOpacity + 0.25, 0.7);
    } else {
      this.opacity += (this.baseOpacity - this.opacity) * 0.03;
    }

    this.vx += (targetX - this.x) * 0.012;
    this.vy += (targetY - this.y) * 0.012;
    this.vx *= 0.94;
    this.vy *= 0.94;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PARTICLE_COUNT = 220;
let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new MicroParticle());
  }
}
initParticles();

let startTime = performance.now();

function animate() {
  ctx.clearRect(0, 0, W, H);
  const time = (performance.now() - startTime) / 1000;

  // Draw soft blended blobs first
  drawBlobs(time);

  // Draw tiny particles on top
  for (const p of particles) {
    p.update(time);
    p.draw();
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(animate);
}

animate();


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

    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    btn.style.transition = 'transform 0.1s ease-out';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
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
