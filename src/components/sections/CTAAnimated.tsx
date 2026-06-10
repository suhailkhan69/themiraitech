import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  headline?: string;
  subhead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTAAnimated({
  headline = 'Ready to automate the boring parts?',
  subhead = 'Book a free 30-minute strategy call. We\'ll map out the highest-leverage AI opportunity for your business. No pitch, no pressure.',
  primaryLabel = 'Book a free strategy call',
  primaryHref = '/contact',
  secondaryLabel = 'See case studies',
  secondaryHref = '/case-studies',
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spot.style.left = `${x}px`;
      spot.style.top = `${y}px`;
    };

    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative rounded-2xl border border-[#21262D] bg-[#0D1117] overflow-hidden cursor-default"
        >
          {/* Cursor spotlight */}
          <div
            ref={spotRef}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)',
              transition: 'left 0.12s ease-out, top 0.12s ease-out',
            }}
          />

          {/* Pulsing ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.14), transparent)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 right-0 w-96 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative px-8 py-20 sm:px-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-heading text-4xl sm:text-5xl font-bold text-[#F0F6FC] mb-6 max-w-3xl mx-auto leading-tight"
            >
              {headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#8B949E] text-lg max-w-2xl mx-auto mb-10"
            >
              {subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href={primaryHref}
                className="btn-primary text-base px-8 py-4 relative overflow-hidden group"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {primaryLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href={secondaryHref}
                className="btn-secondary text-base px-8 py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {secondaryLabel}
              </motion.a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-[#6E7681] text-sm mt-6"
            >
              Response within 24 hours. No commitment required.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
