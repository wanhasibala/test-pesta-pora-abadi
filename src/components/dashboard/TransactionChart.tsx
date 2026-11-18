'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  date: string;
  borrow: number;
  restock: number;
  return: number;
}

interface TransactionChartProps {
  data: TrendData[];
  loading: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
}

export function TransactionChart({ data, loading }: TransactionChartProps) {
  const formatted = data.map(d => ({ ...d, date: formatDate(d.date) }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Tren Transaksi 7 Hari</h2>
      </div>

      {loading ? (
        <div className="skeleton h-64 w-full rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="borrowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="restockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', fontSize: 12 }}
              labelStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Area type="monotone" dataKey="borrow" name="Peminjaman" stroke="#3b82f6" fill="url(#borrowGrad)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="restock" name="Restock" stroke="#10b981" fill="url(#restockGrad)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="return" name="Pengembalian" stroke="#f59e0b" fill="url(#returnGrad)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
