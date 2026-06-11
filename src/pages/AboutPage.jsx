import { useTheme } from '../context/ThemeContext';
import { Scan, Code2, Heart, Shield, Zap, Globe, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEAM = [
  { initials: 'MX', name: 'MisInfoX Core', role: 'AI Research & NLP', color: 'from-indigo-500 to-violet-500' },
  { initials: 'FC', name: 'FactCheck Engine', role: 'Source Verification', color: 'from-emerald-500 to-teal-500' },
  { initials: 'DV', name: 'DataViz Team', role: 'Propagation Analytics', color: 'from-rose-500 to-pink-500' },
];

const HOW_IT_WORKS = [
  { icon: '📝', step: '1', title: 'Input Content', desc: 'Paste any news article, tweet, or online claim into the analyzer.' },
  { icon: '🧠', step: '2', title: 'AI Analysis', desc: 'Our NLP model scans the text for emotional language, logical fallacies, and structural patterns.' },
  { icon: '🔍', step: '3', title: 'Source Cross-Reference', desc: 'Claims are checked against trusted fact-checking databases and news archives.' },
  { icon: '📊', step: '4', title: 'Report Generation', desc: 'A detailed, human-readable report is generated with confidence scores and highlighted evidence.' },
];

export default function AboutPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <main className="pt-24 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-20 fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <Scan size={28} className="text-white" />
            </div>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold font-[Space_Grotesk,sans-serif] mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            About <span className="gradient-text">MisInfoX</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            MisInfoX is an open-source, AI-powered platform built to help people navigate the digital information landscape safely. We believe truth should be accessible to everyone.
          </p>
        </div>

        {/* Mission */}
        <div className={`glass rounded-3xl p-8 sm:p-12 mb-10 glow-brand fade-in-up`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold font-[Space_Grotesk,sans-serif] mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Misinformation erodes trust in institutions, fuels polarization, and has real-world consequences. MisInfoX was built to be a first line of defense — a tool anyone can use to quickly assess the credibility of content before sharing it. We do not take political sides; our goal is purely to help surface verifiable facts.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-14 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className={`text-2xl font-bold font-[Space_Grotesk,sans-serif] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }, i) => (
              <div
                key={title}
                className={`glass rounded-2xl p-6 flex gap-4 hover:-translate-y-0.5 transition-transform duration-200 fade-in-up`}
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    {icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400">Step {step}</span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="mb-14 fade-in-up" style={{ animationDelay: '0.45s' }}>
          <h2 className={`text-2xl font-bold font-[Space_Grotesk,sans-serif] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, label: 'React + Vite', sub: 'Frontend framework', color: 'from-cyan-500 to-blue-500' },
              { icon: Shield, label: 'NLP Engine', sub: 'Transformer models', color: 'from-indigo-500 to-violet-500' },
              { icon: Globe, label: 'Fact-Check APIs', sub: 'Live source database', color: 'from-emerald-500 to-teal-500' },
              { icon: BookOpen, label: 'MediaBias DB', sub: 'Publisher ratings', color: 'from-amber-500 to-orange-500' },
              { icon: Code2, label: 'Open Source', sub: 'MIT licensed', color: 'from-slate-500 to-slate-600' },
              { icon: Heart, label: 'Privacy-First', sub: 'No data stored', color: 'from-rose-500 to-pink-500' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className={`glass rounded-xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`rounded-2xl p-6 border fade-in-up ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`} style={{ animationDelay: '0.55s' }}>
          <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>⚠️ Important Disclaimer</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
            MisInfoX is a demonstration project using simulated AI analysis. The mock data used during analysis is for educational and portfolio purposes only. Do not rely on this tool for real-world fact-checking decisions without consulting authoritative sources. For production use, integrate with a validated NLP API and live fact-checking services.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-14 fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => navigate('/analyzer')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 active:scale-95"
          >
            Try the Analyzer →
          </button>
        </div>
      </div>
    </main>
  );
}
