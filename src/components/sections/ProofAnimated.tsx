import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, v => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) raw.set(to);
  }, [inView, raw, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const miniCases = [
  { industry: 'Legal', headline: 'Acme Law reduced intake time from 45 min to 8 min', stat: '82% faster intake' },
  { industry: 'Dental', headline: 'ClearSmile filled 94% of cancellation slots automatically', stat: '+$180k revenue' },
  { industry: 'E-commerce', headline: "ShopEdge's AI agent resolves 80% of support tickets", stat: '4 FTEs reallocated' },
];

const dashboardRows = [
  { label: 'Calls handled today', value: '47', change: '+12%' },
  { label: 'Appointments booked', value: '18', change: '+34%' },
  { label: 'Avg call duration', value: '3m 42s', change: '' },
  { label: 'Qualification rate', value: '84%', change: '+8%' },
];

const bars = [40, 55, 45, 70, 85, 75, 95];

export default function ProofAnimated() {
  return (
    <section className="py-28 bg-[#111113] border-y border-[#27272A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Proof it works</div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#F5F5F7] mb-4">
            Real results. Real businesses.
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
            We don't sell demos. We build systems that move the needle on metrics that matter.
          </p>
        </motion.div>

        {/* Featured case study */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl border border-[#27272A] bg-[#0A0A0B] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#6366F1] mb-6">
                  Real Estate
                </span>
                <h3 className="font-heading text-3xl font-bold text-[#F5F5F7] mb-4 leading-snug">
                  How Vertex Realty filled their calendar without hiring a single SDR
                </h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-8">
                  Vertex Realty was spending $8k/month on appointment setters. We replaced that entire function with an AI voice agent + automation stack that qualifies leads, books showings, and sends follow-up nurture — all without human intervention.
                </p>

                {/* Animated metrics */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  {[
                    { value: 342, suffix: '%', label: 'More qualified leads/month', color: '#6366F1' },
                    { value: 96, suffix: 'k', label: 'Annual cost savings', color: '#22D3EE', prefix: '$' },
                    { value: 1, suffix: ' wk', label: 'Time to full deployment', color: '#8B5CF6' },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="font-mono text-3xl font-bold" style={{ color: m.color }}>
                        {m.prefix ?? ''}
                        <CountUp to={m.value} suffix={m.suffix} />
                      </div>
                      <div className="text-[#71717A] text-xs mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>

                <blockquote className="border-l-2 border-[#6366F1]/50 pl-4 mb-8">
                  <p className="text-[#A1A1AA] text-sm italic leading-relaxed">
                    "Within 30 days of launch, our AI agent was outperforming our best human setter. It never takes a sick day, never has an off week, and has perfect recall of every property we list."
                  </p>
                  <cite className="text-[#71717A] text-xs mt-2 block not-italic">
                    — Marcus T., Principal Broker, Vertex Realty
                  </cite>
                </blockquote>
              </div>

              <motion.a
                href="/case-studies/vertex-realty"
                className="btn-primary self-start"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Read full case study
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </div>

            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#111113] p-10 lg:p-12 flex items-center justify-center border-l border-[#27272A]"
            >
              <div className="w-full max-w-sm space-y-4">
                {/* Dashboard card */}
                <div className="rounded-xl border border-[#27272A] bg-[#0A0A0B] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#71717A] text-xs">Voice Agent Performance</span>
                    <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dashboardRows.map((row, i) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.07 }}
                        className="flex items-center justify-between py-2 border-b border-[#27272A] last:border-0"
                      >
                        <span className="text-[#71717A] text-xs">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#F5F5F7] text-sm">{row.value}</span>
                          {row.change && (
                            <span className="text-emerald-400 text-xs font-mono">{row.change}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bar chart */}
                <div className="rounded-xl border border-[#27272A] bg-[#0A0A0B] p-5">
                  <div className="text-[#71717A] text-xs mb-3">Weekly lead volume</div>
                  <div className="flex items-end gap-1 h-12">
                    {bars.map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{ background: 'rgba(99,102,241,0.3)' }}
                        initial={{ scaleY: 0, originY: 1 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                        whileHover={{ background: 'rgba(99,102,241,0.6)' }}
                        animate={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[#71717A] text-xs">Mon</span>
                    <span className="text-[#71717A] text-xs">Sun</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mini case study grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {miniCases.map((cs, i) => (
            <motion.div
              key={cs.industry}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="rounded-xl border border-[#27272A] bg-[#111113] p-6 hover:border-[#6366F1]/30 transition-colors duration-200"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#27272A] text-[#71717A] mb-4">
                {cs.industry}
              </span>
              <p className="text-[#F5F5F7] text-sm font-medium mb-4 leading-snug">{cs.headline}</p>
              <span className="font-mono text-[#22D3EE] text-sm font-semibold">{cs.stat}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <a href="/case-studies" className="btn-secondary">
            Browse all case studies
          </a>
        </motion.div>
      </div>
    </section>
  );
}
