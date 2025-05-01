import { useState } from 'react';
import { Plus, Filter, ArrowDownUp, Search, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import TransactionModal from '../components/TransactionModal';
import { Transaction } from '../contexts/TransactionsContext';
import { formatCurrency } from '../utils/textFormater';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'income' | 'expense';

const Transactions = () => {
  const { t } = useTranslation('transactions');
  const { transactions, loading, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const currencyFormater = (amount: number) => {
    if (user?.currency) {
      return formatCurrency(amount, user?.currency.currency, user?.currency.countryId);
    }
    return '';
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm(t('transactions.deleteConfirmation'))) {
      await deleteTransaction(id);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch =
      !searchTerm ||
      (transaction.desc?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      categories
        .find((c) => c.id === transaction.categoryId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === 'category') {
      const categoryA = categories.find((c) => c.id === a.categoryId)?.name || '';
      const categoryB = categories.find((c) => c.id === b.categoryId)?.name || '';
      return sortOrder === 'asc'
        ? categoryA.localeCompare(categoryB)
        : categoryB.localeCompare(categoryA);
    }
    return 0;
  });

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions.title')}</h1>

        <button
          onClick={handleAddTransaction}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" />
          {t('transactions.addTransactionButton')}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('transactions.searchPlaceholder')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md">
            <button
              className={`px-3 py-2 rounded-l-md transition-colors ${filterType === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              onClick={() => setFilterType('all')}
            >
              {t('transactions.all')}
            </button>
            <button
              className={`px-3 py-2 transition-colors ${filterType === 'income'
                ? 'bg-primary-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              onClick={() => setFilterType('income')}
            >
              {t('transactions.income')}
            </button>
            <button
              className={`px-3 py-2 rounded-r-md transition-colors ${filterType === 'expense'
                ? 'bg-primary-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              onClick={() => setFilterType('expense')}
            >
              {t('transactions.expense')}
            </button>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-500 dark:text-gray-400 text-sm">{t('transactions.sortLabel')}:</span>
            <button
              className="flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => toggleSort('date')}
            >
              {t('transactions.date')}
              {sortField === 'date' && (
                sortOrder === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : sortedTransactions.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <button className="flex items-center focus:outline-none" onClick={() => toggleSort('date')}>
                      {t('transactions.date')}
                      {sortField === 'date' && <ArrowDownUp size={14} className="ml-1" />}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <button className="flex items-center focus:outline-none" onClick={() => toggleSort('category')}>
                      {t('transactions.category')}
                      {sortField === 'category' && <ArrowDownUp size={14} className="ml-1" />}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('transactions.description')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <button className="flex items-center ml-auto focus:outline-none" onClick={() => toggleSort('amount')}>
                      {t('transactions.amount')}
                      {sortField === 'amount' && <ArrowDownUp size={14} className="ml-1" />}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('transactions.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTransactions.map((transaction) => {
                  const category = categories.find((c) => c.id === transaction.categoryId);
                  return (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                            <span>{category?.icon || '?'}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {category?.name || t('transactions.unknownCategory')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.desc || '-'}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                          }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{currencyFormater(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransaction(transaction.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Filter size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {t('transactions.noTransactionsFound')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== 'all'
                ? t('transactions.adjustFilters')
                : t('transactions.addFirstTransaction')}
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={handleAddTransaction}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
              >
                <Plus size={18} className="mr-1" />
                {t('transactions.addTransactionButton')}
              </button>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;