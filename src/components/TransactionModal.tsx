import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { Transaction } from '../contexts/TransactionsContext';
import { formatCurrency } from '../utils/textFormater';
import { useTranslation } from 'react-i18next';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionModal = ({ isOpen, onClose, transaction }: TransactionModalProps) => {
  const { t } = useTranslation();
  const { addTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const { user } = useAuth();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyFormater = (amount: number) => {
    if (user) {
      return formatCurrency(amount, user?.currency.currency, user?.currency.countryId);
    }
    return '';
  };

  const currencySymbol = currencyFormater(0).split('0.00')[0];

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setDescription(transaction.desc || '');
      setCategoryId(transaction.categoryId);
    } else {
      setAmount('');
      setType('expense');
      setDescription('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
    }
  }, [transaction, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError(t('transactions.addEditTransaction.invalidAmount'));
      return;
    }

    if (!categoryId) {
      setError(t('transactions.addEditTransaction.selectCategory'));
      return;
    }

    try {
      setIsSubmitting(true);

      const transactionData = {
        amount: Number(amount),
        type,
        desc: description,
        categoryId,
      };

      if (isEditing && transaction) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || t('transactions.addEditTransaction.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? t('transactions.addEditTransaction.editTitle') : t('transactions.addEditTransaction.addTitle')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${type === 'expense'
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => setType('expense')}
                >
                  {t('transactions.addEditTransaction.expense')}
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${type === 'income'
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => setType('income')}
                >
                  {t('transactions.addEditTransaction.income')}
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('transactions.addEditTransaction.amountLabel')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full px-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('transactions.addEditTransaction.categoryLabel')}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="block w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('transactions.addEditTransaction.selectCategoryOption')}</option>
                {categories
                  .filter(() => (type === 'expense' ? true : true)) // Filter later if needed
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('transactions.addEditTransaction.descriptionLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="block w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={t('transactions.addEditTransaction.descriptionPlaceholder')}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {t('transactions.addEditTransaction.cancelButton')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-md
                  ${isSubmitting
                    ? 'bg-primary-400 dark:bg-primary-600 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
                  }
                `}
              >
                {isSubmitting
                  ? isEditing
                    ? t('transactions.addEditTransaction.savingButton')
                    : t('transactions.addEditTransaction.addingButton')
                  : isEditing
                    ? t('transactions.addEditTransaction.saveChangesButton')
                    : t('transactions.addEditTransaction.addButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;