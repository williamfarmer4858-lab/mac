export function createCartDrawer(entries, subtotal, cartCount, categoriesById) {
  return `
    <section class="cart surface" aria-labelledby="cart-title">
      <div class="cart__header">
        <div>
          <p class="eyebrow">Your order</p>
          <h2 id="cart-title">Cart (${cartCount})</h2>
        </div>
        <a class="cart__jump" href="#checkout-section">Go to checkout</a>
      </div>
      ${
        entries.length === 0
          ? `
            <div class="cart__empty">
              <p>Your cart is empty.</p>
              <p>Add a few favorites to see your subtotal update here.</p>
            </div>
          `
          : `
            <ul class="cart__list">
              ${entries
                .map(
                  (entry) => `
                    <li class="cart-item">
                      <div>
                        <strong>${entry.name}</strong>
                        <p>${categoriesById.get(entry.category)?.label ?? entry.category} · AED ${entry.price}${entry.isPlaceholderPrice ? "*" : ""}</p>
                      </div>
                      <div class="cart-item__controls">
                        <div class="stepper" aria-label="${entry.name} quantity">
                          <button type="button" data-quantity-action="decrease" data-item-id="${entry.id}" aria-label="Decrease ${entry.name}">
                            −
                          </button>
                          <span>${entry.quantity}</span>
                          <button type="button" data-quantity-action="increase" data-item-id="${entry.id}" aria-label="Increase ${entry.name}">
                            +
                          </button>
                        </div>
                        <strong>AED ${entry.lineTotal}</strong>
                      </div>
                    </li>
                  `
                )
                .join("")}
            </ul>
          `
      }
      <div class="cart__footer">
        <div>
          <p class="eyebrow">Subtotal</p>
          <strong class="cart__subtotal">AED ${subtotal}</strong>
        </div>
        <p class="cart__note">Taxes, delivery, and service charges are not included in this demo.</p>
      </div>
    </section>
  `;
}
