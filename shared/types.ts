export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  brand: string | null;
  price: number;
  costPrice: number | null;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  stockStatus?: 'in' | 'low' | 'out';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  categoryId: number;
  brand?: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface Sale {
  id: number;
  invoiceNo: string;
  customerName: string;
  customerPhone: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  userId: number;
  userName: string;
  items: SaleItem[];
  createdAt: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateSaleDto {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  discount?: number;
  items: { productId: number; quantity: number }[];
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: 'active' | 'inactive';
  productsSupplied: string | null;
  createdAt: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

export interface SupplierFilters {
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Purchase {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDate: string | null;
  total: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  notes: string | null;
  userId: number;
  userName: string;
  items: PurchaseItem[];
  createdAt: string;
}

export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreatePurchaseDto {
  supplierId: number;
  orderDate?: string;
  expectedDate?: string;
  notes?: string;
  status?: string;
  items: { productId: number; quantity: number; unitPrice: number }[];
}

export interface UpdateStatusDto {
  status: string;
}

export interface PurchaseFilters {
  search?: string;
  status?: 'pending' | 'ordered' | 'received' | 'cancelled';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reference: string;
  referenceId: string;
  notes: string | null;
  userName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  outOfStock: number;
  lowStock: number;
  totalRevenue: number;
  revenueChange: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentSales: Sale[];
  lowStockProducts: Product[];
  topProducts: { productName: string; unitsSold: number; revenue: number }[];
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
