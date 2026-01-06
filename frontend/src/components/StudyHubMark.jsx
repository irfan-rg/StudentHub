import React from 'react';

/**
 * Custom brand mark for StudyHub.
 * Designed to match the current UI aesthetic:
 * - Minimal geometry
 * - Rounded terminals (lucide-like)
 * - Works in monochrome and on gradient badges
 */
export function StudyHubMark({ className = '', title = 'StudyHub' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Pillars */}
      <path
        d="M6 5v14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M18 5v14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Bridge band (two parallel strokes) */}
      <path
        d="M6 12.7c3.1-3.2 8.9-3.2 12 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14.1c3.1-3.2 8.9-3.2 12 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hub node */}
      <circle cx="12" cy="9" r="1.35" fill="currentColor" />
    </svg>
  );
}
