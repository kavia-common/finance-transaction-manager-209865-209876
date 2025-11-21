export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD' | 'CAD' | string;

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface Account {
  id: string;
  name: string;
  currency: CurrencyCode;
  balance: number;
}

export interface Transaction {
  id: string;
  account_id: string;
  target_account_id?: string | null;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string; // ISO date
}

export interface TransactionFilter {
  accountId?: string;
  type?: TransactionType | 'all';
  startDate?: string; // ISO
  endDate?: string;   // ISO
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Simple utility to format currency
export function formatCurrency(amount: number, currency: CurrencyCode) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

// Date helpers
export function toISODateString(date: Date) {
  return date.toISOString().slice(0, 10);
}
