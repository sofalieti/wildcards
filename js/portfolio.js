/* =====================================================
   Portfolio Page — JavaScript
   Lightbox + AOS + Back to Top + Navbar
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- AOS ---- */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
  });

  /* ---- Back to top ---- */
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =====================================================
     LIGHTBOX
     Collects all [data-lightbox="true"] elements,
     shows them in a 900×1200 modal with prev/next/keyboard
     ===================================================== */

  const lightbox   = document.getElementById('pfLightbox');
  const lbImg      = document.getElementById('pfLbImg');
  const lbCaption  = document.getElementById('pfLbCaption');
  const lbCounter  = document.getElementById('pfLbCounter');
  const lbLoader   = document.getElementById('pfLbLoader');
  const lbClose    = document.getElementById('pfLbClose');
  const lbPrev     = document.getElementById('pfLbPrev');
  const lbNext     = document.getElementById('pfLbNext');
  const lbBackdrop = document.getElementById('pfLbBackdrop');

  // Collect all gallery items
  const items = Array.from(document.querySelectorAll('[data-lightbox="true"]'));
  let current = 0;

  const loadImage = (index) => {
    const item = items[index];
    const src  = item.dataset.src;
    const cap  = item.dataset.caption || '';

    lbImg.classList.add('loading');
    lbLoader.classList.add('visible');
    lbCaption.textContent = cap;
    lbCounter.textContent = `${index + 1} / ${items.length}`;

    const tempImg = new Image();
    tempImg.onload = () => {
      lbImg.src = src;
      lbImg.alt = cap;
      lbImg.classList.remove('loading');
      lbLoader.classList.remove('visible');
    };
    tempImg.src = src;
    current = index;

    // Update nav visibility
    lbPrev.style.opacity = items.length > 1 ? '1' : '0';
    lbNext.style.opacity = items.length > 1 ? '1' : '0';
  };

  const openLightbox = (index) => {
    loadImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  const showPrev = () => {
    const newIndex = (current - 1 + items.length) % items.length;
    loadImage(newIndex);
  };

  const showNext = () => {
    const newIndex = (current + 1) % items.length;
    loadImage(newIndex);
  };

  // Attach click to all gallery items
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Touch/swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (!lightbox.classList.contains('active')) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });

  /* ---- Hover pulse on product cards ---- */
  document.querySelectorAll('.pf-after-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '5';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });

  /* ---- Smooth anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

});
