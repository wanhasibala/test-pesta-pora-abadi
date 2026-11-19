'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, ArrowUpDown, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { Item } from '@/lib/types';

interface FilterState {
  search: string;
  status: string;
  location: string;
  category: string;
  sortBy: string;
  sortOrder: string;
}

interface ItemsTableProps {
  items: Item[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onTransaction: (item: Item) => void;
  onFilterChange: (filters: FilterState) => void;
}

const statusColors: Record<string, string> = {
  'Available': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Low Stock': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Maintenance': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export function ItemsTable({ items, loading, onAdd, onEdit, onDelete, onTransaction, onFilterChange }: ItemsTableProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const locations = ['all', 'Gudang A', 'Gudang B', 'Gudang C'];
  const statuses = ['all', 'Available', 'Low Stock', 'Maintenance'];
  const categories = ['all', 'Electronics', 'Furniture', 'Event Equipment', 'Power Equipment', 'Lighting'];

  const handleFilter = (updates: Partial<FilterState>) => {
    const newFilters: FilterState = { search, status, location, category, sortBy, sortOrder, ...updates };
    onFilterChange(newFilters);
  };

  const handleSort = (col: string) => {
    const newOrder = sortBy === col && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(col);
    setSortOrder(newOrder);
    handleFilter({ sortBy: col, sortOrder: newOrder });
  };

  const selectClass = "text-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-[hsl(var(--border))]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Inventaris Aset</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Tambah Barang
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Cari nama atau kategori..."
              value={search}
              onChange={e => { setSearch(e.target.value); handleFilter({ search: e.target.value }); }}
            />
          </div>
          <select className={selectClass} value={status} onChange={e => { setStatus(e.target.value); handleFilter({ status: e.target.value }); }}>
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'Semua Status' : s}</option>)}
          </select>
          <select className={selectClass} value={location} onChange={e => { setLocation(e.target.value); handleFilter({ location: e.target.value }); }}>
            {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'Semua Gudang' : l}</option>)}
          </select>
          <select className={selectClass} value={category} onChange={e => { setCategory(e.target.value); handleFilter({ category: e.target.value }); }}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Semua Kategori' : c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
              {[
                { label: 'Nama Barang', key: 'name' },
                { label: 'Kategori', key: 'category' },
                { label: 'Stok', key: 'stock' },
                { label: 'Status', key: 'status' },
                { label: 'Lokasi', key: 'location' },
                { label: 'Aksi', key: null },
              ].map(col => (
                <th
                  key={col.label}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] ${col.key ? 'cursor-pointer hover:text-[hsl(var(--foreground))] select-none' : ''}`}
                  onClick={col.key ? () => handleSort(col.key!) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[hsl(var(--border))]">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full max-w-[120px]" /></td>
                      ))}
                    </tr>
                  ))
                : items.length === 0
                ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center text-[hsl(var(--muted-foreground))]">
                        <SlidersHorizontal className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Tidak ada barang ditemukan</p>
                        <p className="text-xs mt-1">Coba ubah filter pencarian</p>
                      </td>
                    </tr>
                  )
                : items.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.3)] transition-colors group"
                    >
                      <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{item.name}</td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${item.stock <= 3 ? 'text-red-500' : 'text-[hsl(var(--foreground))]'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{item.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => onTransaction(item)} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 transition-colors" title="Transaksi">
                            <ArrowRightLeft className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => onDelete(item)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {!loading && items.length > 0 && (
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
          Menampilkan {items.length} barang
        </div>
      )}
    </motion.div>
  );
}
