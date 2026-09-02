import { appendChildren, createElement } from "../lib/dom.js";

export function createCheckout({ cartEntries, subtotal, formState, orderPlaced }) {
  const hasItems = cartEntries.length > 0;

  const section = createElement("section", {
    className: "checkout surface",
    attrs: { id: "checkout-section", "aria-labelledby": "checkout-title" },
  });

  section.append(
    createElement("div", { className: "checkout__intro" }, [
      createElement("p", { className: "eyebrow", text: "Mock checkout" }),
      createElement("h2", { attrs: { id: "checkout-title" }, text: "Complete your delivery details" }),
      createElement("p", { text: "This form simulates the final step of an order flow and does not process real payments." }),
    ])
  );

  const form = createElement("form", {
    className: "checkout-form",
    dataset: { checkoutForm: "" },
  });

  appendChildren(form, [
    createField("Full name", createElement("input", { attrs: { name: "fullName", autocomplete: "name", placeholder: "Alex Morgan", required: "true" }, props: { value: formState.fullName } })),
    createField("Mobile number", createElement("input", { attrs: { name: "phone", autocomplete: "tel", placeholder: "+971 50 000 0000", required: "true" }, props: { value: formState.phone } })),
    createField(
      "Delivery address",
      createElement("input", {
        attrs: { name: "address", autocomplete: "street-address", placeholder: "Apartment, street, area, emirate", required: "true" },
        props: { value: formState.address },
      }),
      "checkout-form__wide"
    ),
    createField("City / Emirate", createElement("input", { attrs: { name: "city", placeholder: "Dubai", required: "true" }, props: { value: formState.city } })),
    createField("Payment method", createPaymentSelect(formState.paymentMethod)),
    createField(
      "Delivery notes",
      createElement("textarea", {
        attrs: { name: "notes", rows: "3", placeholder: "Gate code, landmark, or preferred drop-off" },
        props: { value: formState.notes },
      }),
      "checkout-form__wide"
    ),
    createElement("button", {
      className: "button button--primary checkout-form__submit",
      attrs: { type: "submit", ...(hasItems ? {} : { disabled: "true" }) },
      text: hasItems ? "Review mock order" : "Add items to enable checkout",
    }),
  ]);

  const summary = createElement("aside", { className: "order-summary", attrs: { "aria-live": "polite" } }, [
    createElement("h3", { text: "Order summary" }),
  ]);

  if (hasItems) {
    const list = createElement("ul", { className: "order-summary__list" });
    cartEntries.forEach((entry) => {
      list.append(
        createElement("li", {}, [
          createElement("span", { text: `${entry.quantity} × ${entry.name}` }),
          createElement("strong", { text: `AED ${entry.lineTotal}` }),
        ])
      );
    });
    summary.append(list);
  } else {
    summary.append(createElement("p", { text: "Add menu items to generate a summary." }));
  }

  summary.append(
    createElement("div", { className: "order-summary__totals" }, [
      createElement("span", { text: "Subtotal" }),
      createElement("strong", { text: `AED ${subtotal}` }),
    ])
  );

  summary.append(
    orderPlaced
      ? createElement("p", {
          className: "order-summary__confirmation",
          text: getOrderConfirmationMessage(formState),
        })
      : createElement("p", {
          className: "order-summary__note",
          text: "Prices marked with * are placeholders for this demo.",
        })
  );

  section.append(createElement("div", { className: "checkout__grid" }, [form, summary]));
  return section;
}

function formatPayment(method) {
  return {
    card: "card on delivery",
    cash: "cash on delivery",
    wallet: "digital wallet",
  }[method];
}

export function getOrderConfirmationMessage(formState) {
  return `Mock order ready for ${formState.fullName || "your delivery"} via ${formatPayment(formState.paymentMethod)}.`;
}

function createField(label, control, className = "") {
  return createElement("label", { className }, [createElement("span", { text: label }), control]);
}

function createPaymentSelect(value) {
  const select = createElement("select", {
    attrs: { name: "paymentMethod" },
  });

  [
    ["card", "Card on delivery"],
    ["cash", "Cash on delivery"],
    ["wallet", "Digital wallet"],
  ].forEach(([optionValue, label]) => {
    select.append(createElement("option", { attrs: { value: optionValue }, text: label }));
  });

  select.value = value;
  return select;
}
