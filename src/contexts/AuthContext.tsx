import { createContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/api';
import { Currency } from './CurrencyContext';
import { useToast } from '../hooks/useToast';

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  currencyId: number;
  currency: Currency
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string, currencyId: number) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyCode: (email: string, code: number) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (currencyId: number) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('financeToken'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast()

  const register = async (name: string, email: string, password: string, currencyId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register({ name, email, password, currencyId });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('financeToken', data.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('financeToken', data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('financeToken');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.verifyCode({ email, code });
      setUser(prev => prev ? { ...prev, verified: true } : null);
      return data;
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      return await authService.resendCode({ email });
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (currencyId: number) => {
    try {
      setLoading(true)
      setError(null);
      const data = await authService.updateUser(token || '', { currencyId })
      showToast('success', 'User updated')
      setUser(data)
      return data
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      showToast('error', err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('financeToken');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      setLoading(true);
      const data = await authService.checkAuth(storedToken);
      setUser(data);
      setToken(storedToken);
    } catch (err) {
      localStorage.removeItem('financeToken');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        verifyCode,
        resendCode,
        updateUser,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};