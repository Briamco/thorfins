import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../hooks/useCategories';
import CategoryModal from '../components/CategoryModal';
import { Category } from '../contexts/CategoriesContext';

const Categories = () => {
  const { t } = useTranslation();
  const { categories, loading, deleteCategory } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: string, isEditable: boolean) => {
    if (!isEditable) {
      alert(t('categories.defaultCategoryAlert'));
      return;
    }

    if (window.confirm(t('categories.deleteConfirmation'))) {
      await deleteCategory(id);
    }
  };

  const filteredCategories = categories.filter(category => {
    return !searchTerm || category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categories.title')}</h1>

        <button
          onClick={handleAddCategory}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" />
          {t('categories.addCategoryButton')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('categories.searchPlaceholder')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                    {category.icon}
                  </div>
                  <div className="ml-3 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                  {category.editable && <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 rounded-full text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil size={18} />
                  </button>}
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.editable)}
                    className={`p-1 rounded-full ${category.editable
                      ? 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    disabled={!category.editable}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t('noCategoriesFound')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? t('categories.searchNoResults')
                : t('categories.addFirstCategory')}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddCategory}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
              >
                <Plus size={18} className="mr-1" />
                {t('categories.addCategoryButton')}
              </button>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default Categories;