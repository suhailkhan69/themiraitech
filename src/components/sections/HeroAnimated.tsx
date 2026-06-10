import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParticleField from '@/components/effects/ParticleField';
import TiltCard from '@/components/effects/TiltCard';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const stats = [
  { value: '50+', label: 'businesses automated' },
  { value: '4.9/5', label: 'avg satisfaction' },
  { value: '5 days', label: 'avg deployment' },
];

// Simulated live activity feed for the 3D panel
const FEED = [
  { icon: '📞', text: 'Inbound call answered', detail: 'Lead qualified · meeting booked', color: '#F59E0B' },
  { icon: '⚡', text: 'Workflow triggered', detail: 'Invoice → CRM → Slack in 1.2s', color: '#8B5CF6' },
  { icon: '💬', text: 'Support ticket deflected', detail: 'RAG chatbot · order status', color: '#3B82F6' },
  { icon: '🎯', text: 'New lead captured', detail: 'Qualified · synced to pipeline', color: '#34D399' },
  { icon: '📅', text: 'Cancellation slot filled', detail: 'Waitlist contacted · rebooked', color: '#F59E0B' },
];

function LiveFeed() {
  const [head, setHead] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHead(prev => (prev + 1) % FEED.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const items = [0, 1, 2].map(offset => (head - offset + FEED.length * 2) % FEED.length);

  return (
    <div className="space-y-2.5">
      {items.map((idx, pos) => {
        const item = FEED[idx];
        return (
          <motion.div
            key={`${idx}`}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1 - pos * 0.28, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-3 rounded-lg border border-[#21262D] bg-[#0D0D0F] px-3.5 py-2.5"
          >
            <span className="text-base leading-none">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-[#F0F6FC] text-[13px] font-medium leading-tight truncate">{item.text}</p>
              <p className="text-[#6E7681] text-[11px] leading-tight truncate">{item.detail}</p>
            </div>
            <span
              className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HeroAnimated() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Interactive 3D particle network */}
      <ParticleField />

      {/* Ambient glow */}
      <div
        className="absolute -top-32 left-1/3 w-[640px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[420px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-10 items-center">

          {/* Left: copy */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-7">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA] text-xs font-medium tracking-wider uppercase">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#3B82F6]" />
                </span>
                AI Automation Agency
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-[2.75rem] sm:text-6xl lg:text-[4.5rem] font-bold text-[#F0F6FC] leading-[1.02] tracking-tight mb-7"
            >
              Your business,
              <br />
              running{' '}
              <span className="relative inline-block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(120deg, #3B82F6 0%, #8B5CF6 45%, #F59E0B 100%)' }}
                >
                  on autopilot.
                </span>
                <motion.span
                  className="absolute -bottom-1.5 left-0 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3B82F6, #F59E0B)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#8B949E] text-lg sm:text-xl max-w-xl mb-9 leading-relaxed"
            >
              AI voice agents that answer every call. Workflows that run themselves.
              Chatbots that close support tickets while you sleep. Built and deployed
              in days – not months.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
              <motion.a
                href="/contact"
                className="btn-primary text-base px-8 py-4 relative overflow-hidden group"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
                See the results
              </motion.a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[#6E7681] text-sm">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="font-mono text-[#F0F6FC] font-semibold text-base">{s.value}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: interactive 3D live-system panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block"
          >
            <TiltCard maxTilt={9} className="rounded-2xl">
              <div className="rounded-2xl border border-[#21262D] bg-[#0D1117]/90 backdrop-blur-sm p-5 shadow-2xl shadow-black/50">
                {/* Window chrome */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#21262D]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                    </span>
                    <span className="text-[#6E7681] text-[11px] font-mono">SYSTEM LIVE</span>
                  </div>
                </div>

                {/* Live feed */}
                <p className="text-[#6E7681] text-[10px] font-mono uppercase tracking-widest mb-3">
                  Real-time activity
                </p>
                <LiveFeed />

                {/* Bottom metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#21262D]">
                  {[
                    { v: '100%', l: 'calls answered' },
                    { v: '<2min', l: 'lead response' },
                    { v: '24/7', l: 'uptime' },
                  ].map((m, i) => (
                    <div key={i} className="text-center rounded-lg bg-[#0D0D0F] border border-[#21262D] py-2.5">
                      <p className="font-mono text-[#F0F6FC] text-sm font-bold">{m.v}</p>
                      <p className="text-[#6E7681] text-[10px] mt-0.5">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border border-[#3F3F46] flex items-start justify-center pt-2"
        >
          <span className="w-1 h-2 rounded-full bg-[#3B82F6]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
