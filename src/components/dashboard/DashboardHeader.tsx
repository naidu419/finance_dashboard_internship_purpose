import { Moon, Sun, Shield, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Role } from '@/types/finance';

export function DashboardHeader() {
  const { role, setRole, darkMode, toggleDarkMode, transactions } = useStore();

  const exportData = (format: 'csv' | 'json') => {
    let content: string;
    let type: string;
    let ext: string;

    if (format === 'json') {
      content = JSON.stringify(transactions, null, 2);
      type = 'application/json';
      ext = 'json';
    } else {
      const headers = 'Date,Description,Amount,Type,Category\n';
      const rows = transactions.map((t) => `${t.date},"${t.description}",${t.amount},${t.type},${t.category}`).join('\n');
      content = headers + rows;
      type = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Finance Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your income, expenses, and spending patterns</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="gap-1">
            {role === 'admin' ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {role === 'admin' ? 'Admin' : 'Viewer'}
          </Badge>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => exportData('csv')} className="gap-1.5 h-8 text-xs">
          <Download className="h-3 w-3" /> CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportData('json')} className="gap-1.5 h-8 text-xs">
          <Download className="h-3 w-3" /> JSON
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
