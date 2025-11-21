import React, { useEffect, useMemo, useState } from 'react';
import { Account, PaginatedResult, Transaction, TransactionFilter, TransactionType, formatCurrency } from '../types';
import { colors, radii, shadows, spacing } from '../styles/theme';
import { getTransactions } from '../api/client';

interface Props {
  accounts: Account[];
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thtd: React.CSSProperties = {
  textAlign: 'left',
  padding: spacing(1),
  borderBottom: `1px solid ${colors.border}`,
};

export const TransactionList: React.FC<Props> = ({ accounts }) => {
  const [filter, setFilter] = useState<TransactionFilter>({
    page: 1,
    pageSize: 10,
    type: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedResult<Transaction>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [error, setError] = useState<string | null>(null);

  const accountMap = useMemo(() => {
    const m = new Map<string, Account>();
    accounts.forEach((a) => m.set(a.id, a));
    return m;
  }, [accounts]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions(filter);
      setData(res);
    } catch (e: any) {
      setError(e?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    void loadData();
  }, [filter.accountId, filter.type, filter.startDate, filter.endDate, filter.page, filter.pageSize]);

  return (
    <section style={{ margin: spacing(2) }}>
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          boxShadow: shadows.sm,
          padding: spacing(2),
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing(2) }}>
          <h2 style={{ margin: 0, color: colors.text }}>Transactions</h2>
          <div style={{ color: colors.textMuted }}>
            {loading ? 'Loading...' : `${data.total} total`}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: spacing(1),
            marginBottom: spacing(2),
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <select
            value={filter.accountId || ''}
            onChange={(e) => setFilter((f) => ({ ...f, accountId: e.target.value || undefined, page: 1 }))}
            style={{
              padding: spacing(1),
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
            }}
          >
            <option value="">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={filter.type || 'all'}
            onChange={(e) => setFilter((f) => ({ ...f, type: (e.target.value as TransactionType) || 'all', page: 1 }))}
            style={{
              padding: spacing(1),
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
            }}
          >
            <option value="all">All types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>

          <input
            type="date"
            value={filter.startDate || ''}
            onChange={(e) => setFilter((f) => ({ ...f, startDate: e.target.value || undefined, page: 1 }))}
            style={{
              padding: spacing(1),
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
            }}
          />
          <span style={{ color: colors.textMuted }}>to</span>
          <input
            type="date"
            value={filter.endDate || ''}
            onChange={(e) => setFilter((f) => ({ ...f, endDate: e.target.value || undefined, page: 1 }))}
            style={{
              padding: spacing(1),
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
            }}
          />

          <button
            onClick={() => void loadData()}
            style={{
              padding: `${spacing(1)} ${spacing(2)}`,
              borderRadius: radii.sm,
              border: 'none',
              background: colors.primary,
              color: '#fff',
              boxShadow: shadows.sm,
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>

        {error && <div style={{ color: colors.error, marginBottom: spacing(2) }}>{error}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtd}>Date</th>
                <th style={thtd}>Account</th>
                <th style={thtd}>Type</th>
                <th style={thtd}>Amount</th>
                <th style={thtd}>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((t) => {
                const account = accountMap.get(t.account_id);
                const currency = account?.currency || 'USD';
                return (
                  <tr key={t.id}>
                    <td style={thtd}>{new Date(t.date).toLocaleString()}</td>
                    <td style={thtd}>{account?.name || t.account_id}</td>
                    <td style={thtd} title={t.type}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          background:
                            t.type === 'deposit'
                              ? '#ECFDF5'
                              : t.type === 'withdrawal'
                              ? '#FEF2F2'
                              : '#EFF6FF',
                          color:
                            t.type === 'deposit'
                              ? '#065F46'
                              : t.type === 'withdrawal'
                              ? '#991B1B'
                              : '#1E3A8A',
                          fontSize: 12,
                        }}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={thtd}>{formatCurrency(t.amount, currency)}</td>
                    <td style={thtd}>{t.description || '-'}</td>
                  </tr>
                );
              })}
              {!loading && data.items.length === 0 && (
                <tr>
                  <td style={thtd} colSpan={5}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            gap: spacing(1),
            justifyContent: 'flex-end',
            marginTop: spacing(2),
            alignItems: 'center',
          }}
        >
          <span style={{ color: colors.textMuted }}>
            Page {data.page} of {Math.max(1, Math.ceil(data.total / (data.pageSize || 10)))}
          </span>
          <button
            disabled={loading || (data.page || 1) <= 1}
            onClick={() => setFilter((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
            style={{
              padding: `${spacing(1)} ${spacing(2)}`,
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              cursor: 'pointer',
            }}
          >
            Prev
          </button>
          <button
            disabled={loading || (data.page || 1) >= Math.ceil(data.total / (data.pageSize || 10))}
            onClick={() => setFilter((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            style={{
              padding: `${spacing(1)} ${spacing(2)}`,
              borderRadius: radii.sm,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              cursor: 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
