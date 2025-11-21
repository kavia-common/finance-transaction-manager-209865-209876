import React from 'react';
import { Account, formatCurrency } from '../types';
import { colors, radii, shadows, spacing } from '../styles/theme';

interface Props {
  accounts: Account[];
  loading?: boolean;
  error?: string | null;
}

export const AccountSummary: React.FC<Props> = ({ accounts, loading, error }) => {
  const total = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

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
          <h2 style={{ margin: 0, color: colors.text }}>Account Summary</h2>
          <div style={{ color: colors.textMuted }}>{accounts.length} accounts</div>
        </div>

        {loading ? (
          <div>Loading accounts...</div>
        ) : error ? (
          <div style={{ color: colors.error }}>{error}</div>
        ) : (
          <>
            <div
              style={{
                marginBottom: spacing(2),
                padding: spacing(2),
                background: colors.subtle,
                borderRadius: radii.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ color: colors.textMuted }}>Total Balance</div>
              <div style={{ fontWeight: 700, fontSize: 22, color: colors.text }}>
                {formatCurrency(total, accounts[0]?.currency || 'USD')}
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: spacing(2),
              }}
            >
              {accounts.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.md,
                    padding: spacing(2),
                    background: '#fff',
                  }}
                >
                  <div style={{ fontWeight: 600, color: colors.text }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{a.currency}</div>
                  <div style={{ marginTop: spacing(1), fontSize: 18, color: colors.text }}>
                    {formatCurrency(a.balance, a.currency)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
