// Theme toggle — robust, safe, drop-in replacement
(function () {
  const THEME_KEY = 'theme'; // same key as your current storage
  const body = document.body;
  const root = document.documentElement;

  // Small helper to set FontAwesome icon reliably
  function setIcon(iconEl, theme) {
    if (!iconEl) return;
    // make sure we use solid style classes consistently
    if (theme === 'dark') {
      iconEl.className = 'fa-solid fa-moon';
      iconEl.setAttribute('title', 'Switch to light mode');
    } else {
      iconEl.className = 'fa-solid fa-sun';
      iconEl.setAttribute('title', 'Switch to dark mode');
    }
  }

  // Apply theme by adding/removing classes on <body> and <html>
  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      root.classList.remove('dark-mode');
      root.classList.add('light-mode');
    }
    // update icon
    const icon = document.getElementById('theme-icon');
    setIcon(icon, theme);
  }

  // Toggle and persist
  function toggleTheme() {
    const isDark = body.classList.contains('dark-mode');
    const next = isDark ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
  }

  // Determine initial theme: prefer stored setting, otherwise default to DARK
  function initialTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) { /* ignore */ }
    return 'dark'; // default to dark to match your site's design
  }

  // Initialize once DOM is ready
  function init() {
    const toggleBtn = document.getElementById('theme-toggle');
    // Set initial theme (this ensures the site doesn't flash white)
    const initTheme = initialTheme();
    applyTheme(initTheme);

    // Attach click handler (defensive)
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    }

    // Listen to system preference changes only if the user hasn't explicitly chosen a theme
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e) => {
        try {
          const stored = localStorage.getItem(THEME_KEY);
          if (!stored) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        } catch (err) {}
      });
    } catch (err) { /* ignore on older browsers */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose for debugging
  window.setTheme = applyTheme;
})();
