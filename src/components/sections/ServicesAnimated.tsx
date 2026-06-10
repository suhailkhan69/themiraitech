import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/effects/TiltCard';

const services = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: 'AI Voice Agents',
    description: 'Never miss a call again. Our AI voice agents handle inbound inquiries, qualify leads, book appointments, and answer FAQs – 24/7, at scale.',
    stat: '3× more calls handled',
    href: '/services#voice-agents',
    color: '#3B82F6',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Workflow Automation',
    description: 'Connect your CRM, email, calendar, and backend tools into a single automated machine. Built with n8n, Make, and custom APIs.',
    stat: '15hrs/week saved on average',
    href: '/services#workflow-automation',
    color: '#8B5CF6',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: 'Custom AI Chatbots & RAG',
    description: 'AI assistants trained on your documents, products, and policies. Deploy on your website, WhatsApp, or internal tools.',
    stat: '80% support ticket deflection',
    href: '/services#chatbots',
    color: '#F59E0B',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'AI Lead Generation',
    description: 'Automated outreach, qualification, and nurturing systems that fill your pipeline while you focus on closing.',
    stat: '342% more qualified leads',
    href: '/services#lead-generation',
    color: '#3B82F6',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

export default function ServicesAnimated() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">What we build</div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#F0F6FC] mb-4 leading-tight">
            AI that does the work.
            <br />You do the strategy.
          </h2>
          <p className="text-[#8B949E] text-lg max-w-2xl mx-auto">
            Four core systems that remove bottlenecks, cut costs, and compound over time.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
            <TiltCard
              href={svc.href}
              maxTilt={6}
              className="group relative rounded-xl border border-[#21262D] bg-[#0D1117] p-8 overflow-hidden block h-full"
            >
              {/* Animated border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 1px ${svc.color}40` }}
              />

              {/* Top-right glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${svc.color}15 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
              />

              {/* Icon */}
              <motion.div
                className="w-10 h-10 rounded-lg border border-[#21262D] flex items-center justify-center mb-6 transition-colors duration-300"
                style={{ color: svc.color }}
                whileHover={{ scale: 1.05 }}
              >
                {svc.icon}
              </motion.div>

              <h3 className="font-heading text-lg font-semibold text-[#F0F6FC] mb-2">{svc.title}</h3>
              <p className="text-[#8B949E] text-sm leading-relaxed mb-6">{svc.description}</p>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold" style={{ color: '#F59E0B' }}>
                  {svc.stat}
                </span>
                <svg
                  className="w-4 h-4 text-[#6E7681] group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all duration-200"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a href="/services" className="btn-secondary">
            View all services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
