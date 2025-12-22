(function () {
  const btn = document.querySelector('[data-menu-btn]');
  const mobile = document.querySelector('[data-mobile]');
  if (btn && mobile) {
    btn.addEventListener('click', () => mobile.classList.toggle('open'));
  }

  // Mark active link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });
})();
