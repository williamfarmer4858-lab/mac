export function createCheckout({ cartEntries, subtotal, formState, orderPlaced }) {
  const hasItems = cartEntries.length > 0;

  return `
    <section class="checkout surface" id="checkout-section" aria-labelledby="checkout-title">
      <div class="checkout__intro">
        <p class="eyebrow">Mock checkout</p>
        <h2 id="checkout-title">Complete your delivery details</h2>
        <p>This form simulates the final step of an order flow and does not process real payments.</p>
      </div>
      <div class="checkout__grid">
        <form class="checkout-form" data-checkout-form>
          <label>
            <span>Full name</span>
            <input name="fullName" autocomplete="name" placeholder="Alex Morgan" value="${formState.fullName}" required />
          </label>
          <label>
            <span>Mobile number</span>
            <input name="phone" autocomplete="tel" placeholder="+971 50 000 0000" value="${formState.phone}" required />
          </label>
          <label class="checkout-form__wide">
            <span>Delivery address</span>
            <input
              name="address"
              autocomplete="street-address"
              placeholder="Apartment, street, area, emirate"
              value="${formState.address}"
              required
            />
          </label>
          <label>
            <span>City / Emirate</span>
            <input name="city" placeholder="Dubai" value="${formState.city}" required />
          </label>
          <label>
            <span>Payment method</span>
            <select name="paymentMethod">
              <option value="card" ${formState.paymentMethod === "card" ? "selected" : ""}>Card on delivery</option>
              <option value="cash" ${formState.paymentMethod === "cash" ? "selected" : ""}>Cash on delivery</option>
              <option value="wallet" ${formState.paymentMethod === "wallet" ? "selected" : ""}>Digital wallet</option>
            </select>
          </label>
          <label class="checkout-form__wide">
            <span>Delivery notes</span>
            <textarea name="notes" rows="3" placeholder="Gate code, landmark, or preferred drop-off">${formState.notes}</textarea>
          </label>
          <button class="button button--primary checkout-form__submit" type="submit" ${hasItems ? "" : "disabled"}>
            ${hasItems ? "Review mock order" : "Add items to enable checkout"}
          </button>
        </form>
        <aside class="order-summary" aria-live="polite">
          <h3>Order summary</h3>
          ${
            hasItems
              ? `
                <ul class="order-summary__list">
                  ${cartEntries
                    .map(
                      (entry) => `
                        <li>
                          <span>${entry.quantity} × ${entry.name}</span>
                          <strong>AED ${entry.lineTotal}</strong>
                        </li>
                      `
                    )
                    .join("")}
                </ul>
              `
              : `<p>Add menu items to generate a summary.</p>`
          }
          <div class="order-summary__totals">
            <span>Subtotal</span>
            <strong>AED ${subtotal}</strong>
          </div>
          ${
            orderPlaced
              ? `<p class="order-summary__confirmation">Mock order ready for ${formState.fullName || "your delivery"} via ${formatPayment(formState.paymentMethod)}.</p>`
              : `<p class="order-summary__note">Prices marked with * are placeholders for this demo.</p>`
          }
        </aside>
      </div>
    </section>
  `;
}

function formatPayment(method) {
  return {
    card: "card on delivery",
    cash: "cash on delivery",
    wallet: "digital wallet",
  }[method];
}
