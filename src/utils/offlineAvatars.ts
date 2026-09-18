import type { SyntheticEvent } from 'react';

/**
 * Offline Avatar Generators
 * Generates self-contained, inline SVG Data URIs for avatars.
 * Works 100% offline without requiring internet connection, CDNs, or external servers.
 */

const PALETTES = [
  { bg1: '#7c3aed', bg2: '#a855f7', text: '#ffffff' }, // Purple
  { bg1: '#be185d', bg2: '#f43f5e', text: '#ffffff' }, // Rose / Pink
  { bg1: '#0f766e', bg2: '#14b8a6', text: '#ffffff' }, // Teal
  { bg1: '#b45309', bg2: '#f59e0b', text: '#ffffff' }, // Amber / Gold
  { bg1: '#1e40af', bg2: '#3b82f6', text: '#ffffff' }, // Blue
  { bg1: '#475569', bg2: '#64748b', text: '#ffffff' }, // Slate
  { bg1: '#4338ca', bg2: '#6366f1', text: '#ffffff' }, // Indigo
  { bg1: '#047857', bg2: '#10b981', text: '#ffffff' }, // Emerald
];

/**
 * Returns initials from a full name (e.g., "Sarah Jenkins" -> "SJ")
 */
export function getInitials(name: string): string {
  if (!name) return 'HOH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a self-contained SVG Data URI for an offline avatar
 */
export function getOfflineAvatar(name: string, seed: string = ''): string {
  const initials = getInitials(name);
  
  // Deterministic color selection based on string hash
  const str = `${name}-${seed}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const paletteIndex = Math.abs(hash) % PALETTES.length;
  const { bg1, bg2, text } = PALETTES[paletteIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="30" fill="url(#g)" />
    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="3" />
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" fill="${text}" dominant-baseline="central" text-anchor="middle" letter-spacing="1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Image error fallback helper
 */
export function handleAvatarError(e: SyntheticEvent<HTMLImageElement, Event>, fallbackName: string) {
  const target = e.currentTarget;
  const fallbackUri = getOfflineAvatar(fallbackName);
  if (target.src !== fallbackUri) {
    target.onerror = null; // Prevent infinite loop
    target.src = fallbackUri;
  }
}
