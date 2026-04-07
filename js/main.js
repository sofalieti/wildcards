/* =====================================================
   WB Expert — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- AOS Init ---- */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ---- Navbar scroll behaviour ---- */
  const mainNav = document.getElementById('mainNav');
  const onScroll = () => {
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.wb-navbar .nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      if (
        scrollY >= section.offsetTop &&
        scrollY < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = mainNav ? mainNav.offsetHeight + 10 : 70;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth',
      });
      // Close mobile menu
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navCollapse).hide();
      }
    });
  });

  /* ---- Counter animation ---- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('ru-RU');
      if (current < target) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('ru-RU');
      }
    };
    requestAnimationFrame(tick);
  };

  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---- Back to top ---- */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Form submissions (toast) ---- */
  const toastEl = document.getElementById('formToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

  const handleFormSubmit = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Basic validation
      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          valid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });
      if (!valid) return;

      // Simulate send
      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправляем...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.disabled = false;
        form.reset();
        toast.show();
      }, 1200);
    });

    // Remove invalid on input
    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('is-invalid'));
    });
  };

  handleFormSubmit('heroForm');
  handleFormSubmit('contactForm');

  /* ---- Particle generator for hero ---- */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.classList.add('particle');
      const size = Math.random() * 6 + 3;
      const left = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 10;
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -${size}px;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        opacity: ${Math.random() * 0.3 + 0.05};
        background: ${Math.random() > 0.5 ? '#CB11AB' : '#9b59ff'};
      `;
      particleContainer.appendChild(dot);
    }
  }

  /* ---- Typing effect for hero subtitle ---- */
  const heroTitle = document.querySelector('.hero-badge');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(10px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 400);
  }

  /* ---- Portfolio carousel pause on hover ---- */
  ['portfolioCarousel', 'reviewsCarousel'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('mouseenter', () => {
      bootstrap.Carousel.getInstance(el)?.pause();
    });
    el.addEventListener('mouseleave', () => {
      bootstrap.Carousel.getInstance(el)?.cycle();
    });
  });

  /* ---- Sync carousel indicator dots ---- */
  document.querySelectorAll('.carousel').forEach(carouselEl => {
    carouselEl.addEventListener('slid.bs.carousel', event => {
      const indicators = carouselEl.parentElement.querySelectorAll('.cind');
      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === event.to);
      });
    });
  });

  /* ---- Navbar active style ---- */
  const style = document.createElement('style');
  style.textContent = `
    .wb-navbar .nav-link.active {
      color: #fff !important;
      background: rgba(203, 17, 171, 0.2);
    }
    .form-control.is-invalid,
    .form-select.is-invalid {
      border-color: #f87171 !important;
      box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2) !important;
    }
  `;
  document.head.appendChild(style);

  /* ---- Service card click ripple ---- */
  document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(203, 17, 171, 0.15);
        transform: scale(0);
        animation: rippleAnim 0.6s linear;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        pointer-events: none;
        z-index: 10;
      `;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ---- Footer subscribe form ---- */
  const footerSubForm = document.querySelector('.footer-subscribe');
  if (footerSubForm) {
    const btn = footerSubForm.querySelector('button');
    btn.addEventListener('click', () => {
      const input = footerSubForm.querySelector('input');
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#f87171';
        input.focus();
        setTimeout(() => (input.style.borderColor = ''), 2000);
        return;
      }
      input.value = '';
      toast.show();
    });
  }

});
