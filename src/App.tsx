import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme';
import { Cog, Loader } from 'lucide-react';

function App() {
  const { user, loading, checkAuth, resendCode } = useAuth();
  const { theme } = useTheme();

  const navigate = useNavigate()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className={`${theme} min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900`}>
        <Loader size={40} className="text-primary animate-spin mb-4" />
        <p className="text-gray-700 dark:text-gray-300">Loading your financial data...</p>
      </div>
    );
  }

  const verifyAccount = async () => {
    try {
      await resendCode(user!.email);
    } catch (err) {
      // Error handled by auth context
    } finally {
      navigate('/verify')
    }
  }

  return (
    <div className={`${theme} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/verify" element={!user?.verified ? <Verify /> : <Navigate to="/" />} />

        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {user && !user.verified && window.location.pathname !== '/verify' && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-fit bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-4 py-2 rounded-full flex items-center space-x-2 shadow-md animate-bounce" onClick={verifyAccount}>
          <Cog size={16} className="animate-spin" />
          <span>Please verify your account</span>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ user }: { user: any }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default App;