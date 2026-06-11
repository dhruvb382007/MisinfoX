import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Zap, RotateCcw, ClipboardPaste, History, X,
  ChevronDown, ChevronUp, SendIcon, LoaderIcon,
  Sparkles, FileText, AlertTriangle, CheckCircle,
  Command, Paperclip,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ClassificationCard from '../components/ClassificationCard';
import HighlightedText from '../components/HighlightedText';
import ExplanationPanel from '../components/ExplanationPanel';
import PropagationGraph from '../components/PropagationGraph';
import SourceVerification from '../components/SourceVerification';
import LoadingOverlay from '../components/LoadingOverlay';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(' '); }

const SAMPLES = [
  { label: 'Misleading', icon: <AlertTriangle size={12} />, color: 'text-red-400', text: "SHOCKING: Scientists DON'T WANT you to know this secret! They've been hiding the truth about vaccines and exposed their real agenda. Wake up, they are controlling everything. Urgent — share before they delete this!" },
  { label: 'Reliable', icon: <CheckCircle size={12} />, color: 'text-emerald-400', text: 'According to a peer-reviewed study published in The Lancet, researchers found a 43% reduction in hospitalization rates among vaccinated adults aged 60+. The study analyzed data from 12,000 participants over 18 months. Dr. Sarah Chen stated the findings have been independently verified by three international teams.' },
  { label: 'Uncertain', icon: <Sparkles size={12} />, color: 'text-amber-400', text: 'Sources suggest that the government may be considering new economic policies that could impact household spending. Analysts say prices might rise over the next quarter, though some economists dispute these projections. The official statement is expected next week.' },
];

