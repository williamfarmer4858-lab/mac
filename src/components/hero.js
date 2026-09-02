import { appendChildren, createElement } from "../lib/dom.js";

export function createHero({ direction, onToggleDirection }) {
  const titleId = "hero-title";
  const section = createElement("section", {
    className: "hero surface",
    attrs: { "aria-labelledby": titleId },
  });

  const actions = createElement("div", { className: "hero__actions" }, [
    createElement("a", {
      className: "button button--primary",
      attrs: { href: "#menu-section" },
      text: "Start your order",
    }),
    createElement("button", {
      className: "button button--secondary",
      attrs: { type: "button", "data-action": "toggle-dir" },
      text: direction === "rtl" ? "Switch to LTR" : "Preview RTL",
      props: {
        onclick: onToggleDirection,
      },
    }),
  ]);

  const copy = createElement("div", { className: "hero__copy" }, [
    createElement("p", { className: "eyebrow", text: "UAE-inspired delivery menu" }),
    createElement("h1", { attrs: { id: titleId }, text: "Fast cravings, warm meals, and a smoother delivery-style flow." }),
    createElement("p", {
      className: "hero__text",
      text: "Browse familiar burgers, chicken, breakfast, desserts, and drinks in an original demo experience designed for quick ordering on mobile and desktop.",
    }),
    actions,
  ]);

  const highlights = createElement("ul", { className: "hero__highlights" }, [
    createElement("li", { text: "Search menu items instantly" }),
    createElement("li", { text: "Filter veg and non-veg choices" }),
    createElement("li", { text: "Review a mock checkout summary" }),
  ]);

  const panel = createElement("div", { className: "hero__panel", attrs: { "aria-hidden": "true" } }, [
    createElement("div", { className: "hero__badge" }, [
      createElement("span", { text: "🚚" }),
      createElement("strong", { text: "Delivery demo" }),
    ]),
    highlights,
  ]);

  appendChildren(section, [copy, panel]);
  return section;
}
