document.addEventListener('DOMContentLoaded', () => {

  /* ───────────────── HERO SLIDESHOW ───────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');

  let currentSlide = 0;
  let timer;

  function setSlide(index) {
    if (!slides.length) return;
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function next() { setSlide(currentSlide + 1); }

  function start() {
    if (!slides.length) return;
    clearInterval(timer);
    timer = setInterval(() => { if (!document.hidden) next(); }, 5000);
  }

  function stop() { clearInterval(timer); }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
    start();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stop();
      setSlide(Number(dot.dataset.i));
      start();
    });
  });

  const hero = document.querySelector('.hero');

  // Pausa só no desktop (dispositivos sem touch)
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) {
    hero?.addEventListener('mouseenter', stop);
    hero?.addEventListener('mouseleave', start);
  }

  // Swipe no mobile
  let startX = 0;
  hero?.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  hero?.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) next();
    if (endX - startX > 50) setSlide(currentSlide - 1);
  });

  /* ───────────────── HEADER SCROLL ───────────────── */
  const header = document.getElementById('hdr');

  // CORRIGIDO: adiciona .s ao descer, remove ao subir (não só no topo)
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('s');
    } else {
      header.classList.remove('s');
    }
  }, { passive: true });

  /* ───────────────── MOBILE MENU ───────────────── */
  const mobileNav = document.getElementById('mobNav');
  const burger    = document.getElementById('burgerBtn');
  const closeBtn  = document.getElementById('mobClose');

  function openMenu() {
    mobileNav?.classList.add('open');
    burger?.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileNav?.classList.remove('open');
    burger?.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  burger?.addEventListener('click', () =>
    mobileNav?.classList.contains('open') ? closeMenu() : openMenu()
  );

  closeBtn?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mob-link').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  // Fecha ao clicar fora do menu
  document.addEventListener('click', e => {
    if (
      mobileNav?.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !burger?.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ───────────────── COUNTERS ───────────────── */
  const counters = [
    { el: document.getElementById('c1'), target: 5000, suffix: '+' },
    { el: document.getElementById('c2'), target: 8,    suffix: '+' },
    { el: document.getElementById('c3'), target: 30,   suffix: '+' },
    { el: document.getElementById('c4'), target: 200,  suffix: '+' }
  ];

  let started = false;
  const strip = document.querySelector('.strip');

  if (strip) {
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        counters.forEach(c => {
          if (!c.el) return;
          let value = 0;
          const step = c.target / 60;
          const interval = setInterval(() => {
            value += step;
            if (value >= c.target) { value = c.target; clearInterval(interval); }
            c.el.textContent = Math.floor(value).toLocaleString('pt-BR') + c.suffix;
          }, 20);
        });
      }
    }, { threshold: 0.5 });
    counterObserver.observe(strip);
  }

  /* ───────────────── REVEAL ON SCROLL ───────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ───────────────── LIGHTBOX ───────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  if (lightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll('.g-item img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ───────────────── ESCAPE KEY (unificado) ───────────────── */
  // CORRIGIDO: um único listener para fechar menu E lightbox com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

});