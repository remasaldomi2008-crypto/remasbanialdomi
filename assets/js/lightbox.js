function initGallery(containerId, images, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Create tiles
  container.innerHTML = images.map((img, idx) => `
    <button class="tile" type="button" aria-label="Open image: ${escapeHtml(img.caption || ('Image ' + (idx+1)))}" data-idx="${idx}">
      <img loading="lazy" src="${img.src}" alt="${escapeHtml(img.alt || img.caption || 'Gallery image')}" />
      ${img.caption ? `<div class="cap">${escapeHtml(img.caption)}</div>` : ``}
    </button>
  `).join('');

  // Lightbox elements (created once per page)
  let lb = document.querySelector('.lb');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = `
      <div class="lb-inner" role="dialog" aria-modal="true" aria-label="Image viewer">
        <div class="lb-top">
          <div class="lb-title" data-lb-title>Viewer</div>
          <button class="lb-close" type="button" data-lb-close>Close</button>
        </div>
        <div class="lb-body">
          <button class="lb-nav lb-prev" type="button" aria-label="Previous" data-lb-prev>&larr;</button>
          <img data-lb-img alt="" />
          <button class="lb-nav lb-next" type="button" aria-label="Next" data-lb-next>&rarr;</button>
        </div>
        <div class="lb-cap">
          <span data-lb-cap></span>
          <span style="float:right" class="kbd">←</span> <span class="kbd">→</span> <span class="kbd">Esc</span>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
  }

  const elImg = lb.querySelector('[data-lb-img]');
  const elCap = lb.querySelector('[data-lb-cap]');
  const elTitle = lb.querySelector('[data-lb-title]');
  const btnClose = lb.querySelector('[data-lb-close]');
  const btnPrev = lb.querySelector('[data-lb-prev]');
  const btnNext = lb.querySelector('[data-lb-next]');

  let current = 0;
  let autoplay = null;
  const autoplayMs = options.autoplayMs || 3500;

  function show(i) {
    current = (i + images.length) % images.length;
    const it = images[current];
    elImg.src = it.src;
    elImg.alt = it.alt || it.caption || 'Gallery image';
    elCap.textContent = it.caption || '';
    elTitle.textContent = options.title || 'Gallery';
  }

  function openAt(i) {
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    stopAutoplay();
  }

  function next(){ show(current + 1); }
  function prev(){ show(current - 1); }

  function startAutoplay(){
    stopAutoplay();
    autoplay = setInterval(next, autoplayMs);
  }
  function stopAutoplay(){
    if (autoplay) clearInterval(autoplay);
    autoplay = null;
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-idx]');
    if (!btn) return;
    openAt(parseInt(btn.getAttribute('data-idx'), 10));
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Optional slideshow controls
  const autoplayBtn = document.querySelector('[data-autoplay]');
  const stopBtn = document.querySelector('[data-stop]');
  if (autoplayBtn) autoplayBtn.addEventListener('click', startAutoplay);
  if (stopBtn) stopBtn.addEventListener('click', stopAutoplay);
}

function escapeHtml(str){
  return String(str || '').replace(/[&<>"']/g, (m) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[m]));
}
