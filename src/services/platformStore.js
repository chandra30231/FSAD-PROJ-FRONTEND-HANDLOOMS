const STORAGE_KEYS = {
  session: 'platformSessionUser',
};

const parseSafe = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const read = (key, fallback = []) => parseSafe(localStorage.getItem(key), fallback);
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const notifyDataUpdated = () => window.dispatchEvent(new Event('handloom:data-updated'));
export const notifyCartUpdated = () => window.dispatchEvent(new Event('handloom:cart-updated'));

export const getSessionUser = () => parseSafe(localStorage.getItem(STORAGE_KEYS.session), null);

export const setSessionUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
};

const cartKey = (userId) => `platformCart:${userId}`;

export const getCart = (userId) => read(cartKey(userId));

export const getCartCount = (userId) =>
  getCart(userId).reduce((total, item) => total + Number(item.quantity || 0), 0);

export const addCartItem = (userId, product, quantity) => {
  const cart = getCart(userId);
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex >= 0) {
    const nextQuantity = Number(cart[existingIndex].quantity || 0) + Number(quantity);
    cart[existingIndex].quantity = Math.min(nextQuantity, Number(product.stock || nextQuantity));
  } else {
    cart.push({ ...product, quantity: Number(quantity) });
  }

  write(cartKey(userId), cart);
  notifyCartUpdated();
};

export const updateCartItemQuantity = (userId, productId, quantity) => {
  const cart = getCart(userId)
    .map((item) => (
      item.id === Number(productId)
        ? { ...item, quantity: Math.max(1, Number(quantity)) }
        : item
    ))
    .filter((item) => Number(item.quantity) > 0);

  write(cartKey(userId), cart);
  notifyCartUpdated();
};

export const removeCartItem = (userId, productId) => {
  const cart = getCart(userId).filter((item) => item.id !== Number(productId));
  write(cartKey(userId), cart);
  notifyCartUpdated();
};

export const clearCart = (userId) => {
  write(cartKey(userId), []);
  notifyCartUpdated();
};
