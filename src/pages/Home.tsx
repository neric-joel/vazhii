import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

interface HomeProps {
  onDemo?: () => void;
}

export default function Home({ onDemo }: HomeProps) {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect on hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      hero.style.backgroundPositionY = `${y * 0.4}px`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="font-sans bg-[#FAFAF7] min-h-screen">

      {/* ── Floating Nav Pill ──────────────────────────────────── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full
                      flex items-center gap-6
                      bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
                      transition-all duration-300">
        <Link to="/" className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Vazhi <span className="text-[#5ecfb1]">வழி</span>
        </Link>
        <div className="flex items-center gap-4 ml-4">
          <a href="#how-it-works" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            How It Works
          </a>
          <button
            onClick={() => navigate('/intake')}
            className="bg-[#BA7517] hover:bg-[#9a6012] text-white text-sm font-semibold
                       px-4 py-1.5 rounded-full transition-colors shadow-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #0d1f0d, #0F6E56)' }}
      >
        {/* Atmospheric noise overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px'
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)' }}
        />

        {/* Subtle winding path SVG */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg viewBox="0 0 800 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M 400 900 C 400 900 250 700 350 550 C 450 400 200 300 350 150 C 450 50 500 0 500 0"
              stroke="white" strokeWidth="3" fill="none" strokeDasharray="8 12" />
            <path d="M 400 900 C 400 900 350 700 450 550 C 550 400 300 300 450 150"
              stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="4 8" opacity="0.5" />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-[#5ecfb1] text-2xl mb-3 tracking-widest font-light animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}>
            வழி
          </p>
          <h1
            className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif", animationDelay: '0.25s', opacity: 0 }}
          >
            Your Path to College<br />
            <span className="text-[#5ecfb1]">Starts Here</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}>
            Foster youth in Arizona — discover your funding,<br className="hidden md:block" />
            build your plan, find your way.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.55s', opacity: 0 }}>
            <button
              onClick={() => navigate('/intake')}
              className="bg-[#BA7517] hover:bg-[#9a6012] active:bg-[#7d4e0f]
                         text-white text-lg font-semibold px-10 py-4 rounded-full
                         shadow-xl hover:shadow-2xl hover:-translate-y-0.5
                         transition-all duration-200 min-h-[52px] w-full sm:w-auto"
            >
              Get My Plan →
            </button>
            <button
              onClick={() => { if (onDemo) { onDemo(); navigate('/dashboard'); } }}
              className="bg-white/10 hover:bg-white/20 border border-white/30
                         text-white/90 text-base font-medium px-8 py-4 rounded-full
                         backdrop-blur-sm hover:-translate-y-0.5
                         transition-all duration-200 min-h-[52px] w-full sm:w-auto"
            >
              Try Demo
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-white/40 text-xs mt-5 animate-fade-in-up"
            style={{ animationDelay: '0.7s', opacity: 0 }}>
            Your data stays in your browser. Nothing is stored or shared.
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: '1s', opacity: 0 }}>
          <p className="text-white/40 text-xs tracking-widest uppercase">Scroll to explore</p>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#FAFAF7] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#0F6E56] text-sm font-semibold tracking-widest uppercase mb-3">The Process</p>
            <h2 className="text-[#1C1C1A] text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Tell Us Where You Are',
                desc: 'Answer 5 quick questions about your situation — your age, education, and what documents you have.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              {
                num: '02',
                title: 'See Your Funding',
                desc: 'Get matched with the Pell Grant, Arizona ETV, and the Tuition Waiver — with confidence levels and exact amounts.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                num: '03',
                title: 'Get Your Roadmap',
                desc: 'A sequenced action plan with exactly what to do next — documents to get, deadlines to hit, and who to call.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              }
            ].map(({ num, title, desc, icon }) => (
              <div key={num}
                className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2DED6]
                           hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl font-bold text-[#E2DED6] leading-none group-hover:text-[#0F6E56]/20 transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {num}
                  </span>
                  <div className="text-[#0F6E56] mt-1">{icon}</div>
                </div>
                <h3 className="text-[#1C1C1A] text-xl font-semibold mb-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {title}
                </h3>
                <p className="text-[#6B6A65] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/intake')}
              className="bg-[#0F6E56] hover:bg-[#0a4f3e] text-white text-base font-semibold
                         px-10 py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5
                         transition-all duration-200 min-h-[52px]"
            >
              Start My Assessment →
            </button>
            <p className="text-[#6B6A65] text-xs mt-4">
              Free · 2 minutes · No account required
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-[#1C1C1A] text-white/50 py-8 px-6 text-center text-xs">
        <p className="mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Vazhi <span className="text-[#5ecfb1]">வழி</span>
        </p>
        <p>Your data stays in your browser. Nothing is stored or shared.</p>
        <p className="mt-2">Built for foster youth in Arizona.</p>
      </footer>

    </div>
  );
}
