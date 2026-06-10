document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  initTheme();
});

function initTheme() {
  const saved = localStorage.getItem('static_med_theme') || 'light';
  if (saved === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('static_med_theme', theme);
  
  // Update theme icons
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

function renderNavbar() {
  const container = document.getElementById("navbar-placeholder");
  if (!container) return;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const user = db.getCurrentUser();
  const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const themeIcon = theme === 'light' ? '🌙' : '☀️';

  const links = [
    { href: "index.html", label: "Home" },
    { href: "checker.html", label: "Symptom Checker" },
    { href: "diseases.html", label: "Disease Library" },
    { href: "dashboard.html", label: "Dashboard" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];

  let linksHtml = "";
  links.forEach(link => {
    const active = currentPath === link.href ? "active" : "";
    linksHtml += `<li><a href="${link.href}" class="nav-link ${active}">${link.label}</a></li>`;
  });

  // Always show Admin Panel Link
  const adminActive = currentPath === "admin.html" || currentPath === "admin-login.html" ? "active" : "";
  linksHtml += `<li><a href="admin.html" class="nav-link ${adminActive}">⚠️ Admin Panel</a></li>`;

  let authHtml = "";
  if (user) {
    authHtml = `
      <div class="nav-actions">
        <div style="display: flex; flex-direction: column; text-align: right; line-height: 1.2;">
          <span style="font-size: 0.65rem; font-weight: 700;">${user.name}</span>
          <span style="font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800;">${user.role}</span>
        </div>
        <button onclick="handleLogout()" class="btn btn-secondary" style="padding: 0.35rem 0.65rem;" title="Logout">
          🚪
        </button>
      </div>
    `;
  } else {
    authHtml = `
      <a href="auth.html" class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.65rem;">Sign In</a>
    `;
  }

  const navbarHtml = `
    <div class="nav-container">
      <a href="index.html" class="logo">
        <span class="logo-icon">🩺</span>
        <span class="logo-text">MediPredict<span class="text-gradient">AI</span></span>
      </a>

      <ul class="nav-menu" id="nav-menu">
        ${linksHtml}
      </ul>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <button onclick="toggleTheme()" class="btn btn-secondary" style="padding: 0.35rem; border-radius: 10px;" aria-label="Toggle theme">
          <span class="theme-icon">${themeIcon}</span>
        </button>
        ${authHtml}
        <button onclick="toggleMobileMenu()" class="menu-toggle" aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </div>
  `;

  container.innerHTML = navbarHtml;
}

function toggleMobileMenu() {
  const menu = document.getElementById("nav-menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

function handleLogout() {
  db.logout();
  window.location.href = "index.html";
}
