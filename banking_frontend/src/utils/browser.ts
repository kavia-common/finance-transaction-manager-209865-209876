/**
 * Utilities for safely accessing browser globals in environments where they may not exist.
 * Avoid direct DOM type annotations to prevent ESLint no-undef errors in non-DOM contexts.
 */

// PUBLIC_INTERFACE
export function getWindow(): any | null {
  /** Returns window if available, otherwise null. */
  try {
    return typeof window !== 'undefined' ? (window as any) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getLocalStorage(): any | null {
  /** Returns localStorage if available, otherwise null. */
  const w = getWindow();
  if (!w) return null;
  try {
    return w.localStorage as any;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function safeFetch(): any | null {
  /** Returns fetch if available, otherwise null. */
  try {
    return typeof fetch !== 'undefined' ? (fetch as any) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getURLSearchParams(): any | null {
  /** Returns URLSearchParams constructor if available, otherwise null. */
  try {
    return typeof URLSearchParams !== 'undefined' ? (URLSearchParams as any) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function safeConsole(): any | null {
  /** Returns console if available, otherwise null. */
  try {
    return typeof console !== 'undefined' ? (console as any) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function safeSetTimeout(): any | null {
  /** Returns setTimeout if available, otherwise null. */
  try {
    return typeof setTimeout !== 'undefined' ? (setTimeout as any) : null;
  } catch {
    return null;
  }
}
