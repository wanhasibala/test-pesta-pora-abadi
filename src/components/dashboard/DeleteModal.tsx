'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Item } from '@/lib/types';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item?: Item | null;
}

export function DeleteModal({ open, onClose, onConfirm, item }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[hsl(var(--card))] rounded-2xl shadow-2xl border border-[hsl(var(--border))] p-6 text-center"
          >
            <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Hapus Barang</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
              Apakah Anda yakin ingin menghapus <strong className="text-[hsl(var(--foreground))]">{item?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-[hsl(var(--border))] rounded-xl hover:bg-[hsl(var(--muted))] transition-colors">
                Batal
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                Hapus
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
