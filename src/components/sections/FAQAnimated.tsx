import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How much does it cost?',
    answer: 'Projects typically start at $3,000 for a single automation or AI chatbot, and $8,000–$20,000 for a full AI voice agent system with workflow integrations. We offer both one-time build fees and monthly retainers for ongoing optimization. Every engagement starts with a free strategy call where we scope the project and give you a fixed-price quote.',
  },
  {
    question: 'How long does it take to deploy?',
    answer: 'Most projects go live in 3–5 days. Simple automations can be ready in 24–48 hours. Complex multi-system integrations (voice agent + CRM + email workflows) take up to 1 week. We give you a realistic timeline upfront and hit it – we don\'t do "it\'ll be ready when it\'s ready."',
  },
  {
    question: 'Is my business data secure?',
    answer: 'Yes. We follow strict data handling practices: all data is encrypted in transit and at rest, we use SOC 2-compliant infrastructure, we never train AI models on your proprietary data without explicit permission, and we sign NDAs before any project begins. For regulated industries (legal, medical), we build specifically for compliance requirements.',
  },
  {
    question: 'Will this integrate with my existing tools?',
    answer: 'Almost certainly. We\'ve built integrations with 80+ tools: Salesforce, HubSpot, Clio, Dentrix, Shopify, GoHighLevel, Zapier, Slack, Google Workspace, Microsoft 365, and dozens more. If you use a tool with an API, we can connect to it. We handle all integration work – you don\'t need a technical team.',
  },
  {
    question: 'What support do I get after launch?',
    answer: 'All projects include 30 days of post-launch support at no extra cost – we monitor performance, fix any issues, and tune the system. After that, you can choose a monthly optimization retainer ($500–$2,000/month depending on system complexity) or a pay-as-you-go support package. We don\'t disappear after delivery.',
  },
  {
    question: 'How do I know if AI automation is right for my business?',
    answer: 'Good candidates for AI automation have: repetitive high-volume tasks (answering the same 20 questions daily, manual data entry, appointment scheduling), a clear bottleneck that costs you time or money, and a desire to scale without proportionally scaling headcount. Book a strategy call – we\'ll be honest if automation won\'t move the needle for you.',
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-xl border border-[#21262D] bg-[#0D1117] overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#161B22] transition-colors duration-150"
        aria-expanded={open}
      >
        <span className="font-heading text-sm font-semibold text-[#F0F6FC] pr-4">{question}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-shrink-0 w-5 h-5 text-[#6E7681]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-5">
              <p className="text-[#8B949E] text-sm leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAnimated() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-label mb-4">FAQ</div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#F0F6FC] mb-4">
            Common questions
          </h2>
          <p className="text-[#8B949E] text-lg">
            Everything you need to know before booking a call.
          </p>
        </motion.div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
