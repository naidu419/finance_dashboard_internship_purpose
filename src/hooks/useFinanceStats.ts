import { useMemo } from 'react';
import { Transaction, MonthlyData } from '@/types/finance';

export function useFinanceStats(transactions: Transaction[]) {
  return useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Category breakdown
    const categoryMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly data
    const monthMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      const existing = monthMap.get(month) || { income: 0, expense: 0 };
      if (t.type === 'income') existing.income += t.amount;
      else existing.expense += t.amount;
      monthMap.set(month, existing);
    });
    const monthlyData: MonthlyData[] = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }));

    // Highest spending category
    const highestCategory = categoryBreakdown[0] || null;

    // Month over month comparison
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const expenseChange = currentMonth && previousMonth
      ? ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100
      : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryBreakdown,
      monthlyData,
      highestCategory,
      currentMonth,
      previousMonth,
      expenseChange,
      transactionCount: transactions.length,
      avgTransaction: totalExpense / (transactions.filter(t => t.type === 'expense').length || 1),
    };
  }, [transactions]);
}