const COMMANDS = [
  { icon: <AlertTriangle size={14} />, label: 'Check claim', prefix: '/claim', desc: 'Verify a specific claim' },
  { icon: <FileText size={14} />, label: 'Full article', prefix: '/article', desc: 'Analyze a full news article' },
  { icon: <Sparkles size={14} />, label: 'Social post', prefix: '/social', desc: 'Analyze a social media post' },
  { icon: <CheckCircle size={14} />, label: 'Quote check', prefix: '/quote', desc: 'Verify an attributed quote' },
];

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-white/80 rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Verdict badge ────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }) {
  const cfg = {
    Reliable:   { cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
    Misleading: { cls: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
    Uncertain:  { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  };
  const c = cfg[verdict] ?? cfg.Uncertain;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.dot}`} />
      {verdict}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AnalyzerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('tl-session-history') || '[]'); } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [activeCmd, setActiveCmd] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const textareaRef = useRef(null);
  const commandRef = useRef(null);
  const charLimit = 5000;

  // Mouse tracker for ambient glow
  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Close command palette on outside click
  useEffect(() => {
    const handler = (e) => {
      if (commandRef.current && !commandRef.current.contains(e.target)) {
        setShowCommands(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-show command palette when "/" typed
  useEffect(() => {
    if (text.startsWith('/') && !text.includes(' ')) {
      setShowCommands(true);
      const idx = COMMANDS.findIndex(c => c.prefix.startsWith(text));
      setActiveCmd(idx >= 0 ? idx : -1);
    } else {
      setShowCommands(false);
    }
  }, [text]);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '100px';
    ta.style.height = Math.min(ta.scrollHeight, 280) + 'px';
  }, []);

  const analyze = useCallback(async () => {
    if (!text.trim() || status === 'loading') return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.has_api_key) {
      alert('You must configure a Gemini API Key in Settings to run analysis.');
      navigate('/settings');
      return;
    }

    setStatus('loading');
    setResult(null);
    try {
      const data = await api.analyze(text);
      setResult(data);
      setStatus('done');
      const entry = { id: Date.now(), text: text.slice(0, 120) + (text.length > 120 ? '…' : ''), verdict: data.verdict, confidence: data.confidence, ts: new Date().toISOString() };
      const next = [entry, ...history].slice(0, 20);
      setHistory(next);
      sessionStorage.setItem('tl-session-history', JSON.stringify(next));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Analysis failed');
      setStatus('idle');
    }
  }, [text, status, history, user, navigate]);

  const reset = () => { setStatus('idle'); setResult(null); setText(''); };

  const pasteClip = async () => {
    try { const c = await navigator.clipboard.readText(); setText(c); adjustHeight(); } catch {}
  };

  const selectCommand = (idx) => {
    const cmd = COMMANDS[idx];
    setText(cmd.prefix + ' ');
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showCommands) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveCmd(p => p < COMMANDS.length - 1 ? p + 1 : 0); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveCmd(p => p > 0 ? p - 1 : COMMANDS.length - 1); }
      else if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); if (activeCmd >= 0) selectCommand(activeCmd); }
      else if (e.key === 'Escape') { e.preventDefault(); setShowCommands(false); }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyze();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden pt-28">

      {/* ── Background Gradients ── */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50 pointer-events-none">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-indigo-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-indigo-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-indigo-500"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] left-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-30 pointer-events-none">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-fuchsia-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-fuchsia-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-fuchsia-500"></div>
      </div>

      {/* ── Mouse glow ── */}
      {inputFocused && (
        <motion.div
          className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.025]
            bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{ x: mousePos.x - 320, y: mousePos.y - 320 }}
          transition={{ type: 'spring', damping: 25, stiffness: 150, mass: 0.5 }}
        />
      )}

      <main className="flex-1 flex flex-col px-4 text-center z-10 w-full relative pb-32">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          
          {/* ── Hero Headline ── */}
          <div className="flex-1 flex justify-center mb-6">
            <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2 w-fit">
              <span className="text-xs flex items-center gap-2 font-medium tracking-wide">
                <span className="bg-black p-1 rounded-full text-[10px]">✨</span>
                Introducing MisInfoX ML v2.0
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight font-instrument tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Analyze the truth effortlessly
          </h1>

          <p className="text-md text-white/50 pb-8 font-cabin max-w-2xl mx-auto">
            MisInfoX can detect misinformation and stylistic deception with a single prompt.
          </p>

          {/* ── Search Bar Input ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-3xl mx-auto w-full z-20"
          >
            {/* Command palette */}
            <AnimatePresence>
              {showCommands && (
                <motion.div
                  ref={commandRef}
                  className="absolute left-4 right-4 bottom-full mb-3 backdrop-blur-xl bg-black/95
                    rounded-xl z-50 shadow-2xl border border-white/10 overflow-hidden text-left"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="py-1.5">
                    {COMMANDS.map((cmd, idx) => (
                      <motion.div
                        key={cmd.prefix}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 text-xs cursor-pointer transition-colors',
                          activeCmd === idx ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                        )}
                        onClick={() => selectCommand(idx)}
                      >
                        <span className="text-white/40">{cmd.icon}</span>
                        <span className="font-medium font-cabin">{cmd.label}</span>
                        <span className="text-white/25 font-mono bg-white/5 px-1.5 py-0.5 rounded">{cmd.prefix}</span>
                        <span className="ml-auto text-white/30 font-cabin">{cmd.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-[#1c1528] rounded-3xl p-3 flex flex-col shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] focus-within:shadow-[0_0_50px_-5px_rgba(99,102,241,0.3)] transition-all ring-1 ring-white/5 focus-within:ring-indigo-500/30">
              <div className="flex">
                <button onClick={pasteClip} className="p-3 self-center rounded-full hover:bg-[#2a1f3d] transition-all text-gray-400 mb-1">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  id="analyzer-input"
                  value={text}
                  onChange={(e) => { setText(e.target.value.slice(0, charLimit)); adjustHeight(); }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Paste a news article, tweet, or claim to fact-check..."
                  className="bg-transparent flex-1 outline-none text-gray-300 pl-4 py-4 resize-none min-h-[56px] max-h-[300px] text-sm leading-relaxed font-cabin"
                  style={{ overflow: 'hidden' }}
                />
                <button 
                  onClick={analyze} 
                  disabled={!text.trim() || status === 'loading'}
                  className={cn(
                    "p-3 rounded-full transition-all self-center mb-1 mr-1",
                    text.trim() && status !== 'loading' ? "bg-white text-black hover:bg-gray-200" : "bg-[#2a1f3d] text-gray-500 cursor-not-allowed"
                  )}
                >
                  {status === 'loading' ? <LoaderIcon className="w-5 h-5 animate-spin text-indigo-500" /> : <Sparkles className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="sm:px-5 px-2 pb-2 flex items-center justify-between text-xs text-white/30 font-cabin sm:ml-8 sm:mr-12 ml-2 mr-2">
                <div className="flex items-center gap-4">
                  <button onClick={reset} className="hover:text-white/80 transition-colors flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setShowCommands(p => !p); }} className="hover:text-white/80 transition-colors flex items-center gap-1">
                    <Command className="w-3.5 h-3.5" />
                    Commands
                  </button>
                </div>
                <span className={charLimit - text.length < 200 ? 'text-amber-400' : ''}>
                  {(charLimit - text.length).toLocaleString()} left
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Suggestion pills ── */}
          {!result && status !== 'loading' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl mx-auto"
            >
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setText(s.text); adjustHeight(); }}
                  className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm text-gray-300 transition-all flex items-center gap-2 ring-1 ring-white/5"
                >
                  <span className={s.color}>{s.icon}</span>
                  {s.label} example
                </button>
              ))}
            </motion.div>
          )}

        </div>

        {/* ── Results Container ── */}
        <div className="w-full max-w-3xl mx-auto mt-12 text-left relative z-10">

        {/* ── Loading ── */}
        <AnimatePresence>
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <LoadingOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {status === 'done' && result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Result banner */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3 px-4 sm:px-5 rounded-xl
                backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]">
                <VerdictBadge verdict={result.verdict} />
                <span className="text-sm text-white/60 font-cabin flex-1 min-w-[180px]">
                  {result.confidence}% confidence — analysis complete
                </span>
                <motion.button
                  onClick={reset}
                  whileTap={{ scale: 0.9 }}
                  className="ml-auto text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
                >
                  <X size={15} />
                </motion.button>
              </div>

              <ClassificationCard verdict={result.verdict} confidence={result.confidence} />
              <HighlightedText highlights={result.highlights} fullText={text} />
              <ExplanationPanel explanations={result.explanations} verdict={result.verdict} />
              <PropagationGraph propagation={result.propagation} />
              <SourceVerification sources={result.sources} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── History ── */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm font-cabin font-medium text-white/35
                hover:text-white/70 transition-colors mb-3"
            >
              <History size={14} />
              Analysis History ({history.length})
              {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {history.slice(0, 8).map((h, i) => (
                    <motion.button
                      key={h.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setText(h.text.endsWith('…') ? h.text.slice(0, -1) : h.text)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left
                        bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04]
                        hover:border-white/[0.08] transition-all backdrop-blur-sm"
                    >
                      <VerdictBadge verdict={h.verdict} />
                      <span className="text-xs text-white/45 truncate font-cabin flex-1">{h.text}</span>
                      <span className="text-xs text-white/20 flex-shrink-0 font-cabin">
                        {new Date(h.ts).toLocaleDateString()}
                      </span>
                    </motion.button>
                  ))}
                  <button
                    onClick={() => { setHistory([]); localStorage.removeItem('tl-history'); }}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors mt-1 font-cabin"
                  >
                    Clear history
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      </main>

      {/* ── "Analyzing" floating indicator ── */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-2xl
              bg-white/[0.03] rounded-full px-5 py-2.5 shadow-xl border border-white/[0.06] z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Zap size={12} className="text-indigo-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 font-cabin">
                <span>MisInfoX is analyzing</span>
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
