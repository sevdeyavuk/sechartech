/* ═══════════════════════════════════════════
   SECHARTECH — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR scroll effect ───
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ─── HAMBURGER MENU ───
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ─── SMOOTH ANCHOR SCROLL (offset for fixed header) ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-delay]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards in the same parent
        const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
        let delay = 0;
        siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED STAT COUNTERS ───
  const statItems = document.querySelectorAll('.stat-item[data-count]');

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const numEl  = el.querySelector('.stat-num');
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(eased * target);
      numEl.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => counterObserver.observe(el));

  // ─── BACK TO TOP ───
  const backTop = document.getElementById('back-top');
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── CONTACT FORM ───
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.disabled = true;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Gönderiliyor...';

      // Simulate send (replace with real backend / Formspree endpoint)
      setTimeout(() => {
        form.reset();
        btn.style.display = 'none';
        formSuccess.classList.add('visible');
        // Re-init lucide icons for the success checkmark
        lucide.createIcons();
      }, 1500);
    });
  }

  // ─── ACTIVE NAV LINK on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-item[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav-active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

});

/* ─── CSS for spin animation + active nav (injected) ─── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }
    .nav-active {
      background: rgba(82, 183, 136, 0.15) !important;
      color: var(--green-300) !important;
    }
    .scrolled .nav-active {
      background: var(--green-100) !important;
      color: var(--green-700) !important;
    }
  `;
  document.head.appendChild(style);
})();
