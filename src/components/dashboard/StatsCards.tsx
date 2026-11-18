'use client';

import { motion } from 'framer-motion';
import { Package, AlertTriangle, Wrench, CheckCircle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalItems: number;
    totalStock: number;
    lowStockCount: number;
    maintenanceCount: number;
    availableCount: number;
  } | null;
  loading: boolean;
}

const cards = [
  { key: 'totalItems', label: 'Total Aset', icon: Package, color: 'blue', desc: 'jenis barang' },
  { key: 'totalStock', label: 'Total Stok', icon: TrendingUp, color: 'indigo', desc: 'unit tersedia' },
  { key: 'availableCount', label: 'Tersedia', icon: CheckCircle, color: 'green', desc: 'item siap pakai' },
  { key: 'lowStockCount', label: 'Stok Kritis', icon: AlertTriangle, color: 'amber', desc: 'perlu restock' },
  { key: 'maintenanceCount', label: 'Maintenance', icon: Wrench, color: 'red', desc: 'sedang diperbaiki' },
];

const colorMap: Record<string, { bg: string; icon: string; ring: string; text: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', icon: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-800', text: 'text-blue-700 dark:text-blue-300' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-200 dark:ring-indigo-800', text: 'text-indigo-700 dark:text-indigo-300' },
  green: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', icon: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-800', text: 'text-amber-700 dark:text-amber-300' },
  red: { bg: 'bg-red-50 dark:bg-red-950/40', icon: 'text-red-600 dark:text-red-400', ring: 'ring-red-200 dark:ring-red-800', text: 'text-red-700 dark:text-red-300' },
};

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((_, i) => (
          <div key={i} className="rounded-2xl border border-[hsl(var(--border))] p-5 space-y-3">
            <div className="skeleton h-10 w-10 rounded-xl" />
            <div className="skeleton h-7 w-16" />
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const c = colorMap[card.color];
        const Icon = card.icon;
        const value = stats ? (stats as Record<string, number>)[card.key] : 0;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 cursor-default"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} mb-3`}>
              <Icon className={`w-5 h-5 ${c.icon}`} />
            </div>
            <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
              {value?.toLocaleString() ?? '—'}
            </div>
            <div className="text-sm font-medium text-[hsl(var(--foreground))] mt-0.5">{card.label}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{card.desc}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
