import React, { useEffect, useState } from 'react';
import { colors, gradients, radii, shadows, spacing } from '../styles/theme';
import { login, me, setAuthToken, getBaseUrl } from '../api/client';
import { User } from '../types';

interface Props {
  onAuthChange?: (user: User | null) => void;
}

const inputStyle: React.CSSProperties = {
  padding: spacing(1),
  borderRadius: radii.sm,
  border: `1px solid ${colors.border}`,
  outline: 'none',
  background: colors.surface,
  color: colors.text,
};

const buttonStyle: React.CSSProperties = {
  padding: `${spacing(1)} ${spacing(2)}`,
  borderRadius: radii.sm,
  border: 'none',
  background: colors.primary,
  color: 'white',
  cursor: 'pointer',
  boxShadow: shadows.sm,
};

export const Header: React.FC<Props> = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);
    const u = await me();
    setUser(u);
    onAuthChange?.(u);
    setLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => {
    fetchMe();
  }, []);

  const onLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      await fetchMe();
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    setAuthToken(null);
    setUser(null);
    onAuthChange?.(null);
  };

  return (
    <header
      style={{
        background: gradients.ocean,
        backdropFilter: 'saturate(180%) blur(6px)',
        borderBottom: `1px solid ${colors.border}`,
        padding: spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing(1) }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: colors.primary,
            boxShadow: shadows.sm,
          }}
        />
        <div>
          <div style={{ fontWeight: 700, color: colors.text }}>Ocean Bank</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            API: {getBaseUrl() || '(not configured)'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing(1) }}>
        {user ? (
          <>
            <span style={{ color: colors.text }}>
              Signed in as <strong>{user.email}</strong>
            </span>
            <button style={buttonStyle} onClick={onLogout} disabled={loading}>
              Logout
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={onLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </>
        )}
      </div>
      {error && (
        <div style={{ position: 'absolute', right: spacing(2), top: '66px', color: colors.error }}>
          {error}
        </div>
      )}
    </header>
  );
};
