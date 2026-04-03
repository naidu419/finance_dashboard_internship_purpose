import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const cards = [
  { key: 'balance', label: 'Total Balance', icon: Wallet, color: 'text-primary' },
  { key: 'income', label: 'Total Income', icon: TrendingUp, color: 'text-income' },
  { key: 'expense', label: 'Total Expenses', icon: TrendingDown, color: 'text-expense' },
  { key: 'count', label: 'Transactions', icon: DollarSign, color: 'text-warning' },
] as const;

export function SummaryCards({ balance, totalIncome, totalExpense, transactionCount }: SummaryCardsProps) {
  const values: Record<string, string> = {
    balance: formatCurrency(balance),
    income: formatCurrency(totalIncome),
    expense: formatCurrency(totalExpense),
    count: transactionCount.toString(),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold font-heading tracking-tight">
                    {values[c.key]}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-secondary ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
