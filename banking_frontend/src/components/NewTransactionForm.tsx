import React, { useState } from 'react';
import { Account, TransactionType } from '../types';
import { colors, radii, shadows, spacing } from '../styles/theme';
import { createTransaction } from '../api/client';

interface Props {
  accounts: Account[];
  onCreated?: () => void;
}

const labelStyle: React.CSSProperties = { fontSize: 12, color: colors.textMuted };
const inputStyle: React.CSSProperties = {
  padding: spacing(1),
  borderRadius: radii.sm,
  border: `1px solid ${colors.border}`,
  width: '100%',
  boxSizing: 'border-box',
};

const buttonPrimary: React.CSSProperties = {
  padding: `${spacing(1)} ${spacing(2)}`,
  borderRadius: radii.sm,
  border: 'none',
  background: colors.secondary,
  color: '#111827',
  cursor: 'pointer',
  boxShadow: shadows.sm,
  fontWeight: 600,
};

export const NewTransactionForm: React.FC<Props> = ({ accounts, onCreated }) => {
  const [type, setType] = useState<TransactionType>('deposit');
  const [accountId, setAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setAmount(0);
    setDescription('');
    setTargetAccountId('');
  };

  const validate = () => {
    if (!accountId) return 'Please select an account.';
    if (amount <= 0) return 'Amount must be greater than 0.';
    if (type === 'transfer' && (!targetAccountId || targetAccountId === accountId)) {
      return 'Select a different target account for transfer.';
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      await createTransaction({
        account_id: accountId,
        target_account_id: type === 'transfer' ? targetAccountId : undefined,
        type,
        amount,
        description: description || undefined,
      });
      setSuccess('Transaction created successfully.');
      reset();
      onCreated?.();
    } catch (e: any) {
      setError(e?.message || 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

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
        <h2 style={{ marginTop: 0, color: colors.text }}>New Transaction</h2>
        {error && <div style={{ color: colors.error, marginBottom: spacing(1) }}>{error}</div>}
        {success && <div style={{ color: '#065F46', marginBottom: spacing(1) }}>{success}</div>}
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing(2) }}>
            <div>
              <div style={labelStyle}>Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                style={inputStyle}
              >
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>Account</div>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.currency})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' && (
              <div>
                <div style={labelStyle}>Target Account</div>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select target</option>
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.currency})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <div style={labelStyle}>Amount</div>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Description (optional)</div>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing(2) }}>
            <button type="submit" style={buttonPrimary} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
