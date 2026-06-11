import { useTheme } from '../context/ThemeContext';
import { Code2, Share2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { isDark } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t mt-24 ${isDark ? 'border-white/5 bg-[#0a0a0f]' : 'border-slate-200 bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <span className={`text-lg font-bold font-[Space_Grotesk,sans-serif] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                MisInfo<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">X</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              AI-powered misinformation detection helping you navigate the information landscape with clarity and confidence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Analyzer', to: '/analyzer' },
                { label: 'About', to: '/about' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Resources
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Code2, label: 'GitHub' },
                { icon: Share2, label: 'Twitter' },
                { icon: ExternalLink, label: 'Docs' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-white/5 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'
                      : 'bg-black/5 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'
                  }`}
                  aria-label={label}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          <span>© {year} MisInfoX. For educational and demonstration purposes.</span>
          <span>Built with React + Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
