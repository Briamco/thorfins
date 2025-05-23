import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { Home } from 'lucide-react';

const NotFound = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className={`${theme} min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4`}>
      <div className="text-center">
        <div className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t('notFound.title')}</h1>
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">{t('notFound.description')}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="flex items-center rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <Home size={18} className="mr-2" />
            {t('notFound.goHomeButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;