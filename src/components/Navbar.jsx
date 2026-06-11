import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Analyzer', to: '/analyzer' },
    { label: 'About', to: '/about' },
  ];

  const isActive = (to) => location.pathname === to;

  const navBg = isDark
    ? scrolled
      ? 'bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
      : 'bg-transparent'
    : scrolled
    ? 'bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-lg'
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-baseline gap-0.5">
              <span
                className={`text-xl font-bold tracking-tight font-[Space_Grotesk,sans-serif] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                MisInfo
              </span>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-[Space_Grotesk,sans-serif]">
                X
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </Link>
            ))}
            
            {user && (
              <>
                <div className="w-px h-4 bg-white/10 mx-2" />
                <Link
                  to="/dashboard"
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link
                  to="/settings"
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    isActive('/settings') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings size={14} /> Settings
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center justify-center w-9 h-9 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                  Sign in
                </Link>
                <Link to="/register" className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            <Link
              to="/analyzer"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 active:scale-95 ml-2"
            >
              <Zap size={14} />
              Analyze
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-black/5'
              }`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        } ${isDark ? 'bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-white/5' : 'bg-white/95 backdrop-blur-xl border-t border-black/5'}`}
      >
        <div className="px-4 pt-2 pb-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : isDark
                  ? 'text-slate-300 hover:bg-white/5'
                  : 'text-slate-700 hover:bg-black/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <>
              <div className="h-px bg-white/5 my-2" />
              <Link to="/dashboard" className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/settings" className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2">
                <Settings size={16} /> Settings
              </Link>
              <button onClick={handleLogout} className="px-4 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 flex items-center gap-2 text-left">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-white/5 my-2" />
              <Link to="/login" className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5">
                Sign in
              </Link>
              <Link to="/register" className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5">
                Sign up
              </Link>
            </>
          )}
          
          <Link
            to="/analyzer"
            className="mt-4 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-center"
          >
            Start Analyzing →
          </Link>
        </div>
      </div>
    </nav>
  );
}
