document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
});

function renderFooter() {
  const container = document.getElementById("footer-placeholder");
  if (!container) return;

  const currentYear = new Date().getFullYear();

  const footerHtml = `
    <div class="container">
      <div class="footer-row">
        <div style="display: flex; align-items: center; gap: 0.5rem; text-align: left;">
          <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-main);">MediPredict AI</span>
          <span style="font-size: 0.65rem; color: var(--text-muted);">| &copy; ${currentYear} All Rights Reserved</span>
        </div>

        <!-- Developer Watermark -->
        <div class="watermark">
          Project Developed by <span>Vaishnav S Nair</span>
        </div>

        <!-- Prominent Medical Disclaimer -->
        <div style="max-width: 20rem; text-align: left; md-text-align: right;">
          <p style="font-size: 0.6rem; color: var(--color-warning); background: rgba(245, 158, 11, 0.05); padding: 0.4rem 0.65rem; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.15); line-height: 1.4;">
            ⚠️ Disclaimer: This application is for educational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = footerHtml;
}
