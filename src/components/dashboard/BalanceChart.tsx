import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyData } from '@/types/finance';

interface BalanceChartProps {
  data: MonthlyData[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Balance Trend</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Balance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(4, 90%, 58%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(4, 90%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(152, 69%, 41%)" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="hsl(4, 90%, 58%)" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-income" /> Income</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-expense" /> Expenses</span>
        </div>
      </CardContent>
    </Card>
  );
}
