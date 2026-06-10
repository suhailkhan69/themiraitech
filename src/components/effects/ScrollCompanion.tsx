import React, { useEffect, useRef, useState } from 'react';

/**
 * Site-wide scroll companion. Two parts:
 * 1. A thin gradient progress bar fixed to the top of the viewport.
 * 2. A glowing orb that travels down a vertical track on the right edge,
 *    with the scroll percentage beside it.
 * Mounted once in BaseLayout so it appears consistently on every page.
 * Respects prefers-reduced-motion (progress still shown, no glow pulse).
 */
export default function ScrollCompanion() {
  const barRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    let target = 0;

    const measure = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setVisible(max > 200);
    };

    const tick = () => {
      // Smooth lag so the orb trails the scroll slightly
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0005) current = target;

      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
      if (orbRef.current) {
        const trackH = window.innerHeight * 0.5;
        orbRef.current.style.transform = `translateY(${current * trackH}px)`;
      }
      if (pctRef.current) pctRef.current.textContent = `${Math.round(current * 100)}`;

      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    // Re-measure after Astro view transitions swap the page
    document.addEventListener('astro:page-load', measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      document.removeEventListener('astro:page-load', measure);
    };
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] pointer-events-none">
        <div
          ref={barRef}
          className="h-full w-full origin-left"
          style={{
            transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6 55%, #F59E0B)',
            boxShadow: '0 0 12px rgba(59,130,246,0.5)',
          }}
        />
      </div>

      {/* Right-edge orb track */}
      <div
        className={`fixed right-4 top-1/4 z-[60] hidden lg:flex flex-col items-center pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <div className="relative" style={{ height: '50vh' }}>
          {/* Track line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#21262D]" />

          {/* Travelling orb */}
          <div ref={orbRef} className="absolute left-1/2 -translate-x-1/2 top-0 will-change-transform">
            <div className="relative flex items-center">
              <span
                className="block w-2.5 h-2.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  boxShadow: '0 0 10px rgba(59,130,246,0.8), 0 0 24px rgba(139,92,246,0.4)',
                }}
              />
              <span
                ref={pctRef}
                className="absolute right-4 font-mono text-[10px] text-[#6E7681] tabular-nums"
              >
                0
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
