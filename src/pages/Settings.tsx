import { useState } from 'react';
import { User, Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';
import LenguageSelector from '../components/LenguageSelector';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t } = useTranslation();
  const { user, logout, updateUser, checkAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currencies } = useCurrency();
  const navigate = useNavigate()

  const [currencyId, setCurrencyId] = useState(user?.currencyId);
  const [activeTab, setActiveTab] = useState('account');

  const handleUpdate = () => {
    updateUser(currencyId || 1);
    checkAuth();
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.accountSettings')}</h2>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.personalInformation')}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('settings.nameLabel')}
                    </label>
                    <input
                      type="text"
                      value={user?.name}
                      disabled
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('settings.emailLabel')}
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.personalInfoChange')}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.accountSecurity')}</h3>

                <button
                  onClick={() => navigate('/changepass')}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
                  {t('settings.changePasswordButton')}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={logout}
                    className="w-full py-2 px-4 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                  >
                    {t('settings.logoutButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.preferences')}</h2>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.currency')}</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.primaryCurrencyLabel')}
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <select
                        id="currency"
                        name="currency"
                        value={currencyId}
                        onChange={(e) => setCurrencyId(Number(e.target.value))}
                        className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.currency} - {currency.country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleUpdate}
                      className="ml-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
                    >
                      {t('settings.changeButton')}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.currencyDescription')}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.language')}</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.usageLanguage')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.selectLanguage')}</p>
                  </div>
                  <LenguageSelector />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.appearance')}</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.darkMode')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'dark' ? t('settings.darkModeActive') : t('settings.lightModeActive')}
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('settings.notifications')}</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.emailNotifications')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.emailNotificationsDescription')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.budgetAlerts')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.budgetAlertsDescription')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="budget-alerts"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.title')}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">
                  {user?.name[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'account'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <User size={18} className="mr-3 flex-shrink-0" />
                {t('settings.accountTab')}
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'preferences'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Globe size={18} className="mr-3 flex-shrink-0" />
                {t('settings.preferencesTab')}
              </button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;