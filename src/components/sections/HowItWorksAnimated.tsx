import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We map your current workflows, identify the highest-leverage automation opportunities, and define clear success metrics in a 60-minute strategy call.',
    duration: 'Day 1',
    color: '#3B82F6',
  },
  {
    number: '02',
    title: 'Build',
    description: 'Our team designs and builds your AI systems. Voice agents, automations, or chatbots. Daily async updates so you\'re never in the dark.',
    duration: 'Days 2–4',
    color: '#6366F1',
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'We go live in a controlled rollout, monitor performance, and tune the system until it meets the success metrics we agreed on.',
    duration: 'Day 5–6',
    color: '#8B5CF6',
  },
  {
    number: '04',
    title: 'Optimize',
    description: 'Post-launch, we monitor your AI systems, push performance updates, and expand automation across your business as you grow.',
    duration: 'Ongoing',
    color: '#F59E0B',
  },
];

function StepCard({ step, i }: { step: typeof steps[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.4'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const borderOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      whileHover={{ x: 5, transition: { duration: 0.15 } }}
      className="group relative flex gap-5 rounded-xl border border-[#21262D] bg-[#0D1117] p-5 hover:bg-[#161B22] transition-colors duration-200"
    >
      {/* Animated left border on scroll */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl"
        style={{
          background: step.color,
          opacity: borderOpacity,
          scaleY: scrollYProgress,
          originY: 0,
        }}
      />

      {/* Left: number */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <motion.span
          className="font-mono text-xl font-bold"
          style={{ color: step.color, opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.8]) }}
        >
          {step.number}
        </motion.span>
        {i < steps.length - 1 && (
          <div className="w-px flex-1 mt-2" style={{ background: '#21262D', minHeight: 16 }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-heading text-base font-semibold text-[#F0F6FC]">{step.title}</h3>
          <span className="font-mono text-xs text-[#6E7681] border border-[#21262D] px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
            {step.duration}
          </span>
        </div>
        <p className="text-[#8B949E] text-sm leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.7', 'end 0.3'] });
  const progressHeight = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="section-label mb-4">How it works</div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#F0F6FC] mb-6 leading-tight">
              From first call to{' '}
              <span
                className="accent-serif bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
              >
                live in 1 week.
              </span>
            </h2>
            <p className="text-[#8B949E] text-lg leading-relaxed mb-10">
              We've refined our deployment process across 50+ projects. No endless discovery phases, no vague timelines. You get a working system in under a week.
            </p>
            <motion.a
              href="/contact"
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start your project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Steps with scroll-driven progress line */}
          <div ref={containerRef} className="relative">
            {/* Vertical progress track */}
            <div className="absolute left-[22px] top-6 bottom-6 w-px bg-[#21262D]" />
            <motion.div
              className="absolute left-[22px] top-6 w-px rounded-full"
              style={{
                height: progressHeight,
                background: 'linear-gradient(180deg, #3B82F6, #8B5CF6, #F59E0B)',
              }}
            />

            <div className="space-y-3">
              {steps.map((step, i) => (
                <StepCard key={step.number} step={step} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
