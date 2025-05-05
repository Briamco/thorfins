import { FormEvent, useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useTheme } from "../hooks/useTheme"
import { useTranslation } from "react-i18next"
import { EyeOff, Mail, Lock, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import LenguageSelector from "../components/LenguageSelector"

//TODO: verification code
const ChangePassword = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation()
  const { theme } = useTheme()
  const { user, clearError, error, changePass, checkAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setIsEmail(true)
    }
  }, [])

  const confirmEmail = (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');

    if (!email) {
      setFormError(t('login.emailRequired'));
      return;
    }

    setIsEmail(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    setFormError('')

    if (!newPassword) {
      setFormError(t('register.passwordRequired'));
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setFormError(t('register.passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 6) {
      setFormError(t('register.passwordLength'));
      return;
    }

    try {
      setIsSubmitting(true);
      await changePass(email, newPassword)
      await checkAuth()
      navigate('/login');
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`${theme} min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="fixed top-5 right-5">
        <LenguageSelector />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-300 text-2xl font-bold">T</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('changepass.title')}
          </h2>
        </div>

        {isEmail ? (
          <form onSubmit={handleSubmit}>
            {(formError || error) && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                {formError || error}
              </div>
            )}
            <div className="rounded-md -space-y-px">
              <div className="mb-8">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('register.passwordLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none rounded-md block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder={t('register.passwordPlaceholder')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('register.confirmPasswordLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={newConfirmPassword}
                      onChange={(e) => setNewConfirmPassword(e.target.value)}
                      className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder={t('register.confirmPasswordPlaceholder')}
                    />
                  </div>
                </div>
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
                  {isSubmitting ? t('changepass.changingPassButton') : t('changepass.changePassButton')}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={confirmEmail}>
            {(formError || error) && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                {formError || error}
              </div>
            )}
            <div className="rounded-md -space-y-px">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('login.emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder={t('login.emailPlaceholder')}
                  />
                </div>
              </div>

            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
              >
                {t('changepass.emailButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ChangePassword