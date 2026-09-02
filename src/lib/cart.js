export function addItem(cart, itemId) {
  return {
    ...cart,
    [itemId]: (cart[itemId] ?? 0) + 1,
  };
}

export function setItemQuantity(cart, itemId, quantity) {
  if (quantity <= 0) {
    const nextCart = { ...cart };
    delete nextCart[itemId];
    return nextCart;
  }

  return {
    ...cart,
    [itemId]: quantity,
  };
}

export function getCartEntries(cart, itemsById) {
  return Object.entries(cart)
    .map(([itemId, quantity]) => {
      const item = itemsById.get(itemId);
      if (!item) {
        return null;
      }

      return {
        ...item,
        quantity,
        lineTotal: item.price * quantity,
      };
    })
    .filter(Boolean);
}

export function getCartCount(cart) {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export function getSubtotal(entries) {
  return entries.reduce((sum, entry) => sum + entry.lineTotal, 0);
}
