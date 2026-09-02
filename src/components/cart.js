import { appendChildren, createElement } from "../lib/dom.js";

export function createCartDrawer(entries, subtotal, cartCount, categoriesById) {
  const titleId = "cart-title";
  const section = createElement("section", {
    className: "cart surface",
    attrs: { "aria-labelledby": titleId },
  });

  const header = createElement("div", { className: "cart__header" }, [
    createElement("div", {}, [
      createElement("p", { className: "eyebrow", text: "Your order" }),
      createElement("h2", { attrs: { id: titleId }, text: `Cart (${cartCount})` }),
    ]),
    createElement("a", { className: "cart__jump", attrs: { href: "#checkout-section" }, text: "Go to checkout" }),
  ]);

  section.append(header);

  if (entries.length === 0) {
    section.append(
      createElement("div", { className: "cart__empty" }, [
        createElement("p", { text: "Your cart is empty." }),
        createElement("p", { text: "Add a few favorites to see your subtotal update here." }),
      ])
    );
  } else {
    const list = createElement("ul", { className: "cart__list" });

    entries.forEach((entry) => {
      const stepper = createElement("div", {
        className: "stepper",
        attrs: { "aria-label": `${entry.name} quantity` },
      });
      appendChildren(stepper, [
        createElement("button", {
          attrs: { type: "button", "aria-label": `Decrease ${entry.name}` },
          dataset: { quantityAction: "decrease", itemId: entry.id },
          text: "−",
        }),
        createElement("span", { text: String(entry.quantity) }),
        createElement("button", {
          attrs: { type: "button", "aria-label": `Increase ${entry.name}` },
          dataset: { quantityAction: "increase", itemId: entry.id },
          text: "+",
        }),
      ]);

      list.append(
        createElement("li", { className: "cart-item" }, [
          createElement("div", {}, [
            createElement("strong", { text: entry.name }),
            createElement("p", {
              text: `${categoriesById.get(entry.category)?.label ?? entry.category} · AED ${entry.price}${entry.isPlaceholderPrice ? "*" : ""}`,
            }),
          ]),
          createElement("div", { className: "cart-item__controls" }, [
            stepper,
            createElement("strong", { text: `AED ${entry.lineTotal}` }),
          ]),
        ])
      );
    });

    section.append(list);
  }

  section.append(
    createElement("div", { className: "cart__footer" }, [
      createElement("div", {}, [
        createElement("p", { className: "eyebrow", text: "Subtotal" }),
        createElement("strong", { className: "cart__subtotal", text: `AED ${subtotal}` }),
      ]),
      createElement("p", { className: "cart__note", text: "Taxes, delivery, and service charges are not included in this demo." }),
    ])
  );

  return section;
}
