/* =====================================================
   WildCards — main.js
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- AOS ---- */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ---- Navbar scroll ---- */
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
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav
        const bsCollapse = document.getElementById('navMenu');
        if (bsCollapse && bsCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(bsCollapse)?.hide();
        }
      }
    });
  });

  /* ---- Back to top ---- */
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Form submit (toast feedback) ---- */
  const toastEl = document.getElementById('formToast');
  const showToast = () => {
    if (toastEl) {
      new bootstrap.Toast(toastEl, { delay: 4000 }).show();
    }
  };

  ['heroForm', 'contactForm'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast();
      form.reset();
    });
  });

  /* ---- Hero background particle effect ---- */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0.35;';
    heroSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const resize = () => {
      W = canvas.width  = heroSection.offsetWidth;
      H = canvas.height = heroSection.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const Particle = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
    };

    particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203,17,171,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
});
