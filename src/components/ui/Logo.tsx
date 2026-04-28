import React from 'react';

interface Props {
  height?: number;
  className?: string;
  // showWordmark kept for API compat but ignored — logo already includes wordmark
  showWordmark?: boolean;
}

export default function Logo({ height = 32, className = '' }: Props) {
  return (
    <img
      src="/logo.svg"
      alt="mirAi Tech"
      height={height}
      style={{ height, width: 'auto', display: 'inline-block' }}
      className={className}
    />
  );
}
