import { Account, ApiError, AuthResponse, PaginatedResult, Transaction, TransactionFilter, User } from '../types';
import { getLocalStorage, safeConsole, safeFetch, safeSetTimeout, getURLSearchParams } from '../utils/browser';

const viteUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_API_URL) || '';
const nodeEnvUrl = ''; // avoid referencing process.env to appease no-undef in ESLint for browser bundle
const BASE_URL = viteUrl || nodeEnvUrl || '';

if (!BASE_URL) {
  const c = safeConsole();
  c?.warn('BACKEND_API_URL is not set. Set VITE_BACKEND_API_URL (preferred) or BACKEND_API_URL.');
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

let authToken: string | null = null;

// PUBLIC_INTERFACE
export function setAuthToken(token: string | null) {
  /** Sets the bearer token for subsequent API requests. */
  authToken = token;
  const ls = getLocalStorage();
  if (token) {
    try {
      ls?.setItem('auth_token', token);
    } catch {
      // ignore storage errors
    }
  } else {
    try {
      ls?.removeItem('auth_token');
    } catch {
      // ignore
    }
  }
}

// Attempt to restore token from localStorage
try {
  const ls = getLocalStorage();
  const t = ls?.getItem('auth_token');
  if (t) authToken = t;
} catch {
  // ignore
}

async function request<T>(path: string, method: HttpMethod = 'GET', body?: any, retry = 1): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const url = `${BASE_URL}${path}`;
  try {
    const $fetch = safeFetch();
    if (!$fetch) {
      throw { message: 'Fetch API not available in this environment' };
    }
    const res = await $fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    } as any);
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await res.json() : undefined;

    if (!res.ok) {
      const err: ApiError = {
        message: (payload && (payload.detail || payload.message)) || `Request failed: ${res.status}`,
        status: res.status,
        details: payload,
      };
      if (retry > 0 && (res.status >= 500 || res.status === 429)) {
        const st = safeSetTimeout();
        await new Promise((r) => st ? st(r, 400) : r(null));
        return request<T>(path, method, body, retry - 1);
      }
      throw err;
    }

    return (payload as T) ?? ({} as T);
  } catch (e: any) {
    if (retry > 0) {
      const st = safeSetTimeout();
      await new Promise((r) => st ? st(r, 300) : r(null));
      return request<T>(path, method, body, retry - 1);
    }
    const err: ApiError = { message: e?.message || 'Network error' };
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<{ user?: User; token: string }> {
  /** Logs a user in and stores the auth token. */
  const data = await request<AuthResponse>('/auth/login', 'POST', { email, password });
  const token = data.access_token;
  setAuthToken(token);
  return { user: data.user, token };
}

// PUBLIC_INTERFACE
export async function me(): Promise<User | null> {
  /** Returns currently authenticated user or null. */
  try {
    const data = await request<User>('/auth/me', 'GET');
    return data;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function getAccounts(): Promise<Account[]> {
  /** Fetch all accounts for the current user. */
  return request<Account[]>('/accounts', 'GET');
}

// PUBLIC_INTERFACE
export async function getAccount(id: string): Promise<Account> {
  /** Fetch account details by ID. */
  return request<Account>(`/accounts/${id}`, 'GET');
}

// PUBLIC_INTERFACE
export async function getAccountBalance(id: string): Promise<{ balance: number }> {
  /** Fetch account balance for a given account ID. */
  return request<{ balance: number }>(`/accounts/${id}/balance`, 'GET');
}

// PUBLIC_INTERFACE
export async function getTransactions(filter: TransactionFilter): Promise<PaginatedResult<Transaction>> {
  /** Fetch transactions with optional filters and pagination. */
  const URLSP = getURLSearchParams();
  const w = (typeof window !== 'undefined' ? (window as any) : null);
  const p = URLSP ? new URLSP() : (w && w.URLSearchParams ? new w.URLSearchParams() : new (class {
    private data: Record<string, string> = {};
    set(k: string, v: string) { this.data[k] = v; }
    toString() { return Object.entries(this.data).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'); }
  })());
  if (filter.accountId) p.set('accountId', filter.accountId);
  if (filter.type && filter.type !== 'all') p.set('type', filter.type);
  if (filter.startDate) p.set('startDate', filter.startDate);
  if (filter.endDate) p.set('endDate', filter.endDate);
  p.set('page', String(filter.page ?? 1));
  p.set('pageSize', String(filter.pageSize ?? 10));
  const qs = p.toString() ? `?${p.toString()}` : '';
  return request<PaginatedResult<Transaction>>(`/transactions${qs}`, 'GET');
}

// PUBLIC_INTERFACE
export async function createTransaction(input: {
  account_id: string;
  target_account_id?: string | null;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description?: string;
}): Promise<Transaction> {
  /** Create a new transaction. */
  return request<Transaction>('/transactions', 'POST', input);
}

// PUBLIC_INTERFACE
export function getBaseUrl(): string {
  /** Returns the resolved API base URL for diagnostics. */
  return BASE_URL;
}
