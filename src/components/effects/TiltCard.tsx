import React, { useRef, useCallback } from 'react';

/**
 * Mouse-tracked 3D tilt wrapper with dynamic glare highlight.
 * Pure CSS transforms driven by pointer position – no dependencies.
 */

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;       // degrees
  glare?: boolean;
  scale?: number;
  href?: string;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  glare = true,
  scale = 1.015,
  href,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * maxTilt;
      const ry = (px - 0.5) * maxTilt;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale}, ${scale}, ${scale})`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.08) 0%, transparent 55%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  }, [maxTilt, scale]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, []);

  const sharedProps = {
    ref: ref as any,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    className: `relative will-change-transform transition-transform duration-200 ease-out ${className}`,
    style: { transformStyle: 'preserve-3d' as const },
  };

  const inner = (
    <>
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 opacity-0"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} {...sharedProps} style={{ ...sharedProps.style, textDecoration: 'none' }}>
        {inner}
      </a>
    );
  }

  return <div {...sharedProps}>{inner}</div>;
}
