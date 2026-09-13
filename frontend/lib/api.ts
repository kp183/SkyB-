/**
 * SkyB Frontend API Client
 * Centralizes all communication with the FastAPI backend.
 * Automatically wraps authentication headers and unwraps the { data, error } envelope.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("skyb_token");
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("skyb_token", token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("skyb_token");
    localStorage.removeItem("skyb_user");
  }
}

export function getCurrentStoredUser(): any | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("skyb_user");
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export function setStoredUser(user: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("skyb_user", JSON.stringify(user));
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || (json && json.error)) {
    const errorMsg = json?.error || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status);
  }

  return json?.data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string) {
    const data = await request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async login(email: string, password: string) {
    const data = await request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async getMe() {
    return request<any>("/auth/me");
  },

  logout() {
    removeToken();
  },

  // Products
  async getProducts(params: {
    category?: number;
    age_group?: string;
    search?: string;
    sort?: string;
    min_price?: number;
    max_price?: number;
  } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category.toString());
    if (params.age_group) query.append("age_group", params.age_group);
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);
    if (params.min_price) query.append("min_price", params.min_price.toString());
    if (params.max_price) query.append("max_price", params.max_price.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<any[]>(`/products${qs}`);
  },

  async getProduct(id: number) {
    return request<any>(`/products/${id}`);
  },

  async createProduct(data: any) {
    return request<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: number, data: any) {
    return request<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: number) {
    return request<any>(`/products/${id}`, { method: "DELETE" });
  },

  // Categories
  async getCategories() {
    return request<{ id: number; name: string }[]>("/categories");
  },

  async createCategory(name: string) {
    return request<any>("/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  // Reviews
  async getReviews(productId: number) {
    return request<any[]>(`/products/${productId}/reviews`);
  },

  async createReview(productId: number, rating: number, comment: string) {
    return request<any>(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
  },

  // Cart
  async getCart() {
    return request<{
      items: any[];
      total_amount: number;
      non_bargained_subtotal: number;
      bargained_subtotal: number;
    }>("/cart");
  },

  async addToCart(productId: number, quantity: number = 1) {
    return request<any>("/cart/add", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  async updateCartItem(itemId: number, quantity: number) {
    return request<any>(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  async deleteCartItem(itemId: number) {
    return request<any>(`/cart/${itemId}`, { method: "DELETE" });
  },

  // Wishlist
  async getWishlist() {
    return request<any[]>("/wishlist");
  },

  async addToWishlist(productId: number, watchPrice?: number) {
    return request<any>("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, watch_price: watchPrice }),
    });
  },

  async deleteWishlistItem(itemId: number) {
    return request<any>(`/wishlist/${itemId}`, { method: "DELETE" });
  },

  // Bargain Assistant
  async startBargain(productId: number) {
    return request<{
      session_id: number;
      product_id: number;
      product_name: string;
      original_price: number;
      status: string;
    }>("/bargain/start", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async submitBargainOffer(sessionId: number, offerPrice: number) {
    return request<{
      counter_price: number;
      message: string;
      round_number: number;
      status: string;
      is_final_round: boolean;
    }>("/bargain/offer", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, offer_price: offerPrice }),
    });
  },

  async acceptBargain(sessionId: number) {
    return request<{
      session_id: number;
      final_price: number;
      status: string;
      cart_item_id: number;
      is_bargained: boolean;
    }>("/bargain/accept", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },

  // Checkout & Orders
  async checkout(deliveryAddress: string) {
    return request<any>("/checkout", {
      method: "POST",
      body: JSON.stringify({ delivery_address: deliveryAddress }),
    });
  },

  async mockPay(orderId: number, simulateFailure: boolean = false) {
    return request<{
      order_id: number;
      status: string;
      payment_successful: boolean;
      message: string;
    }>("/orders/mock-pay", {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, simulate_failure: simulateFailure }),
    });
  },

  async getOrders() {
    return request<any[]>("/orders");
  },

  async getOrder(id: number) {
    return request<any>(`/orders/${id}`);
  },

  // AI Feature Endpoints
  async getSafetyBadge(productId: number) {
    return request<any>(`/products/${productId}/safety-badge`);
  },

  async getSubstitutes(productId: number) {
    return request<any[]>(`/products/${productId}/substitutes`);
  },

  async getSizeSuggestion(childId: number) {
    return request<any>(`/children/${childId}/size-suggestion`);
  },

  async getReorderPredictions(userId: number) {
    return request<any[]>(`/users/${userId}/reorder-predictions`);
  },

  async getBundleSuggestions(productId: number) {
    return request<any[]>(`/products/${productId}/bundle-suggestions`);
  },

  // Children
  async getChildren() {
    return request<any[]>("/children");
  },

  async createChild(data: { name?: string; birth_date: string; height_cm?: number; weight_kg?: number }) {
    return request<any>("/children", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin
  async getAdminDashboard() {
    return request<any>("/admin/dashboard");
  },

  async getAdminOrders(status?: string) {
    const qs = status ? `?status=${status}` : "";
    return request<any[]>(`/admin/orders${qs}`);
  },

  async updateOrderStatus(orderId: number, newStatus: string) {
    return request<any>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
  },

  async getAdminCustomers() {
    return request<any[]>("/admin/customers");
  },

  async getCoupons() {
    return request<any[]>("/coupons");
  },

  async createCoupon(data: any) {
    return request<any>("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
