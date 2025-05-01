import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../contexts/CategoriesContext';

// Common emojis for financial categories
const commonIcons = [
  '🍔', '🛒', '🏠', '🚗', '💊', '🎓', '💼', '✈️',
  '🎬', '🎮', '👕', '💇', '🏋️', '🎁', '💰', '💳',
  '📱', '⚡', '💧', '🔥', '🍾', '👨‍👩‍👧‍👦', '💸', '🏦'
];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

function isEmoji(str: string): boolean {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return emojiRegex.test(str);
}

const CategoryModal = ({ isOpen, onClose, category }: CategoryModalProps) => {
  const { addCategory, updateCategory } = useCategories();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍔');
  const [customIcon, setCustomIcon] = useState('');
  const [customIconError, setCustomIconError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!category;
  const canEdit = category ? category.editable : true;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setCustomIcon('');
      setCustomIconError('');
    } else {
      setName('');
      setIcon('🍔');
      setCustomIcon('');
      setCustomIconError('');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a category name');
      return;
    }

    if (!icon.trim()) {
      setError('Please select an icon');
      return;
    }

    if (!isEmoji(icon.trim())) {
      setError('Please enter a valid emoji (e.g., 😎, 🍔, 🏠)');
      return;
    }

    try {
      setIsSubmitting(true);

      const categoryData = {
        name: name.trim(),
        icon,
      };

      if (isEditing && category) {
        await updateCategory(category.id, categoryData);
      } else {
        await addCategory(categoryData);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
              {isEditing ? 'Edit Category' : 'Add Category'}
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

            {!canEdit && (
              <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-3 rounded-md text-sm">
                This is a default category. You can only change the icon.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canEdit}
                className={`
                  block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-gray-100 
                  ${!canEdit
                    ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  }
                `}
                placeholder="e.g., Groceries, Rent, Salary"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2 mb-2">
                {commonIcons.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji);
                      setCustomIcon('');
                      setCustomIconError('');
                    }}
                    className={`
                      w-9 h-9 text-xl flex items-center justify-center rounded
                      ${icon === emoji
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 dark:ring-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <input
                type="text"
                maxLength={2}
                value={customIcon}
                onChange={(e) => {
                  const input = e.target.value.trim();
                  setCustomIcon(input);

                  if (!input) {
                    setCustomIconError('');
                    return;
                  }

                  if (isEmoji(input)) {
                    setIcon(input);
                    setCustomIconError('');
                  } else {
                    setCustomIconError('❌ No es un emoji válido');
                  }
                }}
                placeholder="O escribe tu emoji"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />

              {customIconError && (
                <p className="mt-1 text-sm text-red-500">{customIconError}</p>
              )}

              <div className="mt-3 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Selected icon: </span>
                <span className="text-2xl">{icon}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
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
                  ? isEditing ? 'Saving...' : 'Adding...'
                  : isEditing ? 'Save Changes' : 'Add Category'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
