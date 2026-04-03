import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpendingChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(221, 83%, 53%)',
  'hsl(4, 90%, 58%)',
  'hsl(152, 69%, 41%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 67%, 55%)',
  'hsl(190, 80%, 45%)',
  'hsl(340, 75%, 55%)',
  'hsl(25, 85%, 55%)',
];

export function SpendingChart({ data }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Spending Breakdown</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No expense data
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.slice(0, 6).map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="truncate text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium font-mono text-xs">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
