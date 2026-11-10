// ===== CONFIGURACIÓN: edita aquí =====
const CONFIG = {
  whatsapp: '51993211395', // código de país + número, sin + ni espacios
  colegio: 'I.E.P. Sagrado Corazón de Jesús de Santa Clara'
};

document.documentElement.classList.add('js');

// Pantalla de entrada: se oculta al cargar la página
const loader = document.getElementById('loader');
const hideLoader = () => setTimeout(() => loader.classList.add('hide'), 700);
window.addEventListener('load', hideLoader);
setTimeout(() => loader.classList.add('hide'), 3000); // por seguridad

// Menú móvil
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
const closeMenu = () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
};
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Sombra de la cabecera y barra de progreso de lectura
const header = document.querySelector('.header');
const bar = document.getElementById('progress');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Aparición de elementos al hacer scroll
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.12 + 's';
  revealObs.observe(el);
});
document.querySelectorAll('.steps').forEach(el => revealObs.observe(el));

// Contadores animados
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const goal = +el.dataset.count;
    const plus = el.dataset.plus || '';
    obs.unobserve(el);
    if (reduce) { el.textContent = goal + plus; return; }
    const start = performance.now(), dur = 1500;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(goal * (1 - Math.pow(1 - p, 3))) + (p === 1 ? plus : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// Formulario: abre WhatsApp con el mensaje armado
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const texto = `Hola, soy ${f.get('nombre')}. Me interesa el grado ${f.get('grado')} en ${CONFIG.colegio}. ${f.get('mensaje') || ''}`.trim();
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
});

// Año del pie de página
document.getElementById('year').textContent = new Date().getFullYear();
