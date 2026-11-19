'use client';

import { motion } from 'framer-motion';
import { History, ArrowDownCircle, ArrowUpCircle, RotateCcw } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface ActivityLogProps {
  transactions: Transaction[];
  loading: boolean;
}

const typeConfig = {
  borrow: { label: 'Peminjaman', icon: ArrowDownCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  restock: { label: 'Restock', icon: ArrowUpCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  return: { label: 'Pengembalian', icon: RotateCcw, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export function ActivityLog({ transactions, loading }: ActivityLogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <History className="w-5 h-5 text-blue-500" />
        <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Log Aktivitas Terkini</h2>
      </div>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
          : transactions.length === 0
          ? (
              <p className="text-sm text-center text-[hsl(var(--muted-foreground))] py-8">Belum ada aktivitas</p>
            )
          : transactions.map((txn, i) => {
              const cfg = typeConfig[txn.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                      <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                      {' '}{txn.quantity}x {txn.itemName}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {txn.note && <span className="mr-2">{txn.note}</span>}
                      · {timeAgo(txn.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </motion.div>
  );
}
