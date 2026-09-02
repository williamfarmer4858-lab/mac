import { appendChildren, createElement } from "../lib/dom.js";

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
  const nav = createElement("nav", { className: "category-nav", attrs: { "aria-label": "Menu categories" } });

  categories.forEach((category) => {
    nav.append(
      createElement("button", {
        className: `chip ${category.id === activeCategory ? "chip--active" : ""}`.trim(),
        attrs: {
          type: "button",
          "aria-pressed": String(category.id === activeCategory),
        },
        dataset: { category: category.id },
        text: category.label,
      })
    );
  });

  return nav;
}

export function createMenuGrid(items, categoriesById, cart) {
  if (items.length === 0) {
    return createElement("div", { className: "empty-state surface" }, [
      createElement("h3", { text: "No items match these filters" }),
      createElement("p", { text: "Try a broader search or switch back to all categories." }),
    ]);
  }

  const grid = createElement("div", { className: "menu-grid" });

  items.forEach((item) => {
    const quantity = cart[item.id] ?? 0;
    const stepper = createElement("div", {
      className: "stepper",
      attrs: { "aria-label": `${item.name} quantity` },
    });
    appendChildren(stepper, [
      createElement("button", {
        attrs: { type: "button", "aria-label": `Decrease ${item.name}` },
        dataset: { quantityAction: "decrease", itemId: item.id },
        text: "−",
      }),
      createElement("span", { text: String(quantity) }),
      createElement("button", {
        attrs: { type: "button", "aria-label": `Increase ${item.name}` },
        dataset: { quantityAction: "increase", itemId: item.id },
        text: "+",
      }),
    ]);

    const article = createElement("article", { className: "menu-card surface" }, [
      createElement("img", {
        className: "menu-card__image",
        attrs: {
          loading: "lazy",
          width: "320",
          height: "220",
          src: buildIllustration(item),
          alt: item.image.alt,
        },
      }),
      createElement("div", { className: "menu-card__body" }, [
        createElement("div", { className: "menu-card__meta" }, [
          createElement("span", { className: "pill", text: categoriesById.get(item.category)?.label ?? item.category }),
          createElement("span", { className: "pill pill--muted", text: item.diet === "veg" ? "Veg" : "Non-veg" }),
        ]),
        createElement("div", { className: "menu-card__heading" }, [
          createElement("h3", { text: item.name }),
          createElement("p", { className: "price", text: `AED ${item.price}${item.isPlaceholderPrice ? "*" : ""}` }),
        ]),
        createElement("p", { className: "menu-card__description", text: item.description }),
        createElement("div", { className: "menu-card__footer" }, [
          stepper,
          createElement("button", {
            className: "button button--primary button--small",
            attrs: { type: "button" },
            dataset: { addItem: item.id },
            text: "Add to cart",
          }),
        ]),
      ]),
    ]);

    grid.append(article);
  });

  return grid;
}
