// ===== NAVBAR: scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== MOBILE MENU: hamburger toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const observerOptions = { threshold: 0.35 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

// ===== ANIMATE FEATURE BARS on scroll =====
const bars = document.querySelectorAll('.feature-bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.style.width;
      fill.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { fill.style.width = target; }, 80);
      });
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

bars.forEach(bar => {
  const original = bar.style.width;
  bar.style.width = '0';
  bar.dataset.target = original;
  barObserver.observe(bar);
});

// ===== FADE IN on scroll =====
const fadeEls = document.querySelectorAll(
  '.feature-card, .showcase-card, .step-card, .about-grid > *'
);

const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-hidden { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(fadeStyle);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('fade-visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => {
  el.classList.add('fade-hidden');
  fadeObserver.observe(el);
});

// ===== SMOOTH ANCHOR scroll offset (for fixed navbar) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 75;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
