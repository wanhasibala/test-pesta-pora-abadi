'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Package } from 'lucide-react';
import { Item, StockStatus } from '@/lib/types';

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Item>) => Promise<void>;
  item?: Item | null;
}

const categories = ['Electronics', 'Furniture', 'Event Equipment', 'Power Equipment', 'Lighting', 'Other'];
const locations = ['Gudang A', 'Gudang B', 'Gudang C'];
const statuses: StockStatus[] = ['Available', 'Low Stock', 'Maintenance'];

export function ItemModal({ open, onClose, onSave, item }: ItemModalProps) {
  const isEdit = !!item;
  const [form, setForm] = useState({ name: '', category: 'Electronics', stock: 0, status: 'Available' as StockStatus, location: 'Gudang A' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, category: item.category, stock: item.stock, status: item.status, location: item.location });
    } else {
      setForm({ name: '', category: 'Electronics', stock: 0, status: 'Available', location: 'Gudang A' });
    }
    setErrors({});
  }, [item, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama barang wajib diisi';
    if (form.stock < 0) e.stock = 'Stok tidak boleh negatif';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? 'border-red-400 focus:ring-red-400/30' : 'border-[hsl(var(--border))] focus:ring-blue-500/30 focus:border-blue-500'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[hsl(var(--card))] rounded-2xl shadow-2xl border border-[hsl(var(--border))] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {isEdit ? 'Edit Barang' : 'Tambah Barang Baru'}
                </h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Nama Barang *</label>
                <input className={inputClass('name')} placeholder="cth. Laptop Dell XPS 15" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Kategori</label>
                  <select className={inputClass('category')} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Stok Awal *</label>
                  <input type="number" min={0} className={inputClass('stock')} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
                  {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Status</label>
                  <select className={inputClass('status')} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as StockStatus }))}>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Lokasi Gudang</label>
                  <select className={inputClass('location')} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                    {locations.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-[hsl(var(--border))] rounded-xl hover:bg-[hsl(var(--muted))] transition-colors">
                  Batal
                </button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl transition-colors"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Barang'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
