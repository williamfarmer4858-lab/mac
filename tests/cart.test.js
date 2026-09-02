import test from "node:test";
import assert from "node:assert/strict";

import { addItem, getCartCount, getCartEntries, getSubtotal, setItemQuantity } from "../src/lib/cart.js";

const itemsById = new Map([
  ["burger", { id: "burger", name: "Burger", price: 20 }],
  ["drink", { id: "drink", name: "Drink", price: 8 }],
]);

test("addItem increments quantity for an item", () => {
  const cart = addItem({}, "burger");
  const updated = addItem(cart, "burger");
  assert.deepEqual(updated, { burger: 2 });
});

test("setItemQuantity removes items at zero or below", () => {
  const cart = setItemQuantity({ burger: 2 }, "burger", 0);
  assert.deepEqual(cart, {});
});

test("cart entries include line totals and subtotal", () => {
  const entries = getCartEntries({ burger: 2, drink: 1 }, itemsById);
  assert.equal(getCartCount({ burger: 2, drink: 1 }), 3);
  assert.equal(entries[0].lineTotal, 40);
  assert.equal(getSubtotal(entries), 48);
});
