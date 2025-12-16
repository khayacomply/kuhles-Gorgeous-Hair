/* main.js - Kuhlez Gorgeous Hair */
/* ✅ Replace with your real WhatsApp number when live */
const WHATSAPP_NUMBER = '+27794018756'; // Updated to your current business number

document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true });
  }

  // WhatsApp button logic
  const waBtn = document.getElementById('whatsapp-float-btn');
  const waPopup = document.getElementById('whatsapp-popup');

  if (waBtn) {
    waBtn.addEventListener('click', function () {
      const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, ''); // Strips out +, spaces, dashes → 27794018756
      const url = `https://wa.me/${cleanNumber}`; // ✅ Fixed: removed extra spaces
      window.open(url, '_blank');
    });
  }

  // Close popup when clicking elsewhere
  document.addEventListener('click', function (e) {
    if (!waPopup || !waPopup.classList.contains('visible')) return;
    if (!waPopup.contains(e.target) && e.target !== waBtn) {
      waPopup.classList.remove('visible');
    }
  });

  // Lightbox (simplified)
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const src = this.tagName === 'IMG' ? this.src : this.querySelector('img').src;
      openLightbox(src);
    });
  });

  // Carousel swipe (Bootstrap 5 compatible)
  document.querySelectorAll('.carousel').forEach(car => {
    let startX = 0;
    car.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    car.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        const bsCarousel = bootstrap.Carousel.getInstance(car) || new bootstrap.Carousel(car);
        bsCarousel[diff > 0 ? 'next' : 'prev']();
      }
    }, { passive: true });
  });

  // ✅ NEW: Load products from JSON on shop.html
  if (document.getElementById('wigs-container') || document.getElementById('braids-container')) {
    loadProducts();
  }
});

// Simple lightbox
function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.id = 'simple-lightbox';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.9);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000; cursor: pointer; padding: 20px;
  `;
  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = `
    max-width: 90%; max-height: 90%; border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.7);
  `;
  overlay.appendChild(img);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', () => overlay.remove());
}

// Fallback scroll animation
(function () {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-fade]').forEach(el => observer.observe(el));
})();

// ✅ NEW: Product loader function
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    const data = await response.json();

    // Render wigs
    const wigsContainer = document.getElementById('wigs-container');
    if (wigsContainer && data.wigs) {
      wigsContainer.innerHTML = data.wigs.map(product => `
        <div class="col-md-6 col-lg-4">
          <div class="card p-3 h-100">
            <img src="${product.image}" loading="lazy" class="img-fluid rounded mb-2" alt="${product.alt}">
            <h5 class="card-title">${product.name}</h5>
            <p>${product.description}</p>
            <p><strong class="text-pink">${product.price}</strong></p>
            <a class="btn btn-sm btn-primary w-100" href="contact.html?service=wigs">Order / Enquire</a>
          </div>
        </div>
      `).join('');
    }

    // Render braids
    const braidsContainer = document.getElementById('braids-container');
    if (braidsContainer && data.braids) {
      braidsContainer.innerHTML = data.braids.map(product => `
        <div class="col-md-6 col-lg-3">
          <div class="card p-3 h-100">
            <img src="${product.image}" loading="lazy" class="img-fluid rounded mb-2" alt="${product.alt}">
            <h5 class="card-title">${product.name}</h5>
            <p>${product.description}</p>
            <p><strong class="text-pink">${product.price}</strong></p>
            <a class="btn btn-sm btn-primary w-100" href="contact.html?service=braids">Buy Now</a>
          </div>
        </div>
      `).join('');
    }

  } catch (error) {
    console.error('Error loading products:', error);
  }
}
