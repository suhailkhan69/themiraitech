import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const WELCOME = "Hey there 👋 I'm Nova, Mirai's AI assistant. What kind of business do you run? I can help figure out which automation would make the biggest difference for you.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  // Show lead form after 3 user messages
  useEffect(() => {
    if (userMessageCount >= 3 && !showLeadForm && !leadSubmitted) {
      const t = setTimeout(() => setShowLeadForm(true), 600);
      return () => clearTimeout(t);
    }
  }, [userMessageCount, showLeadForm, leadSubmitted]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showLeadForm, loading]);

  // Clear unread badge when opened
  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-12) }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        if (!open) setHasUnread(true);
      } else {
        throw new Error('API error');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having a moment. Email us at hello@themiraitech.com and we'll get back to you!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead() {
    if (!leadName.trim() || !leadEmail.trim() || leadSubmitting) return;
    setLeadSubmitting(true);

    const businessMsg = messages.find(m => m.role === 'user');
    const challengeMsg = messages.filter(m => m.role === 'user')[1];

    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'chatbot',
        name: leadName.trim(),
        email: leadEmail.trim(),
        businessType: businessMsg?.content ?? '',
        challenge: challengeMsg?.content ?? '',
        conversation: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      }),
    }).catch(() => {});

    setLeadSubmitted(true);
    setShowLeadForm(false);
    setLeadSubmitting(false);
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Perfect, thanks ${leadName.trim().split(' ')[0]}! 🎉 Someone from the Mirai team will reach out to ${leadEmail.trim()} within 24 hours. Talk soon!`,
      },
    ]);
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-[88px] right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[560px] flex flex-col rounded-2xl border border-[#27272A] bg-[#09090B] shadow-2xl shadow-black/60 overflow-hidden"
            style={{ maxHeight: 'min(560px, calc(100dvh - 120px))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272A] bg-[#111113] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <div>
                  <p className="text-[#F5F5F7] text-sm font-semibold leading-none mb-1">Nova</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[#71717A] text-[11px]">Mirai AI · Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded-lg hover:bg-[#27272A] flex items-center justify-center text-[#71717A] hover:text-[#F5F5F7] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-[#18181B] text-[#E4E4E7] border border-[#27272A] rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#18181B] border border-[#27272A] px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#52525B]"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lead capture card */}
              <AnimatePresence>
                {showLeadForm && !leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-indigo-500/25 bg-[#111113] p-4 space-y-3"
                  >
                    <div>
                      <p className="text-[#F5F5F7] text-sm font-semibold mb-0.5">
                        Book your free strategy call
                      </p>
                      <p className="text-[#71717A] text-xs">
                        Share your details and we'll reach out within 24 hours.
                      </p>
                    </div>
                    <input
                      type="text"
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[#F5F5F7] text-sm placeholder-[#52525B] focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitLead()}
                      placeholder="Work email"
                      className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[#F5F5F7] text-sm placeholder-[#52525B] focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={submitLead}
                      disabled={!leadName.trim() || !leadEmail.trim() || leadSubmitting}
                      className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                      {leadSubmitting ? 'Sending…' : 'Get my free call →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#27272A] bg-[#111113] flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message…"
                  disabled={loading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-[#F5F5F7] text-sm placeholder-[#52525B] focus:outline-none focus:border-indigo-500/60 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="w-[42px] h-[42px] rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <p className="text-[#3F3F46] text-[10px] text-center mt-2 select-none">
                Powered by Mirai AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Nova, Mirai AI assistant'}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 flex items-center justify-center text-white transition-colors"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 300, damping: 22 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        <AnimatePresence>
          {hasUnread && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#09090B] text-[9px] text-white flex items-center justify-center font-bold leading-none"
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
