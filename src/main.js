import { createCartDrawer } from "./components/cart.js";
import { createCheckout } from "./components/checkout.js";
import { createHero } from "./components/hero.js";
import { createCategoryNav, createMenuGrid } from "./components/menu.js";
import { categories, categoryBlurb, menuItems } from "./data/menu.js";
import { addItem, getCartCount, getCartEntries, getSubtotal, setItemQuantity } from "./lib/cart.js";
import { filterMenuItems } from "./lib/filters.js";

const app = document.querySelector("#app");
const categoriesById = new Map(categories.map((category) => [category.id, category]));
const itemsById = new Map(menuItems.map((item) => [item.id, item]));

const state = {
  filters: {
    category: "all",
    diet: "all",
    query: "",
  },
  cart: {},
  direction: document.documentElement.getAttribute("dir") || "ltr",
  orderPlaced: false,
  form: {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "card",
    notes: "",
  },
};

function render() {
  const filteredItems = filterMenuItems(menuItems, state.filters);
  const cartEntries = getCartEntries(state.cart, itemsById);
  const subtotal = getSubtotal(cartEntries);
  const cartCount = getCartCount(state.cart);
  const activeCategory = state.filters.category;

  document.documentElement.setAttribute("dir", state.direction);

  app.innerHTML = `
    <div class="page-shell">
      <header class="site-header">
        <div>
          <p class="eyebrow">Original demo experience</p>
          <h1 class="site-header__title">UAE delivery-style ordering</h1>
        </div>
        <button class="cart-pill" type="button" data-scroll-cart>
          Cart <span>${cartCount}</span>
        </button>
      </header>

      <main id="main-content" class="layout">
        ${createHero({ direction: state.direction })}

        <section class="surface filters-section" id="menu-section" aria-labelledby="menu-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Explore the menu</p>
              <h2 id="menu-title">Build your order</h2>
            </div>
            <p class="section-heading__note">AED prices marked with * are placeholders for demo purposes.</p>
          </div>

          <form class="filters" data-filter-form>
            <label class="filters__search">
              <span class="visually-hidden">Search menu items</span>
              <input
                type="search"
                name="query"
                value="${escapeHtml(state.filters.query)}"
                placeholder="Search burgers, coffee, nuggets..."
              />
            </label>
            <label>
              <span class="visually-hidden">Filter by category</span>
              <select name="category">
                ${categories
                  .map(
                    (category) =>
                      `<option value="${category.id}" ${state.filters.category === category.id ? "selected" : ""}>${category.label}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label>
              <span class="visually-hidden">Filter by diet</span>
              <select name="diet">
                <option value="all" ${state.filters.diet === "all" ? "selected" : ""}>All diets</option>
                <option value="veg" ${state.filters.diet === "veg" ? "selected" : ""}>Veg</option>
                <option value="non-veg" ${state.filters.diet === "non-veg" ? "selected" : ""}>Non-veg</option>
              </select>
            </label>
          </form>

          ${createCategoryNav(categories, activeCategory)}

          ${
            activeCategory !== "all"
              ? `<p class="category-blurb">${categoryBlurb[activeCategory] ?? ""}</p>`
              : `<p class="category-blurb">Browse across all categories to build a full meal, from breakfast starts to late-night desserts.</p>`
          }

          ${createMenuGrid(filteredItems, categoriesById, state.cart)}
        </section>

        <div class="detail-grid">
          <div id="cart-panel">
            ${createCartDrawer(cartEntries, subtotal, cartCount, categoriesById)}
          </div>
          ${createCheckout({ cartEntries, subtotal, formState: state.form, orderPlaced: state.orderPlaced })}
        </div>
      </main>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  const filterForm = document.querySelector("[data-filter-form]");
  filterForm?.addEventListener("input", handleFilterChange);
  filterForm?.addEventListener("change", handleFilterChange);

  document.querySelector("[data-checkout-form]")?.addEventListener("submit", handleCheckoutSubmit);
  document.querySelector("[data-scroll-cart]")?.addEventListener("click", () => {
    document.querySelector("#cart-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelector("[data-action='toggle-dir']")?.addEventListener("click", () => {
    state.direction = state.direction === "rtl" ? "ltr" : "rtl";
    render();
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.category = button.getAttribute("data-category");
      render();
    });
  });

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-add-item");
      state.cart = addItem(state.cart, itemId);
      state.orderPlaced = false;
      render();
    });
  });

  document.querySelectorAll("[data-quantity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-item-id");
      const action = button.getAttribute("data-quantity-action");
      const nextQuantity = (state.cart[itemId] ?? 0) + (action === "increase" ? 1 : -1);
      state.cart = setItemQuantity(state.cart, itemId, nextQuantity);
      state.orderPlaced = false;
      render();
    });
  });
}

function handleFilterChange(event) {
  const formData = new FormData(event.currentTarget);
  state.filters = {
    query: String(formData.get("query") ?? ""),
    category: String(formData.get("category") ?? "all"),
    diet: String(formData.get("diet") ?? "all"),
  };
  render();
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  state.form = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? "card"),
    notes: String(formData.get("notes") ?? ""),
  };
  state.orderPlaced = true;
  render();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

render();
