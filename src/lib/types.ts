export type StockStatus = 'Available' | 'Low Stock' | 'Maintenance';

export interface Item {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: StockStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'borrow' | 'return' | 'restock';

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  note: string;
  createdAt: string;
}

export interface StatsData {
  totalItems: number;
  totalStock: number;
  lowStockCount: number;
  maintenanceCount: number;
  availableCount: number;
  recentTransactions: Transaction[];
  transactionTrend: { date: string; borrow: number; restock: number; return: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
