import { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Wallet, BarChart2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { reportService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/textFormater';
import TransactionModal from '../components/TransactionModal';
import TopExpenseCategory from '../components/TopExpense';

interface AmountSummary {
  totalIncome: number;
  totalExpense: number;
  total: number;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { categories } = useCategories();
  const { token, user } = useAuth();
  const [amountSummary, setAmountSummary] = useState<AmountSummary | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) return;

      try {
        setReportLoading(true);
        const data = await reportService.getAmounts(token);
        setAmountSummary(data);
      } catch (error) {
        console.error('Failed to fetch amount summary:', error);
      } finally {
        setReportLoading(false);
      }
    };

    fetchSummary();
  }, [token, transactions]);

  const currencyFormater = (amount: number) => {
    if (user?.currency) {
      return formatCurrency(amount, user?.currency.currency, user?.currency.countryId)
    }
    return ''
  }

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
    .slice(0, 5);

  const isLoading = transactionsLoading || reportLoading;

  return (
    <div className="py-6">
      <div className='flex items-center justify-between mb-6'>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
        <button
          onClick={handleAddTransaction}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" />
          {t('dashboard.addTransactionButton')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.totalIncome')}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {amountSummary && currencyFormater(amountSummary.totalIncome)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mr-4">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.totalExpenses')}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {amountSummary && currencyFormater(amountSummary.totalExpense)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
                  <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.netBalance')}</p>
                  <h3 className={`text-2xl font-bold ${(amountSummary?.total || 0) >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                    }`}>
                    {amountSummary && currencyFormater(amountSummary.total)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Breakdown */}
            <TopExpenseCategory user={user} totalExpense={amountSummary?.totalExpense || 0} />

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions')}</h2>
                <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>

              {recentTransactions.length > 0 ? (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.category')}</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.description')}</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.amount')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentTransactions.map((transaction) => {
                          const category = categories.find(c => c.id === transaction.categoryId);
                          return (
                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                                    <span>{category?.icon || '?'}</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{category?.name || t('unknown')}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {transaction.desc || '-'}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.type === 'income'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {transaction.type === 'income' ? '+' : '-'}{transaction && currencyFormater(transaction.amount)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <BarChart2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noTransactions')}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t('dashboard.recentTransactionsInfo')}</p>
                  <button
                    onClick={handleAddTransaction}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
                  >
                    <Plus size={18} className="mr-1" />
                    {t('dashboard.addTransactionButton')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={null}
        />
      )}
    </div>
  );
};

export default Dashboard;