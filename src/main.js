import './style.scss';
import  products from'./products.json';
import { showProductContainer } from "./homeProductsCards";
import viteLogo from '/vite.svg'
import javascriptLogo from './javascript.svg'
showProductContainer(products);

// ================= Theme Toggle with persistence =================
const root = document.documentElement;
const THEME_KEY = 'theme';
function applyTheme(theme){
  root.classList.toggle('theme-dark', theme === 'dark');
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}
initTheme();
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const isDark = root.classList.toggle('theme-dark');
    const next = isDark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });
  // set initial icon
  themeToggle.textContent = root.classList.contains('theme-dark') ? '☀️' : '🌙';
}

// ================= Navbar hamburger =================
const nav = document.querySelector('.section-navbar .navbar');
const navToggle = document.getElementById('navToggle');
if(nav && navToggle){
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// ================= Preloader =================
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => { if(preloader){ preloader.style.display = 'none'; }});

// ================= Back to Top =================
const backToTop = document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// ================= Smooth scroll fallback =================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});

// ================= Lightbox (simple) =================
const lightbox = document.getElementById('lightbox');
const lightImg = document.getElementById('lightboxImage');
const lightPrev = document.getElementById('lightPrev');
const lightNext = document.getElementById('lightNext');
let galleryImages = [];
let currentIndex = 0;
function openLightbox(idx){
  if(!lightbox || !lightImg) return;
  currentIndex = idx;
  lightImg.src = galleryImages[currentIndex].src;
  lightbox.classList.add('open');
}
function closeLightbox(){ if(lightbox) lightbox.classList.remove('open'); }
function showPrev(){ currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; lightImg.src = galleryImages[currentIndex].src; }
function showNext(){ currentIndex = (currentIndex + 1) % galleryImages.length; lightImg.src = galleryImages[currentIndex].src; }

if(lightbox){
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
  lightPrev && lightPrev.addEventListener('click', (e)=>{ e.stopPropagation(); showPrev(); });
  lightNext && lightNext.addEventListener('click', (e)=>{ e.stopPropagation(); showNext(); });
  document.addEventListener('keydown', (e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showPrev();
    if(e.key === 'ArrowRight') showNext();
  });
  // collect images for gallery (only visible content area)
  galleryImages = Array.from(document.querySelectorAll('img'))
    .filter(img => !img.closest('.lightbox-overlay') && img.src);
  galleryImages.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => { e.preventDefault(); openLightbox(idx); });
  });
}

// ================= Lazy loading for all images =================
document.querySelectorAll('img').forEach(img => {
  if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
});

// ================= Placeholder counters & carousel (hooks) =================
// Implement counters and carousel when respective markup is added
