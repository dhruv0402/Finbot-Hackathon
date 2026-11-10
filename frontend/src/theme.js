/**
 * Institutional Terminal & High-Frequency Quant Design System
 * Inspired by Goldman Sachs Marquee, Bloomberg Terminal & Linear Dark Aesthetic.
 * Features:
 * - Ultra-crisp slate backgrounds (#07090e -> #0d121c -> #131a29)
 * - Micro-borders with subtle glow states (#1e293b, #334155, rgba(14, 165, 233, 0.3))
 * - Mathematical Monospace Data & Precision Typography (IBM Plex Mono + IBM Plex Sans)
 * - Quantitative status indicators (Alpha, Beta, Sharpe, Var95)
 */
export const theme = {
  colors: {
    background: '#07090e',
    backgroundSubtle: '#0a0e17',
    surface: '#0d131f',
    surfaceElevated: '#121a2a',
    surfaceHeader: '#162033',
    
    primary: '#38bdf8',       // Electric Cyan
    primaryHover: '#0ea5e9',
    primaryGlow: 'rgba(56, 189, 248, 0.15)',
    
    accent: '#10b981',        // Emerald Green (P&L Gains)
    accentGlow: 'rgba(16, 185, 129, 0.15)',
    
    warning: '#f59e0b',       // Amber Alert
    warningGlow: 'rgba(245, 158, 11, 0.15)',
    
    danger: '#f43f5e',        // Crimson Risk
    dangerGlow: 'rgba(244, 63, 94, 0.15)',
    
    text: '#e2e8f0',
    textHeadline: '#ffffff',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    
    border: '#1a2333',
    borderLight: '#26354d',
    borderActive: '#38bdf8',
    
    userBubble: '#0c1626',
    botBubble: '#0f172a',
    activeTab: '#38bdf8',
  },
  fonts: {
    primary: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
  },
  radii: {
    sharp: '0px',
    subtle: '2px',
    card: '4px',
    pill: '9999px'
  },
  shadows: {
    none: 'none',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.37), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
    glow: '0 0 15px rgba(56, 189, 248, 0.12)',
    terminal: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  }
};
