import { v4 as uuidv4 } from 'uuid';
import { Item, Transaction, StockStatus, TransactionType } from './types';

// ---- Seed Data ----
const initialItems: Item[] = [
  { id: uuidv4(), name: 'Laptop Dell XPS 15', category: 'Electronics', stock: 12, status: 'Available', location: 'Gudang A', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Proyektor Epson EB', category: 'Electronics', stock: 3, status: 'Low Stock', location: 'Gudang B', createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Meja Lipat 180cm', category: 'Furniture', stock: 20, status: 'Available', location: 'Gudang A', createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Kursi Lipat Besi', category: 'Furniture', stock: 50, status: 'Available', location: 'Gudang C', createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sound System JBL', category: 'Electronics', stock: 2, status: 'Low Stock', location: 'Gudang B', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Tenda Pesta 6x12m', category: 'Event Equipment', stock: 8, status: 'Available', location: 'Gudang C', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Generator 5000W', category: 'Power Equipment', stock: 1, status: 'Maintenance', location: 'Gudang A', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Kamera Canon EOS', category: 'Electronics', stock: 5, status: 'Available', location: 'Gudang B', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Lampu LED 100W', category: 'Lighting', stock: 30, status: 'Available', location: 'Gudang A', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Backdrop Spanduk 3x6m', category: 'Event Equipment', stock: 2, status: 'Low Stock', location: 'Gudang C', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function generateTransactions(items: Item[]): Transaction[] {
  const txns: Transaction[] = [];
  const types: Transaction['type'][] = ['borrow', 'restock', 'return'];
  for (let i = 0; i < 20; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    txns.push({
      id: uuidv4(),
      itemId: item.id,
      itemName: item.name,
      type,
      quantity: Math.floor(Math.random() * 5) + 1,
      note: type === 'borrow' ? 'Dipinjam untuk acara' : type === 'restock' ? 'Restock dari supplier' : 'Dikembalikan dari acara',
      createdAt: new Date(Date.now() - 86400000 * daysAgo - Math.random() * 86400000).toISOString(),
    });
  }
  return txns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Module-level store
let items: Item[] = [...initialItems];
const transactions: Transaction[] = generateTransactions(initialItems);

// ---- Item Operations ----
export function getItems(): Item[] {
  return items;
}

export function getItemById(id: string): Item | undefined {
  return items.find(i => i.id === id);
}

export function createItem(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
  const item: Item = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(item);
  return item;
}

export function updateItem(id: string, data: Partial<Omit<Item, 'id' | 'createdAt'>>): Item | null {
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  return items[idx];
}

export function deleteItem(id: string): boolean {
  const len = items.length;
  items = items.filter(i => i.id !== id);
  return items.length < len;
}

function computeStatus(stock: number): StockStatus {
  if (stock === 0) return 'Low Stock';
  if (stock <= 3) return 'Low Stock';
  return 'Available';
}

// ---- Transaction Operations ----
export function getTransactions(): Transaction[] {
  return transactions;
}

export function createTransaction(data: { itemId: string; type: TransactionType; quantity: number; note?: string }): { transaction: Transaction; item: Item } | { error: string } {
  const item = getItemById(data.itemId);
  if (!item) return { error: 'Item not found' };
  if (item.status === 'Maintenance') return { error: 'Item is under maintenance and cannot be transacted' };

  let newStock = item.stock;
  if (data.type === 'borrow') {
    if (item.stock < data.quantity) return { error: `Insufficient stock. Available: ${item.stock}, Requested: ${data.quantity}` };
    newStock = item.stock - data.quantity;
  } else if (data.type === 'restock' || data.type === 'return') {
    newStock = item.stock + data.quantity;
  }

  const updatedItem = updateItem(item.id, { stock: newStock, status: computeStatus(newStock) });
  if (!updatedItem) return { error: 'Failed to update item' };

  const txn: Transaction = {
    id: uuidv4(),
    itemId: data.itemId,
    itemName: item.name,
    type: data.type,
    quantity: data.quantity,
    note: data.note || '',
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(txn);
  return { transaction: txn, item: updatedItem };
}

// ---- Stats ----
export function getStats() {
  const totalItems = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowStockCount = items.filter(i => i.status === 'Low Stock').length;
  const maintenanceCount = items.filter(i => i.status === 'Maintenance').length;
  const availableCount = items.filter(i => i.status === 'Available').length;

  // Build 7-day transaction trend
  const trend: Record<string, { date: string; borrow: number; restock: number; return: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - 86400000 * i);
    const key = d.toISOString().slice(0, 10);
    trend[key] = { date: key, borrow: 0, restock: 0, return: 0 };
  }
  for (const t of transactions) {
    const key = t.createdAt.slice(0, 10);
    if (trend[key]) trend[key][t.type]++;
  }

  return {
    totalItems,
    totalStock,
    lowStockCount,
    maintenanceCount,
    availableCount,
    recentTransactions: transactions.slice(0, 10),
    transactionTrend: Object.values(trend),
  };
}
