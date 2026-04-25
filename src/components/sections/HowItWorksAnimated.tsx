import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We map your current workflows, identify the highest-leverage automation opportunities, and define clear success metrics in a 60-minute strategy call.',
    duration: 'Day 1',
    color: '#6366F1',
  },
  {
    number: '02',
    title: 'Build',
    description: 'Our team designs and builds your AI systems — voice agents, automations, or chatbots — with daily async updates so you\'re never in the dark.',
    duration: 'Days 2–4',
    color: '#7C3AED',
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
    color: '#22D3EE',
  },
];

export default function HowItWorksAnimated() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="section-label mb-4">How it works</div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#F5F5F7] mb-6 leading-tight">
              From first call to{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                live in 1 week.
              </span>
            </h2>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-10">
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

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="group relative flex gap-5 rounded-xl border border-[#27272A] bg-[#111113] p-5 hover:border-[#6366F1]/30 hover:bg-[#18181B] transition-colors duration-200"
              >
                {/* Left: number + connector */}
                <div className="flex flex-col items-center gap-0 flex-shrink-0">
                  <span
                    className="font-mono text-xl font-bold transition-colors duration-200"
                    style={{ color: `${step.color}60` }}
                  >
                    {step.number}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: '#27272A', minHeight: 16 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-heading text-base font-semibold text-[#F5F5F7]">
                      {step.title}
                    </h3>
                    <span className="font-mono text-xs text-[#71717A] border border-[#27272A] px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
