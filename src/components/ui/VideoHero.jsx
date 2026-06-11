import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientButton from './GradientButton.jsx';

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

/**
 * Adapted glass-video-hero for MisInfoX.
 * Removed sign-in / sign-up. Pure brand hero only.
 */
export const VideoHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden min-h-screen">

      {/* ── Video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* ── Dark overlay for readability ── */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* ── Bottom gradient blend ── */}
      <div className="absolute bottom-0 inset-x-0 h-48 z-[2] bg-gradient-to-t from-black to-transparent" />

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-col items-center text-center mt-36 px-6">

        {/* Tagline pill */}
        <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px]
          backdrop-blur-xl border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)]
          shadow-[0_0_20px_rgba(123,57,252,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]
          mb-8">
          <span className="bg-indigo-600 text-white font-cabin font-medium text-xs
            px-2.5 py-1 rounded-[6px] shadow-[0_0_8px_rgba(123,57,252,0.4)] flex items-center gap-1">
            <Zap size={10} />
            NEW
          </span>
          <span className="font-cabin font-medium text-sm text-white/90 tracking-wide">
            AI-powered misinformation detection is here
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-instrument text-white text-5xl lg:text-[88px] leading-[1.05]
            tracking-[-0.02em] max-w-5xl"
        >
          Detect misinformation
          <br className="hidden lg:block" />
          before it&nbsp;
          <em className="italic text-indigo-300">spreads</em>
        </h1>

        {/* Subtext */}
        <p className="font-sans font-normal text-lg text-white/55 mt-6 max-w-[620px] leading-relaxed">
          MisInfoX uses advanced NLP to analyze any article, tweet, or social-media post —
          classifying claims, verifying sources, and mapping how misinformation propagates.
        </p>

        {/* CTA buttons — gradient pill style */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <GradientButton
            onClick={() => navigate('/analyzer')}
            gradientFrom="#6366f1"
            gradientTo="#8b5cf6"
            variant="solid"
            icon={ArrowRight}
            id="hero-cta"
          >
            Start Analyzing
          </GradientButton>
          <GradientButton
            onClick={() => navigate('/about')}
            gradientFrom="#a955ff"
            gradientTo="#ea51ff"
            variant="ghost"
          >
            How it works
          </GradientButton>
        </div>
      </div>
    </section>
  );
};
