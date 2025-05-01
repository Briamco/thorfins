import {
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from '../hooks/useCategories';
import { Calendar } from 'lucide-react';

interface ChartProps {
  period: 'week' | 'month' | 'year' | 'all'
  chartType: 'bar' | 'pie'
}

const Charts = ({ period, chartType }: ChartProps) => {
  const { transactions } = useTransactions();
  const { categories } = useCategories();

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

  // Group transactions by category
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.categoryId;
      if (!acc[category]) {
        const categoryData = categories.find((c) => c.id === category);
        acc[category] = {
          amount: 0,
          categoryId: category,
          categoryName: categoryData?.name || 'Unknown',
          categoryIcon: categoryData?.icon || '💸',
        };
      }
      acc[category].amount += transaction.amount;
      return acc;
    }, {} as Record<string, { amount: number; categoryId: string; categoryName: string; categoryIcon: string }>);

  // Convert to array and sort by amount
  const expenseCategoriesArray = Object.values(expensesByCategory).sort((a, b) => b.amount - a.amount);

  const COLORS = ['#34d399', '#60a5fa', '#f472b6', '#facc15', '#fb923c'];

  const pieData = expenseCategoriesArray.map((item, index) => ({
    name: `${item.categoryIcon} ${item.categoryName}`,
    value: item.amount,
    color: COLORS[index % COLORS.length],
  }));

  const barData = expenseCategoriesArray.map((item, index) => ({
    name: `${item.categoryIcon} ${item.categoryName}`, // Añadimos el emoji antes del nombre
    amount: item.amount,
    fill: COLORS[index % COLORS.length]
  }));

  // Generate chart description
  const getChartDescription = () => {
    switch (period) {
      case 'week':
        return 'Spending for the last 7 days';
      case 'month':
        return 'Spending for the last 30 days';
      case 'year':
        return 'Spending for the last 12 months';
      case 'all':
      default:
        return 'All-time spending';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {chartType === 'bar' ? 'Expense Breakdown' : 'Expense Distribution'}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{getChartDescription()}</p>

      {filteredTransactions.length > 0 ? (
        <div className="flex items-center justify-center h-64">
          {chartType === 'bar' ? (
            <ReBarChart width={500} height={300} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          ) : (
            <RePieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No transaction data for this period</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add transactions to see your spending breakdown</p>
        </div>
      )}
    </div>
  )
}

export default Charts