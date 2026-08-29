// ============================================================
// VERA JOSCENTS — interacciones del boceto
// ============================================================

// --- Luz de vela siguiendo el cursor (efecto de sala de museo) ---
const spotlight = document.getElementById('spotlight');
if (spotlight && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--x', e.clientX + 'px');
    spotlight.style.setProperty('--y', e.clientY + 'px');
  });
}

// --- Revelado de obras al hacer scroll ---
const obras = document.querySelectorAll('.obra');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
obras.forEach((obra) => revealObserver.observe(obra));

// --- Girar pieza (frente / dorso) ---
document.querySelectorAll('.frame-flip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const frame = btn.closest('.frame-toggle');
    const imgs = frame.querySelectorAll('.frame-img');
    imgs.forEach((img) => img.classList.toggle('is-active'));
  });
});

// --- Nav: adquisiciones (boceto — sin lógica de carrito real) ---
const cartCount = document.querySelector('.cart-count');
document.querySelectorAll('.placard-cta').forEach((btn) => {
  btn.addEventListener('click', () => {
    let n = parseInt(cartCount.textContent, 10) || 0;
    cartCount.textContent = n + 1;
    btn.textContent = 'Añadida a la colección ✓';
    setTimeout(() => { btn.textContent = 'Adquirir la pieza'; }, 1600);
  });
});