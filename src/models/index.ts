// ─── User / Auth ──────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Food & Beverage'
  | 'Home & Garden'
  | 'Sports'
  | 'Books'
  | 'Beauty'
  | 'Toys';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string;
  description: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
  percentage: number;
  color: string;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  change: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  bgColor: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// ─── Table ────────────────────────────────────────────────────────────────────
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterConfig {
  search: string;
  [key: string]: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface AppSettings {
  siteName: string;
  siteUrl: string;
  timezone: string;
  currency: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
}
