import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/textFormater';
import TopExpenseCategory from '../components/TopExpense';
import Charts from '../components/Charts';
import { ArrowDown, BarChart, PieChart } from 'lucide-react';

type Period = 'week' | 'month' | 'year' | 'all';
type ChartType = 'bar' | 'pie';

const Reports = () => {
  const { t } = useTranslation();
  const { transactions } = useTransactions();
  const { user } = useAuth();

  const [period, setPeriod] = useState<Period>('month');
  const [chartType, setChartType] = useState<ChartType>('bar');

  const currencyFormater = (amount: number) => {
    if (user?.currency) {
      return formatCurrency(amount, user?.currency.currency, user?.currency.countryId);
    }
    return '';
  };

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const filteredTransactions = [...transactions].filter((transaction) => {
      if (!transaction.createdAt) return false;

      const transactionDate = new Date(transaction.createdAt);

      switch (period) {
        case 'week':
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return transactionDate >= oneWeekAgo;
        case 'month':
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return transactionDate >= oneMonthAgo;
        case 'year':
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return transactionDate >= oneYearAgo;
        case 'all':
        default:
          return true;
      }
    });

    return filteredTransactions;
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate total income and expenses
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('reports.title')}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('reports.timePeriodLabel')}
            </label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="week">{t('reports.last7Days')}</option>
                <option value="month">{t('reports.last30Days')}</option>
                <option value="year">{t('reports.last12Months')}</option>
                <option value="all">{t('reports.allTime')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('reports.chartTypeLabel')}
            </label>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button
                type="button"
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'bar'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => setChartType('bar')}
              >
                <BarChart size={16} className="mr-1" />
                {t('reports.barChart')}
              </button>
              <button
                type="button"
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'pie'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => setChartType('pie')}
              >
                <PieChart size={16} className="mr-1" />
                {t('reports.pieChart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('reports.income')}</p>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {currencyFormater(totalIncome)}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('reports.expenses')}</p>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {currencyFormater(totalExpense)}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('reports.balance')}</p>
          <h3 className={`text-2xl font-bold mt-1 ${totalIncome - totalExpense >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
            }`}>
            {currencyFormater(totalIncome - totalExpense)}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Charts period={period} chartType={chartType} />

        {/* Top Expenses */}
        <TopExpenseCategory user={user} totalExpense={totalExpense} />
      </div>
    </div>
  );
};

export default Reports;