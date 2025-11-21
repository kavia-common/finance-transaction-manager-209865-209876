export const colors = {
  primary: '#2563EB', // Blue 600
  secondary: '#F59E0B', // Amber 500
  success: '#10B981', // Green 500 (adjust from style)
  error: '#EF4444', // Red 500
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF', // White
  text: '#111827', // Gray 900
  textMuted: '#6B7280', // Gray 500
  border: '#E5E7EB', // Gray 200
  subtle: '#F3F4F6', // Gray 100
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 15px rgba(0,0,0,0.08)',
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
};

export const gradients = {
  ocean: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(243,244,246,1))',
};

export const spacing = (n: number) => `${n * 8}px`;
