import { createContext, useState, useEffect, ReactNode } from 'react';
import { transactionService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'expense' | 'income';
  desc?: string;
  categoryId: string;
  createdAt?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
}

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const TransactionsContext = createContext<TransactionsContextType>({} as TransactionsContextType);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const fetchTransactions = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll(token);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      showToast('error', err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const newTransaction = await transactionService.create(transaction, token);
      setTransactions(prev => [...prev, newTransaction]);
      showToast('success', 'Transaction added successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
      showToast('error', err.message || 'Failed to add transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const updatedTransaction = await transactionService.update(id, transaction, token);
      setTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
      );
      showToast('success', 'Transaction updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update transaction');
      showToast('error', err.message || 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      await transactionService.delete(id, token);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('success', 'Transaction deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete transaction');
      showToast('error', err.message || 'Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, token]);

  const clearError = () => setError(null);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearError,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};