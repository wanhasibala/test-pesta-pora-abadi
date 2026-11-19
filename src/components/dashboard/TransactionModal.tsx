'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft } from 'lucide-react';
import { Item } from '@/lib/types';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { itemId: string; type: string; quantity: number; note: string }) => Promise<void>;
  item?: Item | null;
}

type TxnType = 'borrow' | 'restock' | 'return';

const typeOptions: { value: TxnType; label: string; color: string }[] = [
  { value: 'borrow', label: 'Peminjaman', color: 'blue' },
  { value: 'restock', label: 'Restock', color: 'emerald' },
  { value: 'return', label: 'Pengembalian', color: 'amber' },
];

export function TransactionModal({ open, onClose, onSubmit, item }: TransactionModalProps) {
  const [type, setType] = useState<TxnType>('borrow');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setType('borrow'); setQuantity(1); setNote(''); setError(''); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (quantity <= 0) { setError('Jumlah harus lebih dari 0'); return; }
    if (type === 'borrow' && quantity > item.stock) { setError(`Stok tidak mencukupi. Tersedia: ${item.stock}`); return; }
    setError('');
    setSaving(true);
    try {
      await onSubmit({ itemId: item.id, type, quantity, note });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-[hsl(var(--border))] rounded-xl bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[hsl(var(--card))] rounded-2xl shadow-2xl border border-[hsl(var(--border))]"
          >
            <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Catat Transaksi</h2>
                  {item && <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.name} · Stok: {item.stock}</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2">Jenis Transaksi</label>
                <div className="grid grid-cols-3 gap-2">
                  {typeOptions.map(opt => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setType(opt.value)}
                      className={`py-2.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                        type === opt.value
                          ? opt.value === 'borrow' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                            : opt.value === 'restock' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]'
                      }`}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Jumlah</label>
                <input type="number" min={1} className={inputClass} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
              </div>

              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">Catatan (opsional)</label>
                <input className={inputClass} placeholder="cth. Dipinjam untuk acara..." value={note} onChange={e => setNote(e.target.value)} />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5">
                  ⚠️ {error}
                </motion.div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-[hsl(var(--border))] rounded-xl hover:bg-[hsl(var(--muted))] transition-colors">
                  Batal
                </button>
                <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-xl transition-colors">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                  {saving ? 'Memproses...' : 'Catat Transaksi'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
