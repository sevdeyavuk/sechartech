/* ═══════════════════════════════════════════
   SECHARTECH — script.js (düzeltilmiş)
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Tüm elementleri en başta tanımla ───
  const header    = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const backTop   = document.getElementById('back-top');
  const form      = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  // ─── NAVBAR + BACK TO TOP scroll efekti ───
  const onScroll = () => {
    if (header)  header.classList.toggle('scrolled', window.scrollY > 40);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // sayfa açılışında bir kez çalıştır

  // ─── HAMBURGER MENU ───
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── SMOOTH SCROLL (sabit navbar offset) ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── SCROLL REVEAL animasyonu ───
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-delay]');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Kardeş elementlerle kademeli giriş
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('[data-reveal]')
          );
          const idx   = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? idx * 80 : 0;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── SAYAÇ ANİMASYONU ───
  const statItems = document.querySelectorAll('.stat-item[data-count]');

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const numEl    = el.querySelector('.stat-num');
    if (!numEl) return;
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.round(eased * target);
      numEl.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (statItems.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statItems.forEach(el => counterObserver.observe(el));
  }

  // ─── BACK TO TOP butonu ───
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── İLETİŞİM FORMU ───
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      if (!btn) return;
      btn.disabled = true;
      btn.textContent = 'Gönderiliyor...';

      setTimeout(() => {
        form.reset();
        btn.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }, 1500);
    });
  }

  // ─── AKTİF NAV LİNKİ ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-item[href^="#"]');

  if (sections.length > 0) {
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
  }

});

// ─── Aktif nav + spin animasyon CSS ───
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
