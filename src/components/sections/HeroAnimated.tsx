import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const stats = [
  { value: '50+', label: 'businesses automated' },
  { value: '4.9/5', label: 'avg satisfaction' },
  { value: '5 days', label: 'avg deployment' },
];

export default function HeroAnimated() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4], x: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(to right, #6366F1 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 text-center w-full"
        style={{ y, opacity }}
      >
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#6366F1] text-xs font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
              AI Automation Agency
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-5xl sm:text-6xl lg:text-[5rem] font-bold text-[#F5F5F7] leading-[1.04] tracking-tight mb-6"
          >
            AI systems that
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)' }}
            >
              actually ship.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-[#A1A1AA] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We build AI voice agents, workflow automation, and custom AI systems
            for Western SMBs — deployed in days, not months.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="/contact"
              className="btn-primary text-base px-8 py-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Book a free strategy call
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
            <motion.a
              href="/case-studies"
              className="btn-secondary text-base px-8 py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              See case studies
            </motion.a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 text-[#71717A] text-sm"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="hidden sm:block w-px h-4 bg-[#27272A]" />}
                <span className="font-mono text-[#F5F5F7] font-semibold">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
