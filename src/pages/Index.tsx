import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { useFinanceStats } from '@/hooks/useFinanceStats';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';

const Index = () => {
  const { transactions } = useStore();
  const stats = useFinanceStats(transactions);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardHeader />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SummaryCards
              balance={stats.balance}
              totalIncome={stats.totalIncome}
              totalExpense={stats.totalExpense}
              transactionCount={stats.transactionCount}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceChart data={stats.monthlyData} />
              <SpendingChart data={stats.categoryBreakdown} />
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsPanel
              highestCategory={stats.highestCategory}
              expenseChange={stats.expenseChange}
              avgTransaction={stats.avgTransaction}
              totalIncome={stats.totalIncome}
              totalExpense={stats.totalExpense}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceChart data={stats.monthlyData} />
              <SpendingChart data={stats.categoryBreakdown} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
