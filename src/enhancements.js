// Global frontend enhancements: image flip + lazy-load, dark mode, smooth scroll,
// back-to-top button, ripple effect, responsive navbar (hamburger), and form validation.

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch (err) {
    // ignore storage errors
  }
}

function initThemeToggle(container) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  toggle.title = 'Toggle dark mode';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.innerHTML = '🌓';
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
  container.appendChild(toggle);
}

function initHamburger(container, nav) {
  if (!nav) return;
  const hb = document.createElement('button');
  hb.type = 'button';
  hb.className = 'hamburger';
  hb.setAttribute('aria-label', 'Toggle navigation');
  hb.setAttribute('aria-expanded', 'false');
  hb.innerHTML = '<span class="bar"></span>';
  hb.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hb.classList.toggle('active', isOpen);
    hb.setAttribute('aria-expanded', String(isOpen));
  });
  container.insertBefore(hb, nav);

  // Close nav on link click (useful for single-page anchors)
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      nav.classList.remove('open');
      hb.classList.remove('active');
      hb.setAttribute('aria-expanded', 'false');
    }
  });

  // Reset state on resize
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      nav.classList.remove('open');
      hb.classList.remove('active');
      hb.setAttribute('aria-expanded', 'false');
    }
  });
}

function processImage(img) {
  try {
    img.classList.add('flipped-img');
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  } catch (_) {
    // ignore
  }
}

function initImagesObserver() {
  document.querySelectorAll('img').forEach(processImage);
  const observer = new MutationObserver((records) => {
    for (const rec of records) {
      rec.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') {
          processImage(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(processImage);
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);
  const onScroll = () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function addRipple(el) {
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}

function initRipples() {
  document.querySelectorAll('button, .btn, a').forEach(addRipple);
}

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function showFieldError(field) {
  const container = field.parentElement || field;
  let msg = container.querySelector('.error-msg');
  field.classList.add('input-error');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'error-msg';
    container.appendChild(msg);
  }
  msg.textContent = field.validationMessage || 'Please fill out this field';
}

function clearFieldError(field) {
  const container = field.parentElement || field;
  field.classList.remove('input-error');
  const msg = container.querySelector('.error-msg');
  if (msg) msg.remove();
}

function initFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const fields = Array.from(form.querySelectorAll('[required]'));
      let valid = true;
      fields.forEach((f) => {
        if (!f.checkValidity()) {
          valid = false;
          showFieldError(f);
        } else {
          clearFieldError(f);
        }
      });
      if (!valid) e.preventDefault();
    });

    form.addEventListener('input', (e) => {
      const target = e.target;
      if (target && target.matches('[required]')) {
        if (target.checkValidity()) clearFieldError(target);
      }
    });
  });
}

function bootstrap() {
  // Theme initialization
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (prefersDark ? 'dark' : 'light'));
  } catch (_) {
    applyTheme('light');
  }

  const headerContainer = document.querySelector('.section-navbar .container');
  const nav = document.querySelector('.section-navbar .navbar');
  if (headerContainer) {
    initThemeToggle(headerContainer);
  }
  if (headerContainer && nav) {
    initHamburger(headerContainer, nav);
  }
  initImagesObserver();
  initBackToTop();
  initRipples();
  initSmoothScroll();
  initFormValidation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
