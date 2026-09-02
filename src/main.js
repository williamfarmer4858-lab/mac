import { createCartDrawer } from "./components/cart.js";
import { createCheckout } from "./components/checkout.js";
import { createHero } from "./components/hero.js";
import { createCategoryNav, createMenuGrid } from "./components/menu.js";
import { categories, categoryBlurb, menuItems } from "./data/menu.js";
import { addItem, getCartCount, getCartEntries, getSubtotal, setItemQuantity } from "./lib/cart.js";
import { appendChildren, createElement } from "./lib/dom.js";
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
  const pageShell = createElement("div", { className: "page-shell" });
  const cartButton = createElement("button", {
    className: "cart-pill",
    attrs: { type: "button" },
    props: {
      onclick: () => {
        document.querySelector("#cart-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
  }, ["Cart ", createElement("span", { text: String(cartCount) })]);

  const header = createElement("header", { className: "site-header" }, [
    createElement("div", {}, [
      createElement("p", { className: "eyebrow", text: "Original demo experience" }),
      createElement("h1", { className: "site-header__title", text: "UAE delivery-style ordering" }),
    ]),
    cartButton,
  ]);

  const filterForm = buildFilterForm();
  const categoryBlurbText =
    activeCategory !== "all"
      ? categoryBlurb[activeCategory] ?? ""
      : "Browse across all categories to build a full meal, from breakfast starts to late-night desserts.";

  const menuSection = createElement("section", {
    className: "surface filters-section",
    attrs: { id: "menu-section", "aria-labelledby": "menu-title" },
  }, [
    createElement("div", { className: "section-heading" }, [
      createElement("div", {}, [
        createElement("p", { className: "eyebrow", text: "Explore the menu" }),
        createElement("h2", { attrs: { id: "menu-title" }, text: "Build your order" }),
      ]),
      createElement("p", { className: "section-heading__note", text: "AED prices marked with * are placeholders for demo purposes." }),
    ]),
    filterForm,
    createCategoryNav(categories, activeCategory),
    createElement("p", { className: "category-blurb", text: categoryBlurbText }),
    createMenuGrid(filteredItems, categoriesById, state.cart),
  ]);

  const cartPanel = createElement("div", { attrs: { id: "cart-panel" } }, [
    createCartDrawer(cartEntries, subtotal, cartCount, categoriesById),
  ]);

  const detailGrid = createElement("div", { className: "detail-grid" }, [
    cartPanel,
    createCheckout({ cartEntries, subtotal, formState: state.form, orderPlaced: state.orderPlaced }),
  ]);

  const main = createElement("main", { className: "layout", attrs: { id: "main-content" } }, [
    createHero({
      direction: state.direction,
      onToggleDirection: () => {
        state.direction = state.direction === "rtl" ? "ltr" : "rtl";
        render();
      },
    }),
    menuSection,
    detailGrid,
  ]);

  appendChildren(pageShell, [header, main]);
  app.replaceChildren(pageShell);
  bindInteractiveHandlers();
}

function bindInteractiveHandlers() {
  document.querySelector("[data-filter-form]")?.addEventListener("input", handleFilterChange);
  document.querySelector("[data-filter-form]")?.addEventListener("change", handleFilterChange);
  document.querySelector("[data-checkout-form]")?.addEventListener("submit", handleCheckoutSubmit);

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.category = sanitizeCategory(button.dataset.category);
      render();
    });
  });

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.addItem;
      if (!itemsById.has(itemId)) {
        return;
      }

      state.cart = addItem(state.cart, itemId);
      state.orderPlaced = false;
      render();
    });
  });

  document.querySelectorAll("[data-quantity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const action = button.dataset.quantityAction;
      if (!itemsById.has(itemId) || !["increase", "decrease"].includes(action)) {
        return;
      }

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
    category: sanitizeCategory(formData.get("category")),
    diet: sanitizeDiet(formData.get("diet")),
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
    paymentMethod: sanitizePaymentMethod(formData.get("paymentMethod")),
    notes: String(formData.get("notes") ?? ""),
  };
  state.orderPlaced = true;
  render();
}

function buildFilterForm() {
  const queryInput = createElement("input", {
    attrs: {
      type: "search",
      name: "query",
      placeholder: "Search burgers, coffee, nuggets...",
    },
    props: { value: state.filters.query },
  });

  const categorySelect = createElement("select", {
    attrs: { name: "category" },
  });
  categories.forEach((category) => {
    categorySelect.append(createElement("option", { attrs: { value: category.id }, text: category.label }));
  });
  categorySelect.value = state.filters.category;

  const dietSelect = createElement("select", {
    attrs: { name: "diet" },
  });
  [
    ["all", "All diets"],
    ["veg", "Veg"],
    ["non-veg", "Non-veg"],
  ].forEach(([value, label]) => {
    dietSelect.append(createElement("option", { attrs: { value }, text: label }));
  });
  dietSelect.value = state.filters.diet;

  return createElement("form", { className: "filters", dataset: { filterForm: "" } }, [
    createElement("label", { className: "filters__search" }, [
      createElement("span", { className: "visually-hidden", text: "Search menu items" }),
      queryInput,
    ]),
    createElement("label", {}, [
      createElement("span", { className: "visually-hidden", text: "Filter by category" }),
      categorySelect,
    ]),
    createElement("label", {}, [
      createElement("span", { className: "visually-hidden", text: "Filter by diet" }),
      dietSelect,
    ]),
  ]);
}

function sanitizeCategory(value) {
  const category = String(value ?? "all");
  return categoriesById.has(category) ? category : "all";
}

function sanitizeDiet(value) {
  const diet = String(value ?? "all");
  return ["all", "veg", "non-veg"].includes(diet) ? diet : "all";
}

function sanitizePaymentMethod(value) {
  const paymentMethod = String(value ?? "card");
  return ["card", "cash", "wallet"].includes(paymentMethod) ? paymentMethod : "card";
}

render();
