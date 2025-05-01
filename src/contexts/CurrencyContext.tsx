import { createContext, useState, ReactNode, useEffect } from 'react';
import { currencyService } from '../services/api';
import { useToast } from '../hooks/useToast';

export interface Currency {
  id: number;
  currency: string;
  country: string;
  countryId: string;
}

interface CurrencyContextType {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
  fetchCurrencies: () => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextType>({} as CurrencyContextType);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCurrencies = async () => {      
    try {
      setLoading(true);
      setError(null);
      const data = await currencyService.getAll();
      setCurrencies(data);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch currencies';
      setError(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies()
  }, [])

  return (
    <CurrencyContext.Provider value={{ currencies, loading, error, fetchCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};
