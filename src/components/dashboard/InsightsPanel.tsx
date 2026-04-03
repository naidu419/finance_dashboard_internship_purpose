import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightsProps {
  highestCategory: { name: string; value: number } | null;
  expenseChange: number;
  avgTransaction: number;
  totalIncome: number;
  totalExpense: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export function InsightsPanel({ highestCategory, expenseChange, avgTransaction, totalIncome, totalExpense }: InsightsProps) {
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const insights = [
    {
      icon: Target,
      title: 'Top Spending Category',
      value: highestCategory ? highestCategory.name : 'N/A',
      detail: highestCategory ? formatCurrency(highestCategory.value) : '',
      color: 'text-expense',
    },
    {
      icon: expenseChange > 0 ? TrendingUp : TrendingDown,
      title: 'Monthly Expense Change',
      value: `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%`,
      detail: expenseChange > 0 ? 'Spending increased' : 'Spending decreased',
      color: expenseChange > 0 ? 'text-expense' : 'text-income',
    },
    {
      icon: BarChart3,
      title: 'Average Expense',
      value: formatCurrency(avgTransaction),
      detail: 'Per transaction',
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      detail: savingsRate >= 20 ? 'Great job! Above 20% target' : 'Below 20% recommended target',
      color: savingsRate >= 20 ? 'text-income' : 'text-warning',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className={`p-2 rounded-lg bg-secondary ${insight.color}`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{insight.title}</p>
                <p className="font-semibold font-heading">{insight.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
