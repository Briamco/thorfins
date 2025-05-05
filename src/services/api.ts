const API_URL = import.meta.env.VITE_API_URL;

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  currencyId: number;
}

interface LoginParams {
  email: string;
  password: string;
}

interface VerifyParams {
  email: string;
  code: number;
}

interface ResendCodeParams {
  email: string;
}

interface UpdateUserParams {
  currencyId: number;
}

interface UpdatePasswordParams {
  newPassword: string;
}

interface TransactionParams {
  amount: number;
  type: 'expense' | 'income';
  desc?: string;
  categoryId: string;
}

interface CategoryParams {
  name: string;
  icon: string;
}

// Helper for making API requests with authentication
const makeRequest = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    // credentials: 'include',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // If response is not ok, throw an error
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'An error occurred');
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth Service
export const authService = {
  register: (data: RegisterParams) =>
    makeRequest('/auth/register', 'POST', data),

  login: (data: LoginParams) =>
    makeRequest('/auth/login', 'POST', data),

  verifyCode: (data: VerifyParams) =>
    makeRequest('/auth/verify', 'POST', data),

  resendCode: (data: ResendCodeParams) =>
    makeRequest('/auth/resendCode', 'PUT', data),

  checkAuth: (token: string) =>
    makeRequest('/auth/me', 'GET', undefined, token),

  updateUser: (token: string, data: UpdateUserParams) =>
    makeRequest('/auth/me/update', 'PUT', data, token),

  updatePassword: (email: string, data: UpdatePasswordParams) =>
    makeRequest(`/auth/changepass?email=${email}`, 'PUT', data),

  logout: () =>
    makeRequest('/auth/logout', 'POST'),
};

// Transaction Service
export const transactionService = {
  getAll: (token: string) =>
    makeRequest('/api/transactions', 'GET', undefined, token),

  create: (data: TransactionParams, token: string) =>
    makeRequest('/api/transactions', 'POST', data, token),

  update: (id: string, data: Partial<TransactionParams>, token: string) =>
    makeRequest(`/api/transactions/${id}`, 'PUT', data, token),

  delete: (id: string, token: string) =>
    makeRequest(`/api/transactions/${id}`, 'DELETE', undefined, token),
};

// Category Service
export const categoryService = {
  getAll: (token: string) =>
    makeRequest('/api/category', 'GET', undefined, token),

  create: (data: CategoryParams, token: string) =>
    makeRequest('/api/category', 'POST', data, token),

  update: (id: string, data: Partial<CategoryParams>, token: string) =>
    makeRequest(`/api/category/${id}`, 'PUT', data, token),

  delete: (id: string, token: string) =>
    makeRequest(`/api/category/${id}`, 'DELETE', undefined, token),
};

// Report Service
export const reportService = {
  getAmounts: (token: string) =>
    makeRequest('/api/reports/amounts', 'GET', undefined, token),
};

export const currencyService = {
  getAll: () =>
    makeRequest('/api/currency', 'GET')
}

export default {
  auth: authService,
  transactions: transactionService,
  categories: categoryService,
  reports: reportService,
  currencies: currencyService,
};