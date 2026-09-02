export function createHero({ direction }) {
  return `
    <section class="hero surface" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">UAE-inspired delivery menu</p>
        <h1 id="hero-title">Fast cravings, warm meals, and a smoother delivery-style flow.</h1>
        <p class="hero__text">
          Browse familiar burgers, chicken, breakfast, desserts, and drinks in an original demo experience designed for quick ordering on mobile and desktop.
        </p>
        <div class="hero__actions">
          <a class="button button--primary" href="#menu-section">Start your order</a>
          <button class="button button--secondary" type="button" data-action="toggle-dir">
            ${direction === "rtl" ? "Switch to LTR" : "Preview RTL"}
          </button>
        </div>
      </div>
      <div class="hero__panel" aria-hidden="true">
        <div class="hero__badge">
          <span>🚚</span>
          <strong>Delivery demo</strong>
        </div>
        <ul class="hero__highlights">
          <li>Search menu items instantly</li>
          <li>Filter veg and non-veg choices</li>
          <li>Review a mock checkout summary</li>
        </ul>
      </div>
    </section>
  `;
}
