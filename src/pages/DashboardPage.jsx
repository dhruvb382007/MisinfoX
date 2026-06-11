import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Target, Activity, AlertTriangle, ShieldCheck, 
  Search, Filter, Plus, KeyRound
} from 'lucide-react';

import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import CredibilityDonut from '../components/dashboard/CredibilityDonut';
import AnalysisCard from '../components/dashboard/AnalysisCard';
import QuickActions from '../components/dashboard/QuickActions';
import AIInsights from '../components/dashboard/AIInsights';
import MisinfoCategories from '../components/dashboard/MisinfoCategories';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import GradientButton from '../components/ui/GradientButton';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function processActivityData(history) {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();
    const count = history.filter(h => new Date(h.ts).toDateString() === dateStr).length;
    data.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), count });
  }
  return data;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.get('/user/history');
        setHistory(data.sort((a, b) => new Date(b.ts) - new Date(a.ts)));
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Derived Stats
  const stats = useMemo(() => {
    const total = history.length;
    const reliable = history.filter(h => h.verdict === 'Reliable').length;
    const misleading = history.filter(h => h.verdict === 'Misleading').length;
    
    const accRate = total ? Math.round((reliable / total) * 100) : 0;
    const avgConf = total ? Math.round(history.reduce((s, h) => s + (h.confidence || 0), 0) / total) : 0;
    
    // Simple trends (comparing last 7 days vs previous 7 days)
    const now = Date.now();
    const week = 7 * 86400000;
    const thisWeek = history.filter(h => now - new Date(h.ts).getTime() <= week).length;
    const lastWeek = history.filter(h => {
      const t = now - new Date(h.ts).getTime();
      return t > week && t <= week * 2;
    }).length;
    
    let activityTrend = 0;
    if (lastWeek > 0) activityTrend = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    else if (thisWeek > 0) activityTrend = 100;

    return { total, accRate, misleading, avgConf, activityTrend };
  }, [history]);

  const activityData = useMemo(() => processActivityData(history), [history]);
  
  const donutData = useMemo(() => {
    const counts = { Reliable: 0, Misleading: 0, Uncertain: 0 };
    history.forEach(h => counts[h.verdict]++);
    return [
      { name: 'Reliable', value: counts.Reliable },
      { name: 'Misleading', value: counts.Misleading },
      { name: 'Uncertain', value: counts.Uncertain }
    ].filter(d => d.value > 0);
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      if (filter !== 'All' && item.verdict !== filter) return false;
      if (search && !item.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [history, search, filter]);

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleExport = () => {
    if (!history.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Verdict,Confidence,Claim\n"
      + history.map(h => `"${new Date(h.ts).toISOString()}","${h.verdict}","${h.confidence}","${h.text.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "misinfox_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 min-h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 min-h-screen pb-32">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-white/50 font-cabin mb-1"
          >
            {currentDate}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          >
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate('/analyzer')}
            className="h-11 px-6 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Plus size={18} />
            <span>New Analysis</span>
          </motion.button>
        </div>
      </div>

      {/* Warning Banner if No API Key */}
      {!user?.has_api_key && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0">
              <KeyRound className="text-rose-400" size={18} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Gemini API Key Required</h3>
              <p className="text-sm text-white/70 font-cabin">You need to set up your Gemini API key to run fact-checks. It's free and takes 1 minute.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm font-semibold transition-colors flex-shrink-0"
          >
            Add API Key
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        <StatsCard 
          icon={Activity} 
          title="Total Analyses" 
          value={stats.total} 
          trend={stats.activityTrend}
          trendLabel="vs last week"
          gradient="from-indigo-500 to-violet-500"
          sparkData={activityData.map(d => d.count)}
          delay={0.1}
        />
        <StatsCard 
          icon={Target} 
          title="Accuracy Rate" 
          value={stats.accRate} 
          suffix="%"
          gradient="from-emerald-400 to-teal-500"
          delay={0.2}
        />
        <StatsCard 
          icon={AlertTriangle} 
          title="Misleading Detected" 
          value={stats.misleading} 
          gradient="from-rose-500 to-red-600"
          delay={0.3}
        />
        <StatsCard 
          icon={ShieldCheck} 
          title="Avg Confidence" 
          value={stats.avgConf} 
          suffix="%"
          gradient="from-blue-500 to-cyan-500"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr,340px] xl:grid-cols-[1fr,380px] gap-5 md:gap-6">
        
        {/* Left Column: History */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl flex flex-col h-full overflow-hidden min-h-[600px]">
            
            {/* History Header & Controls */}
            <div className="p-5 border-b border-white/[0.07] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                <h2 className="text-base font-semibold text-white">Recent Analyses</h2>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-48 group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search claims..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
                  />
                </div>
                <div className="relative group">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-9 pl-8 pr-8 appearance-none rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all cursor-pointer"
                  >
                    <option className="bg-[#1a1127] text-white" value="All">All Verdicts</option>
                    <option className="bg-[#1a1127] text-white" value="Reliable">Reliable</option>
                    <option className="bg-[#1a1127] text-white" value="Misleading">Misleading</option>
                    <option className="bg-[#1a1127] text-white" value="Uncertain">Uncertain</option>
                  </select>
                  <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="p-5 flex-1 bg-black/20" id="analysis-history">
              {filteredHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                    <Search size={24} className="text-white/20" />
                  </div>
                  <h3 className="text-white font-medium mb-1">No analyses found</h3>
                  <p className="text-sm text-white/40 font-cabin max-w-xs">
                    {search || filter !== 'All' 
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "You haven't run any fact-checks yet. Start by analyzing a new claim."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {filteredHistory.map((item, index) => (
                      <AnalysisCard 
                        key={item.id} 
                        item={item} 
                        index={Math.min(index, 10)} 
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Charts */}
        <div className="space-y-5">
          <QuickActions onExport={handleExport} />
          <CredibilityDonut data={donutData} />
          <ActivityChart data={activityData} />
          <AIInsights history={history} />
          <MisinfoCategories history={history} />
          <ActivityHeatmap history={history} />
        </div>
        
      </div>
    </div>
  );
}
