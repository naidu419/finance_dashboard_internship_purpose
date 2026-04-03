import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Role, Category } from '@/types/finance';
import { mockTransactions } from '@/data/mockData';

interface FilterState {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: Category | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface AppState {
  transactions: Transaction[];
  role: Role;
  filters: FilterState;
  activeTab: string;
  darkMode: boolean;

  setRole: (role: Role) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin',
      filters: {
        search: '',
        type: 'all',
        category: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
      },
      activeTab: 'overview',
      darkMode: false,

      setRole: (role) => set({ role }),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      setActiveTab: (activeTab) => set({ activeTab }),
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),
    }),
    {
      name: 'finance-dashboard',
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        role: state.role,
      }),
    }
  )
);

// Apply persisted dark mode on load
const stored = localStorage.getItem('finance-dashboard');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  } catch {}
}
