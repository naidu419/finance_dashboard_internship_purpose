import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Transaction, Category } from '@/types/finance';
import { AddTransactionDialog } from './AddTransactionDialog';

const categories: Category[] = [
  'Salary', 'Freelance', 'Investments', 'Food & Dining', 'Shopping',
  'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Rent', 'Travel', 'Other',
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export function TransactionList() {
  const { transactions, filters, setFilters, role, deleteTransaction } = useStore();
  const [showAdd, setShowAdd] = useState(false);

  const filtered = transactions
    .filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return dir * a.date.localeCompare(b.date);
      return dir * (a.amount - b.amount);
    });

  const toggleSort = () => {
    setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">Transactions</CardTitle>
            {role === 'admin' && (
              <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>
            <Select value={filters.type} onValueChange={(v) => setFilters({ type: v as any })}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(v) => setFilters({ category: v as any })}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSort} title="Toggle sort order">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((t) => (
                  <TransactionRow key={t.id} transaction={t} role={role} onDelete={deleteTransaction} />
                ))}
              </AnimatePresence>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-right">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        </CardContent>
      </Card>

      <AddTransactionDialog open={showAdd} onOpenChange={setShowAdd} />
    </>
  );
}

function TransactionRow({
  transaction: t,
  role,
  onDelete,
}: {
  transaction: Transaction;
  role: string;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-income' : 'bg-expense'}`} />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{t.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{t.category}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-mono font-semibold text-sm ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
        </span>
        {role === 'admin' && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-expense" onClick={() => onDelete(t.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
