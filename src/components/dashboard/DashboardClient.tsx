'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Item, Transaction } from '@/lib/types';
import { StatsCards } from './StatsCards';
import { TransactionChart } from './TransactionChart';
import { ItemsTable } from './ItemsTable';
import { ActivityLog } from './ActivityLog';
import { ItemModal } from './ItemModal';
import { TransactionModal } from './TransactionModal';
import { DeleteModal } from './DeleteModal';

interface Stats {
  totalItems: number;
  totalStock: number;
  lowStockCount: number;
  maintenanceCount: number;
  availableCount: number;
  recentTransactions: Transaction[];
  transactionTrend: { date: string; borrow: number; restock: number; return: number }[];
}

export function DashboardClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [txnItem, setTxnItem] = useState<Item | null>(null);

  // Filter state
  const [filters, setFilters] = useState({ search: '', status: 'all', location: 'all', category: 'all', sortBy: 'updatedAt', sortOrder: 'desc' });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchItems = useCallback(async (f = filters) => {
    setItemsLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set('search', f.search);
      if (f.status !== 'all') params.set('status', f.status);
      if (f.location !== 'all') params.set('location', f.location);
      if (f.category !== 'all') params.set('category', f.category);
      params.set('sortBy', f.sortBy);
      params.set('sortOrder', f.sortOrder);

      const res = await fetch(`/api/items?${params}`);
      const json = await res.json();
      if (json.success) setItems(json.data);
    } finally {
      setItemsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  const handleAddItem = async (data: Partial<Item>) => {
    const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    toast.success(`✅ ${data.name} berhasil ditambahkan!`);
    fetchItems();
    fetchStats();
  };

  const handleEditItem = async (data: Partial<Item>) => {
    if (!editItem) return;
    const res = await fetch(`/api/items/${editItem.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    toast.success(`✅ ${data.name} berhasil diperbarui!`);
    fetchItems();
    fetchStats();
  };

  const handleDeleteItem = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/items/${deleteItem.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) { toast.error(`❌ ${json.error}`); return; }
    toast.success(`🗑️ ${deleteItem.name} berhasil dihapus!`);
    setDeleteItem(null);
    fetchItems();
    fetchStats();
  };

  const handleTransaction = async (data: { itemId: string; type: string; quantity: number; note: string }) => {
    const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    const typeLabel = data.type === 'borrow' ? 'Peminjaman' : data.type === 'restock' ? 'Restock' : 'Pengembalian';
    toast.success(`✅ ${typeLabel} ${data.quantity}x ${txnItem?.name} berhasil!`);
    fetchItems();
    fetchStats();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Operational Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Kelola aset dan inventaris operasional PT Pesta Pora Abadi</p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Chart + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart data={stats?.transactionTrend ?? []} loading={statsLoading} />
        </div>
        <div>
          <ActivityLog transactions={stats?.recentTransactions ?? []} loading={statsLoading} />
        </div>
      </div>

      {/* Items Table */}
      <ItemsTable
        items={items}
        loading={itemsLoading}
        onAdd={() => setAddOpen(true)}
        onEdit={item => setEditItem(item)}
        onDelete={item => setDeleteItem(item)}
        onTransaction={item => setTxnItem(item)}
        onFilterChange={handleFilterChange}
      />

      {/* Modals */}
      <ItemModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAddItem} />
      <ItemModal open={!!editItem} onClose={() => setEditItem(null)} onSave={handleEditItem} item={editItem} />
      <DeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDeleteItem} item={deleteItem} />
      <TransactionModal open={!!txnItem} onClose={() => setTxnItem(null)} onSubmit={handleTransaction} item={txnItem} />
    </div>
  );
}
