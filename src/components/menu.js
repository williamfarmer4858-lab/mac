function buildIllustration(item) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${item.image.alt}">
      <rect width="320" height="220" rx="28" fill="${item.image.accentSoft}" />
      <circle cx="255" cy="60" r="38" fill="${item.image.accent}" opacity="0.16" />
      <circle cx="65" cy="170" r="46" fill="${item.image.accent}" opacity="0.12" />
      <text x="160" y="118" text-anchor="middle" font-size="64">${item.image.icon}</text>
      <text x="160" y="182" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#1f2937">${item.name}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createCategoryNav(categories, activeCategory) {
  return `
    <nav class="category-nav" aria-label="Menu categories">
      ${categories
        .map(
          (category) => `
            <button
              class="chip ${category.id === activeCategory ? "chip--active" : ""}"
              type="button"
              data-category="${category.id}"
              aria-pressed="${String(category.id === activeCategory)}"
            >
              ${category.label}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

export function createMenuGrid(items, categoriesById, cart) {
  if (items.length === 0) {
    return `
      <div class="empty-state surface">
        <h3>No items match these filters</h3>
        <p>Try a broader search or switch back to all categories.</p>
      </div>
    `;
  }

  return `
    <div class="menu-grid">
      ${items
        .map(
          (item) => `
            <article class="menu-card surface">
              <img
                class="menu-card__image"
                loading="lazy"
                width="320"
                height="220"
                src="${buildIllustration(item)}"
                alt="${item.image.alt}"
              />
              <div class="menu-card__body">
                <div class="menu-card__meta">
                  <span class="pill">${categoriesById.get(item.category)?.label ?? item.category}</span>
                  <span class="pill pill--muted">${item.diet === "veg" ? "Veg" : "Non-veg"}</span>
                </div>
                <div class="menu-card__heading">
                  <h3>${item.name}</h3>
                  <p class="price">AED ${item.price}${item.isPlaceholderPrice ? "*" : ""}</p>
                </div>
                <p class="menu-card__description">${item.description}</p>
                <div class="menu-card__footer">
                  <div class="stepper" aria-label="${item.name} quantity">
                    <button type="button" data-quantity-action="decrease" data-item-id="${item.id}" aria-label="Decrease ${item.name}">
                      −
                    </button>
                    <span>${cart[item.id] ?? 0}</span>
                    <button type="button" data-quantity-action="increase" data-item-id="${item.id}" aria-label="Increase ${item.name}">
                      +
                    </button>
                  </div>
                  <button class="button button--primary button--small" type="button" data-add-item="${item.id}">
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}
