import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Shield, Zap, BarChart3, Globe,
  CheckCircle2, Sparkles, Search, ChevronRight,
} from 'lucide-react';
import { VideoHero } from '../components/ui/VideoHero.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    desc: 'Instant AI-powered detection with confidence scores for any text or social media post.',
    gradient: 'from-indigo-500 to-violet-500',
    accent: 'inset-0 bg-indigo-500/5',
  },
  {
    icon: Shield,
    title: 'Source Verification',
    desc: 'Cross-reference claims against trusted fact-checking databases in real time.',
    gradient: 'from-emerald-500 to-teal-500',
    accent: 'inset-0 bg-emerald-500/5',
  },
  {
    icon: BarChart3,
    title: 'Propagation Mapping',
    desc: 'Visualize how misinformation spreads across platforms with live network graphs.',
    gradient: 'from-rose-500 to-pink-500',
    accent: 'inset-0 bg-rose-500/5',
  },
  {
    icon: Globe,
    title: 'Source Tracking',
    desc: 'Identify origin and credibility of content backed by publisher reputation scores.',
    gradient: 'from-amber-500 to-orange-500',
    accent: 'inset-0 bg-amber-500/5',
  },
];

const STATS = [
  { value: '94%', label: 'Detection accuracy' },
  { value: '2.8s', label: 'Average analysis time' },
  { value: '12K+', label: 'Articles analyzed' },
  { value: '50+', label: 'Source databases' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Paste your content', desc: 'Drop in any news article, tweet, or claim — no formatting required.' },
  { n: '02', title: 'AI analysis runs', desc: 'Our NLP engine scans for emotional language, missing citations, and logical fallacies.' },
  { n: '03', title: 'Get your report', desc: 'Receive a detailed verdict with confidence score, highlighted text, and source links.' },
];

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, gradient, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative rounded-2xl border border-white/8 bg-white/3
        backdrop-blur-sm hover:border-indigo-500/30 hover:bg-white/5
        transition-all duration-300 overflow-hidden p-7"
      style={{ minHeight: 200 }}
    >
      {/* gradient line top edge on hover */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="text-base font-semibold font-cabin text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-white/45">{desc}</p>

      <div className="flex items-center gap-1 mt-5 text-xs font-cabin font-medium text-indigo-400/0 group-hover:text-indigo-400 transition-colors duration-200">
        Learn more <ChevronRight size={12} />
      </div>
    </motion.div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="bg-black overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO — glass video background                               
      ══════════════════════════════════════════════════════════════ */}
      <VideoHero />

      {/* ══════════════════════════════════════════════════════════════
          STATS BAR                                                   
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10
          grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400
                bg-clip-text text-transparent font-instrument">
                {value}
              </p>
              <p className="text-sm mt-1 text-white/40 font-cabin">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES                                                    
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-cabin font-semibold uppercase tracking-widest text-indigo-400 mb-3"
            >
              What MisInfoX does
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-instrument text-4xl sm:text-5xl text-white mb-4 leading-[1.1]"
            >
              Everything you need to{' '}
              <em className="italic text-indigo-300">fight misinformation</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/40 max-w-xl mx-auto font-cabin"
            >
              Hover each card for details. Every feature feeds into one unified analysis report.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS — glasscard steps                             
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-instrument text-4xl sm:text-5xl text-white"
            >
              How it works
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative p-7 rounded-[14px] overflow-hidden
                  border border-white/8 bg-white/3 backdrop-blur-sm
                  hover:border-indigo-500/25 transition-colors group"
              >
                {/* Big number watermark */}
                <span className="text-[72px] font-instrument font-bold text-white/4
                  absolute top-2 right-4 leading-none select-none">
                  {n}
                </span>

                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600
                  flex items-center justify-center mb-5">
                  <Search size={15} className="text-white" />
                </div>
                <h3 className="text-base font-semibold font-cabin text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-cabin">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER — glass card style                              
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden
              border border-[rgba(164,132,215,0.3)]
              bg-[rgba(85,80,110,0.18)] backdrop-blur-2xl
              shadow-[0_0_80px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]
              text-center px-8 py-20"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />

            <div className="relative z-10">
              <Sparkles className="text-indigo-400/60 mx-auto mb-5" size={32} />
              <h2 className="font-instrument text-4xl sm:text-5xl text-white mb-4 leading-[1.1]">
                Ready to find the <em className="italic text-indigo-300">truth?</em>
              </h2>
              <p className="font-cabin text-white/45 text-base mb-9 max-w-md mx-auto">
                Paste any article, tweet, or claim and get a comprehensive analysis in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GradientButton
                  onClick={() => navigate('/analyzer')}
                  gradientFrom="#6366f1"
                  gradientTo="#8b5cf6"
                  variant="solid"
                  icon={ArrowRight}
                >
                  Start Analyzing
                </GradientButton>
                <GradientButton
                  onClick={() => navigate('/about')}
                  gradientFrom="#a955ff"
                  gradientTo="#ea51ff"
                  variant="ghost"
                >
                  Learn more
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
