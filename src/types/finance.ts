export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Rent'
  | 'Travel'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type Role = 'viewer' | 'admin';

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
