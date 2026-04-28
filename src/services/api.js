import { notifyDataUpdated } from './platformStore';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

const buildUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

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

export const loginUser = async (credentials) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerUser = async (payload) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchProducts = async () => request('/products/public');

export const fetchProductById = async (id) => request(`/products/${id}`);

export const fetchBuyerOrders = async (buyerId) => request(`/orders/buyer/${buyerId}`);

export const fetchArtisanOrders = async (artisanId) => request(`/orders/artisan/${artisanId}`);

export const fetchAllOrders = async () => request('/orders');

export const fetchUsersForAdmin = async () => request('/users');

export const updateUserStatus = async (userId, status) =>
  withDataRefresh(() =>
    request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  );

export const deleteUserAccount = async (userId) =>
  withDataRefresh(() =>
    request(`/users/${userId}`, {
      method: 'DELETE',
    }),
  );

export const fetchArtisanProducts = async (artisanId) => request(`/products/artisan/${artisanId}`);

export const createArtisanProduct = async (artisanId, payload) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  );

export const updateArtisanProduct = async (artisanId, productId, payload) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  );

export const deleteArtisanProduct = async (artisanId, productId) =>
  withDataRefresh(() =>
    request(`/products/artisan/${artisanId}/${productId}`, {
      method: 'DELETE',
    }),
  );

export const checkoutOrder = async (buyerId, items) =>
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
    }),
  );

export const updateOrderStatus = async (orderId, status) =>
  withDataRefresh(() =>
    request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  );

export const fetchCampaigns = async () => request('/campaigns');

export const createCampaign = async (payload) =>
  withDataRefresh(() =>
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        budget: Number(payload.budget),
        reach: payload.reach === '' ? 0 : Number(payload.reach),
        conversionRate: payload.conversionRate === '' ? 0 : Number(payload.conversionRate),
      }),
    }),
  );

export const fetchPlatformMetrics = async () => request('/metrics/platform');

export const fetchMarketingMetrics = async () => request('/metrics/marketing');
