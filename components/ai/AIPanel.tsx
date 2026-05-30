'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuestContext, AIMessage } from './aiEngine';

interface AIPanelProps {
  open: boolean;
  questContext: QuestContext | null;
  onClose: () => void;
}

// 语音识别类型声明
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function AIPanel({ open, questContext, onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 打开面板时发送欢迎消息
  useEffect(() => {
    if (open && questContext) {
      setMessages([
        {
          role: 'assistant',
          content: `你好！我是你的旅行学习助手 🤖\n\n当前正在学习「**${questContext.questTitle}**」——${questContext.questDescription}\n\n有什么想深入了解的吗？可以直接提问，我会基于学习内容为你解答。`,
          suggestions: questContext.knowledge.length > 0
            ? [questContext.knowledge[0].slice(0, 30) + '...', questContext.knowledge[Math.min(1, questContext.knowledge.length - 1)]?.slice(0, 30) + '...']
            : undefined,
        },
      ]);
    }
  }, [open, questContext]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 清理语音识别
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // ── 发送消息 ──
  async function sendMessage(text?: string) {
    const content = (text || input).trim();
    if (!content || loading || !questContext) return;

    const userMsg: AIMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          questContext,
          history: messages,
        }),
      });

      const data = await res.json();
      const aiMsg: AIMessage = {
        role: 'assistant',
        content: data.content || '抱歉，我暂时无法回答这个问题。',
        suggestions: data.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '网络出现问题，请稍后再试。' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ── 语音输入 ──
  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('你的浏览器不支持语音输入，请使用Chrome浏览器。');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  // ── 点击建议问题 ──
  function handleSuggestion(text: string) {
    sendMessage(text);
  }

  if (!questContext) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 面板 */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:max-h-[650px]"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-[85vh] md:h-[600px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 md:rounded-2xl shadow-2xl overflow-hidden">
              {/* ── Header ── */}
              <div className="shrink-0 px-4 py-3 border-b border-slate-700/40 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">🤖</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">AI 学习助手</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {questContext.questTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-7 h-7 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>

              {/* ── 消息列表 ── */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'bg-slate-800 text-slate-200 rounded-bl-md'
                      }`}
                    >
                      {msg.content}

                      {/* 建议问题 */}
                      {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1">
                          <p className="text-[10px] text-slate-500 mb-1">💬 继续探讨：</p>
                          {msg.suggestions.map((s, j) => (
                            <button
                              key={j}
                              onClick={() => handleSuggestion(s)}
                              className="block w-full text-left text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg px-2 py-1 transition-colors"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 加载动画 */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-indigo-400"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── 输入区域 ── */}
              <div className="shrink-0 px-4 py-3 border-t border-slate-700/40 bg-slate-800/30">
                <div className="flex items-end gap-2">
                  {/* 文本输入 */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="输入你的问题..."
                      rows={1}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>

                  {/* 语音按钮 */}
                  <button
                    onClick={toggleVoice}
                    disabled={loading}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      listening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white'
                    }`}
                    title="语音输入"
                  >
                    🎤
                  </button>

                  {/* 发送按钮 */}
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="shrink-0 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center text-lg transition-colors"
                  >
                    ↑
                  </button>
                </div>
                {/* 超出范围提示 */}
                <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                  AI 仅解答与当前学习任务相关的问题 • 按 Enter 发送 • Shift+Enter 换行
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
