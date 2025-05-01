import { createContext, useState, useEffect, ReactNode } from 'react';
import { categoryService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  editable: boolean;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'userId' | 'editable'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const fetchCategories = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll(token);
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      showToast('error', err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'userId' | 'editable'>) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const newCategory = await categoryService.create(category, token);
      setCategories(prev => [...prev, newCategory]);
      showToast('success', 'Category added successfully');
      return newCategory;
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
      showToast('error', err.message || 'Failed to add category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await categoryService.update(id, category, token);
      setCategories(prev => 
        prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c)
      );
      showToast('success', 'Category updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      showToast('error', err.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      await categoryService.delete(id, token);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('success', 'Category deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      showToast('error', err.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, token]);

  const clearError = () => setError(null);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        clearError,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};