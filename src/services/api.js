import { notifyDataUpdated } from './platformStore';

// ✅ Base URL (NO /api at end)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

// ✅ Always add /api here
const buildUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}/api${cleanPath}`;
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
};

const withDataRefresh = async (action) => {
  const result = await action();
  notifyDataUpdated();
  return result;
};

// ================= AUTH =================
export const loginUser = (credentials) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerUser = (payload) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ================= PRODUCTS =================
export const fetchProducts = () => request('/products/all');

export const fetchProductById = (id) => request(`/products/${id}`);

export const fetchArtisanProducts = (artisanId) =>
  request(`/products/artisan/${artisanId}`);

export const createArtisanProduct = (artisanId, payload) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  );

export const updateArtisanProduct = (artisanId, productId, payload) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  );

export const deleteArtisanProduct = (artisanId, productId) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}/${productId}`, {
      method: 'DELETE',
    })
  );

// ================= ORDERS =================
export const fetchBuyerOrders = (buyerId) =>
  request(`/orders/buyer/${buyerId}`);

export const fetchArtisanOrders = (artisanId) =>
  request(`/orders/artisan/${artisanId}`);

export const fetchAllOrders = () => request('/orders');

export const checkoutOrder = (buyerId, items) =>
  withDataRefresh(() =>
    request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({
        buyerId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: Number(item.quantity),
        })),
      }),
    })
  );

export const updateOrderStatus = (orderId, status) =>
  withDataRefresh(() =>
    request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  );

// ================= USERS =================
export const fetchUsersForAdmin = () => request('/users');

export const updateUserStatus = (userId, status) =>
  withDataRefresh(() =>
    request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  );

export const deleteUserAccount = (userId) =>
  withDataRefresh(() =>
    request(`/users/${userId}`, {
      method: 'DELETE',
    })
  );

// ================= CAMPAIGNS =================
export const fetchCampaigns = () => request('/campaigns');

export const createCampaign = (payload) =>
  withDataRefresh(() =>
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        budget: Number(payload.budget),
        reach: payload.reach === '' ? 0 : Number(payload.reach),
        conversionRate:
          payload.conversionRate === '' ? 0 : Number(payload.conversionRate),
      }),
    })
  );

// ================= METRICS =================
export const fetchPlatformMetrics = () => request('/metrics/platform');

export const fetchMarketingMetrics = () => request('/metrics/marketing');