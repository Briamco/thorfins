import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';
import LenguageSelector from './LenguageSelector';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-10 bg-white dark:bg-gray-800
        transition-shadow duration-200
        ${isScrolled ? 'shadow-md' : 'shadow-sm'}
      `}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Menu size={24} />
            </button>
            <div className="md:flex md:items-center md:space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white md:block hidden">
                {t('navbar.appName')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LenguageSelector />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2 ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <Bell size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;