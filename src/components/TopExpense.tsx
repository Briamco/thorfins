import { CreditCard, PieChart } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/textFormater';
import { User } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface TopExpenseProps {
  user: User | null;
  totalExpense: number;
}

const TopExpenseCategory = ({ user, totalExpense }: TopExpenseProps) => {
  const { t } = useTranslation('dashboard');
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const currencyFormater = (amount: number) => {
    if (user?.currency) {
      return formatCurrency(amount, user?.currency.currency, user?.currency.countryId);
    }
    return '';
  };

  const expenseCategories = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.categoryId;
      if (!acc[category]) {
        acc[category] = {
          amount: 0,
          categoryId: category,
          categoryName: categories.find((c) => c.id === category)?.name || t('dashboard.unknown'),
          categoryIcon: categories.find((c) => c.id === category)?.icon || '?',
        };
      }
      acc[category].amount += transaction.amount;
      return acc;
    }, {} as Record<string, { amount: number; categoryId: string; categoryName: string; categoryIcon: string }>);

  // Convert to array and sort by amount
  const topExpenseCategories = Object.values(expenseCategories)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.topExpenseCategories')}</h2>
        <PieChart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>

      {topExpenseCategories.length > 0 ? (
        <div className="space-y-4">
          {topExpenseCategories.map((category) => (
            <div key={category.categoryId} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-xl">{category.categoryIcon}</span>
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {category.categoryName}
                </p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(category.amount / totalExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-3 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {category && currencyFormater(category.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noExpenseData')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('dashboard.addTransactionsInfo')}</p>
        </div>
      )}
    </div>
  );
};

export default TopExpenseCategory;