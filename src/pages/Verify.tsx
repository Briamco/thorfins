import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { MailCheck } from 'lucide-react';

const Verify = () => {
  const { t } = useTranslation('verify');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { user, verifyCode, resendCode, error, clearError } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, canResend]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');

    if (!code || code.length !== 6 || isNaN(Number(code))) {
      setFormError(t('verify.invalidCode'));
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyCode(user!.email, Number(code));
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      await resendCode(user!.email);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      // Error handled by auth context
    }
  };

  return (
    <div
      className={`${theme} min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <MailCheck size={24} className="text-primary-600 dark:text-primary-300" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('verify.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('verify.sentCode')}
            <br />
            {user?.email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(formError || error) && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
              {formError || error}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('verify.codeLabel')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setCode(value);
              }}
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center tracking-widest text-lg"
              placeholder="123456"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white
                ${isSubmitting
                  ? 'bg-primary-400 dark:bg-primary-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900'
                }
              `}
            >
              {isSubmitting ? t('verify.verifying') : t('verify.verifyButton')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend}
              className={`
                text-sm font-medium
                ${canResend
                  ? 'text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'
                  : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canResend ? t('verify.resendCode') : t('verify.resendIn', { seconds: countdown })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;