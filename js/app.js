document.addEventListener('DOMContentLoaded', () => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* HERO */
  const slides = $$('.hero-slide'), dots = $$('.hero-dot'), hero = $('.hero');
  let cur = 0, timer;
  function setSlide(i) {
    if (!slides.length) return;
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active'); dots[cur]?.removeAttribute('aria-current');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active'); dots[cur]?.setAttribute('aria-current', 'true');
  }
  const stop  = () => clearInterval(timer);
  const start = () => {
    stop();
    if (slides.length > 1 && !reduce) timer = setInterval(() => { if (!document.hidden) setSlide(cur + 1); }, 5000);
  };
  setSlide(0); start();
  dots.forEach(d => d.addEventListener('click', () => { stop(); setSlide(Number(d.dataset.i)); start(); }));
  if (hero && !matchMedia('(hover: none)').matches) {
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
  }
  let sx = 0;
  hero?.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const d = e.changedTouches[0].screenX - sx;
    if (Math.abs(d) > 50) { stop(); setSlide(cur + (d < 0 ? 1 : -1)); start(); }
  }, { passive: true });

  /* MENU MOBILE */
  const nav = $('#mobNav'), burger = $('#burgerBtn');
  const setMenu = open => {
    nav?.classList.toggle('open', open);
    burger?.classList.toggle('open', open);
    burger?.setAttribute('aria-expanded', String(open));
  };
  burger?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $('#mobClose')?.addEventListener('click', () => setMenu(false));
  $$('.mob-link').forEach(l => l.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => {
    if (nav?.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });

  /* REVEAL */
  const rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add('vis'));

  /* LIGHTBOX */
  const lb = $('#lightbox'), lbImg = $('#lightboxImg');
  const imgs = $$('.g-item img');
  let idx = 0, opener = null, lx = 0;
  const show = i => {
    idx = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[idx].currentSrc || imgs[idx].src;
    lbImg.alt = imgs[idx].alt;
  };
  const openLb = i => {
    opener = document.activeElement; show(i);
    lb.classList.add('active'); document.body.style.overflow = 'hidden';
    $('#lightboxClose').focus();
  };
  const closeLb = () => {
    if (!lb.classList.contains('active')) return;
    lb.classList.remove('active'); document.body.style.overflow = '';
    lbImg.removeAttribute('src'); opener?.focus();
  };
  if (lb && imgs.length) {
    imgs.forEach((img, i) => {
      const box = img.closest('.g-item');
      box.tabIndex = 0; box.setAttribute('role', 'button'); box.setAttribute('aria-label', 'Ampliar: ' + img.alt);
      box.addEventListener('click', () => openLb(i));
      box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); } });
    });
    $('#lightboxClose').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', () => show(idx - 1));
    $('#lbNext').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    lb.addEventListener('touchstart', e => { lx = e.changedTouches[0].screenX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const d = e.changedTouches[0].screenX - lx;
      if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
    }, { passive: true });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setMenu(false); closeLb(); }
    if (lb?.classList.contains('active')) {
      if (e.key === 'ArrowLeft')  show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    }
  });

  /* CONTADORES */
  const strip = $('.strip'), counters = $$('[data-target]');
  if (strip && counters.length && !reduce && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      co.disconnect();
      counters.forEach(el => {
        const t = Number(el.dataset.target); let v = 0;
        const iv = setInterval(() => {
          v += t / 60;
          if (v >= t) { v = t; clearInterval(iv); }
          el.textContent = Math.floor(v).toLocaleString('pt-BR') + '+';
        }, 20);
      });
    }, { threshold: .5 });
    co.observe(strip);
  }

  /* WhatsApp: evento para Analytics (só dispara se o gtag existir) */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="wa.me"]');
    if (a && typeof window.gtag === 'function') window.gtag('event', 'whatsapp_click', { link_text: a.textContent.trim().slice(0, 40) });
  });
});
