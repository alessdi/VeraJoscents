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

// ============================================================
// REGISTRO DE ADQUISICIONES (CARRITO)
// ============================================================
const CART_KEY = 'vj-cart-v1';
let cart = [];

try {
  cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
} catch (e) {
  cart = [];
}

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartFooterEl = document.getElementById('cartFooter');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartCountEl = document.querySelector('.cart-count');
const navCartBtn = document.querySelector('.nav-cart');
const cartCloseBtn = document.getElementById('cartClose');

function formatMXN(n) {
  return '$' + n.toLocaleString('es-MX') + ' MXN';
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
}

function renderCart() {
  const totalQty = cart.reduce((sum, it) => sum + it.qty, 0);
  cartCountEl.textContent = totalQty;

  if (cart.length === 0) {
    cartItemsEl.style.display = 'none';
    cartFooterEl.style.display = 'none';
    cartEmptyEl.style.display = 'flex';
    return;
  }
  cartItemsEl.style.display = 'flex';
  cartFooterEl.style.display = 'block';
  cartEmptyEl.style.display = 'none';

  cartItemsEl.innerHTML = cart.map((it, i) => `
    <div class="cart-item" data-index="${i}">
      <div class="cart-item-frame"><img src="${it.image}" alt=""></div>
      <div class="cart-item-info">
        <p class="cart-item-title">"${it.title}"</p>
        <p class="cart-item-meta">${it.meta} &middot; Talla ${it.size}</p>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-action="dec" aria-label="Quitar una unidad">−</button>
          <span class="cart-qty-num">${it.qty}</span>
          <button class="cart-qty-btn" data-action="inc" aria-label="Añadir una unidad">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${formatMXN(it.price * it.qty)}</span>
        <button class="cart-item-remove" data-action="remove">Quitar</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  cartSubtotalEl.textContent = formatMXN(subtotal);
}

function addToCart(data) {
  const existing = cart.find((it) => it.title === data.title && it.size === data.size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      title: data.title,
      meta: data.meta,
      size: data.size,
      price: parseFloat(data.price),
      image: data.image,
      qty: 1,
    });
  }
  saveCart();
  renderCart();
  if (cartCountEl) {
    cartCountEl.classList.remove('pulse');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('pulse');
  }
}

function openCart() {
  cartDrawer.classList.add('is-open');
  cartOverlay.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-open');
}
function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartOverlay.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-open');
}

if (navCartBtn) navCartBtn.addEventListener('click', openCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

if (cartItemsEl) {
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const itemEl = btn.closest('.cart-item');
    const index = parseInt(itemEl.dataset.index, 10);
    const action = btn.dataset.action;

    if (action === 'inc') cart[index].qty += 1;
    if (action === 'dec') {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    if (action === 'remove') cart.splice(index, 1);

    saveCart();
    renderCart();
  });
}

document.querySelectorAll('.cart-checkout').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (cart.length === 0) return;

    // Número de WhatsApp de contacto (formato internacional, sin "+" ni espacios)
    const WHATSAPP_NUMBER = '529811433701';

    const lineas = cart.map((it, i) => {
      const sub = it.price * it.qty;
      return `${i + 1}. "${it.title}" (${it.meta.replace(/·.*/, '').trim()}, Talla ${it.size}) — Cant. ${it.qty} — ${formatMXN(sub)}`;
    }).join('\n');

    const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    const piezaLabel = cart.reduce((n, it) => n + it.qty, 0) === 1 ? 'la siguiente pieza' : 'las siguientes piezas';

    const mensaje =
      `Buenas tardes. A través del sitio de Vera Joscents me gustaría solicitar la adquisición de ${piezaLabel} de la Colección Cápsula Nº 33:\n\n` +
      `${lineas}\n\n` +
      `Subtotal: ${formatMXN(subtotal)}\n\n` +
      `Quedo al pendiente de los siguientes pasos para completar la adquisición. Gracias.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    btn.textContent = 'Abriendo WhatsApp…';
    setTimeout(() => {
      window.open(url, '_blank');
      btn.textContent = 'Solicitar Adquisición';
    }, 400);
  });
});

// --- Botones "Adquirir la pieza" → abren el modal de tallas ---
const sizeOverlay = document.getElementById('sizeOverlay');
const sizeModal = document.getElementById('sizeModal');
const sizeModalTitle = document.getElementById('sizeModalTitle');
const sizeOptionsEl = document.getElementById('sizeOptions');
const sizeConfirmBtn = document.getElementById('sizeConfirm');
const sizeModalCloseBtn = document.getElementById('sizeModalClose');
const sizeHintEl = document.getElementById('sizeHint');

let pendingItem = null;
let pendingBtn = null;
let selectedSize = null;

function openSizeModal(data, btn) {
  pendingItem = data;
  pendingBtn = btn;
  selectedSize = null;
  sizeModalTitle.textContent = `"${data.title}"`;
  sizeOptionsEl.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('is-selected'));
  sizeConfirmBtn.disabled = true;
  sizeHintEl.textContent = 'Elige una talla para continuar.';

  sizeModal.classList.add('is-open');
  sizeOverlay.classList.add('is-open');
  sizeModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('size-modal-open');
}

function closeSizeModal() {
  sizeModal.classList.remove('is-open');
  sizeOverlay.classList.remove('is-open');
  sizeModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('size-modal-open');
  pendingItem = null;
  pendingBtn = null;
}

if (sizeOptionsEl) {
  sizeOptionsEl.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      sizeOptionsEl.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      sizeConfirmBtn.disabled = false;
      sizeHintEl.textContent = `Talla ${selectedSize} seleccionada.`;
    });
  });
}

if (sizeConfirmBtn) {
  sizeConfirmBtn.addEventListener('click', () => {
    if (!selectedSize || !pendingItem) return;
    addToCart({ ...pendingItem, size: selectedSize });
    if (pendingBtn) {
      const original = 'Adquirir la pieza';
      pendingBtn.textContent = 'Añadida a la colección ✓';
      setTimeout(() => { pendingBtn.textContent = original; }, 1600);
    }
    closeSizeModal();
  });
}

if (sizeModalCloseBtn) sizeModalCloseBtn.addEventListener('click', closeSizeModal);
if (sizeOverlay) sizeOverlay.addEventListener('click', closeSizeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSizeModal();
});

document.querySelectorAll('.placard-cta').forEach((btn) => {
  btn.addEventListener('click', () => {
    openSizeModal({
      title: btn.dataset.title,
      meta: btn.dataset.meta,
      price: btn.dataset.price,
      image: btn.dataset.image,
    }, btn);
  });
});

renderCart();