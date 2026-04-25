import React, { useId } from 'react';

interface Props {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 28, showWordmark = true, className = '' }: Props) {
  const uid = useId().replace(/:/g, '');
  const gradId = `lg-${uid}`;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="28" height="28" rx="7" fill={`url(#${gradId})`} />
        <path
          d="M6 21 L6 8 L14 15 L22 8 L22 21"
          stroke="white"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span
          className="font-semibold text-[#F5F5F7] tracking-tight font-heading"
          style={{ fontSize: Math.round(size * 0.64) }}
        >
          mirai
        </span>
      )}
    </span>
  );
}
