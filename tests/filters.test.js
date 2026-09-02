import test from "node:test";
import assert from "node:assert/strict";

import { filterMenuItems } from "../src/lib/filters.js";

const items = [
  { id: "1", name: "Big Burger", description: "Classic beef burger", category: "burgers", diet: "non-veg" },
  { id: "2", name: "Veg Hotcakes", description: "Sweet breakfast stack", category: "breakfast", diet: "veg" },
  { id: "3", name: "Iced Latte", description: "Cold coffee drink", category: "beverages", diet: "veg" },
];

test("filterMenuItems narrows by category", () => {
  const result = filterMenuItems(items, { query: "", category: "breakfast", diet: "all" });
  assert.deepEqual(result.map((item) => item.id), ["2"]);
});

test("filterMenuItems narrows by diet and query", () => {
  const result = filterMenuItems(items, { query: "coffee", category: "all", diet: "veg" });
  assert.deepEqual(result.map((item) => item.id), ["3"]);
});
