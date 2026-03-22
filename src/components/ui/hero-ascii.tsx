import { useNavigate, Link } from 'react-router-dom';

interface HeroAsciiProps {
  onDemo?: () => void;
}

// ── Blueprint background SVG (desktop) ────────────────────────────────────────
function BlueprintBg() {
  return (
    <svg
      viewBox="0 0 1440 900"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="ha-grid-sm" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F6E56" strokeWidth="0.4" strokeOpacity="0.09" />
        </pattern>
        <pattern id="ha-grid-lg" width="240" height="240" patternUnits="userSpaceOnUse">
          <path d="M 240 0 L 0 0 0 240" fill="none" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="1440" height="900" fill="url(#ha-grid-sm)" />
      <rect width="1440" height="900" fill="url(#ha-grid-lg)" />

      {/* Concentric circles — compass / radar feel */}
      {[70, 140, 220, 310, 415, 535, 670, 820, 990].map((r, i) => (
        <circle
          key={r}
          cx="1080"
          cy="450"
          r={r}
          fill="none"
          stroke="#0F6E56"
          strokeWidth="0.7"
          strokeOpacity={Math.max(0.03, 0.12 - i * 0.011)}
        />
      ))}

      {/* Crosshair at focal point */}
      <line x1="1080" y1="390" x2="1080" y2="510" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.2" />
      <line x1="1020" y1="450" x2="1140" y2="450" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.2" />
      <circle cx="1080" cy="450" r="4" fill="none" stroke="#0F6E56" strokeWidth="1" strokeOpacity="0.38" />
      <circle cx="1080" cy="450" r="1.5" fill="#0F6E56" fillOpacity="0.55" />

      {/* Tick marks */}
      {[-3, -2, -1, 1, 2, 3].map(n => (
        <g key={n}>
          <line x1={1080 + n * 35} y1="446" x2={1080 + n * 35} y2="454" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.22" />
          <line x1="1076" y1={450 + n * 35} x2="1084" y2={450 + n * 35} stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.22" />
        </g>
      ))}

      {/* Diagonal data line */}
      <line x1="200" y1="700" x2="900" y2="200" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 10" />

      {/* Annotation boxes */}
      <rect x="1120" y="310" width="52" height="16" fill="none" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.2" />
      <rect x="960" y="554" width="52" height="16" fill="none" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.14" />
    </svg>
  );
}

// ── Corner frame accent ───────────────────────────────────────────────────────
function CornerFrame({
  top, bottom, left, right, size = 12, opacity = 0.35,
}: {
  top?: string; bottom?: string; left?: string; right?: string;
  size?: number; opacity?: number;
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: `rgba(15,110,86,${opacity})`,
    borderStyle: 'solid',
    borderWidth: 0,
    ...(top    !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(left   !== undefined && { left }),
    ...(right  !== undefined && { right }),
    ...(top    !== undefined && left  !== undefined && { borderTopWidth: '2px', borderLeftWidth: '2px' }),
    ...(top    !== undefined && right !== undefined && { borderTopWidth: '2px', borderRightWidth: '2px' }),
    ...(bottom !== undefined && left  !== undefined && { borderBottomWidth: '2px', borderLeftWidth: '2px' }),
    ...(bottom !== undefined && right !== undefined && { borderBottomWidth: '2px', borderRightWidth: '2px' }),
  };
  return <div style={style} aria-hidden="true" />;
}

// ── Dot row separator ─────────────────────────────────────────────────────────
function DotRow({ active = 5, total = 40 }: { active?: number; total?: number }) {
  return (
    <div className="hidden lg:flex" style={{ gap: 4, marginBottom: 20, opacity: 0.5 }} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 2, height: 2, borderRadius: '50%',
            background: i < active ? '#0F6E56' : 'rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroAscii({ onDemo }: HeroAsciiProps) {
  const navigate = useNavigate();

  const handleDemo = () => {
    if (onDemo) { onDemo(); navigate('/dashboard'); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#080C0A', minHeight: '100vh' }}>

      {/* ── Fixed Nav ──────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(8,12,10,0.92)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(15,110,86,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 52,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Vazhi home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 10 }}>►</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F5F3EE', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            VAZHI{' '}
            <span style={{ color: '#0F6E56' }}>வழி</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a
            href="#how-it-works"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(245,243,238,0.45)', fontSize: 10,
              letterSpacing: '0.1em', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,243,238,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,238,0.45)')}
          >
            HOW IT WORKS
          </a>
          <button
            onClick={() => navigate('/intake')}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: '#0F6E56', fontSize: 10,
              letterSpacing: '0.1em', background: 'transparent',
              border: '1px solid rgba(15,110,86,0.4)',
              padding: '6px 14px', cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F6E56'; e.currentTarget.style.color = '#1a8a6e'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(15,110,86,0.4)'; e.currentTarget.style.color = '#0F6E56'; }}
            aria-label="Get started"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* ── Hero section ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', paddingTop: 52,
        }}
      >
        {/* Desktop blueprint bg */}
        <div className="hidden lg:block" style={{ position: 'absolute', inset: 0 }}>
          <BlueprintBg />
        </div>

        {/* Mobile star-dot bg */}
        <div className="stars-bg lg:hidden" style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />

        {/* Gradient mask (desktop: darkens left side so text is readable) */}
        <div
          className="hidden lg:block"
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, #080C0A 42%, rgba(8,12,10,0.72) 68%, rgba(8,12,10,0.15) 100%)',
          }}
        />

        {/* Corner frame accents */}
        <CornerFrame top="72px" left="16px" size={12} opacity={0.55} />
        <CornerFrame top="72px" right="16px" size={12} opacity={0.25} />
        <CornerFrame bottom="16px" left="16px" size={12} opacity={0.25} />
        <CornerFrame bottom="16px" right="16px" size={12} opacity={0.2} />

        {/* Hero content */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 1200,
            margin: '0 auto', padding: '72px 24px 72px 36px',
          }}
        >
          {/* "001 —— COLLEGE READINESS" label */}
          <div
            className="hero-line-1"
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
          >
            <div style={{ width: 8, height: 1, background: '#F5F3EE', opacity: 0.6 }} aria-hidden="true" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>
              001
            </span>
            <div style={{ width: 60, height: 1, background: '#0F6E56', opacity: 0.5 }} aria-hidden="true" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.55)', fontSize: 9, letterSpacing: '0.18em' }}>
              COLLEGE.READINESS
            </span>
          </div>

          {/* Headline */}
          <div style={{ position: 'relative' }}>
            <div className="hidden lg:block dither-pattern" aria-hidden="true" style={{ position: 'absolute', left: -12, top: 0, bottom: 0, width: 1, opacity: 0.45 }} />
            <h1
              className="hero-line-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: '#F5F3EE',
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '0.08em',
                margin: '0 0 4px 0',
              }}
            >
              YOUR PATH
            </h1>
            <div
              className="hero-line-3"
              aria-label="STARTS HERE"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: '#0F6E56',
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '0.08em',
                marginBottom: 28,
                display: 'flex', alignItems: 'baseline', gap: 6,
              }}
            >
              STARTS HERE
              <span className="cursor-blink" aria-hidden="true" style={{ color: '#BA7517' }}>_</span>
            </div>
          </div>

          {/* Dot row separator */}
          <div className="hero-line-4">
            <DotRow active={5} total={40} />
          </div>

          {/* Subtitle */}
          <p
            className="hero-line-5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(245,243,238,0.55)',
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              lineHeight: 1.8,
              maxWidth: 420,
              margin: '0 0 40px 0',
            }}
          >
            Foster youth in Arizona — discover your funding,
            <br />
            build your plan, find your way.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-line-6"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate('/intake')}
              aria-label="Get my college readiness plan"
            >
              GET MY PLAN →
            </button>
            <button
              className="btn-secondary"
              onClick={handleDemo}
              aria-label="Try the demo with sample data"
            >
              [ TRY DEMO ]
            </button>
          </div>

          {/* Privacy status line */}
          <div
            className="hero-line-6"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, color: 'rgba(15,110,86,0.5)',
              letterSpacing: '0.14em',
            }}
            aria-label="Privacy: no data stored, browser only"
          >
            <span
              className="status-dot"
              aria-hidden="true"
              style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0F6E56' }}
            />
            PRIVACY.ACTIVE
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.3)' }}>·</span>
            NO DATA STORED
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.3)' }}>·</span>
            BROWSER ONLY
          </div>
        </div>

        {/* Scroll hint */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 24,
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: 'hero-enter 0.6s ease 1.2s both',
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.35)', fontSize: 9, letterSpacing: '0.2em' }}>
            SCROLL
          </span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(15,110,86,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: '#0A0E0C',
          borderTop: '1px solid rgba(15,110,86,0.18)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700 }}>002</span>
            <div style={{ width: 40, height: 1, background: 'rgba(15,110,86,0.5)' }} aria-hidden="true" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.5)', fontSize: 10, letterSpacing: '0.16em' }}>PROCESS.MAP</span>
          </div>

          <h2
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: '#F5F3EE',
              fontSize: 'clamp(24px, 4vw, 38px)',
              fontWeight: 700, letterSpacing: '0.06em',
              margin: '0 0 48px 0',
            }}
          >
            HOW IT WORKS
          </h2>

          {/* Step cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 1,
              background: 'rgba(15,110,86,0.18)',
            }}
          >
            {[
              {
                num: '01', code: 'INTAKE.FORM',
                title: 'Tell Us Where You Are',
                desc: 'Answer 6 quick questions about your situation — age, education goal, documents in hand, and benefits you\'ve already applied for.',
              },
              {
                num: '02', code: 'FUNDING.MATCH',
                title: 'See Your Funding',
                desc: 'Get matched with the Pell Grant ($7,395), Arizona ETV ($5,000), and the Tuition Waiver — with confidence levels and exact next steps.',
              },
              {
                num: '03', code: 'PLAN.BUILD',
                title: 'Get Your Roadmap',
                desc: 'A sequenced action plan with exactly what to do, documents to get, deadlines to hit, and who to call — school by school.',
              },
            ].map(({ num, code, title, desc }) => (
              <div key={num} className="step-card" style={{ padding: '36px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.18)', fontSize: 52, fontWeight: 700, lineHeight: 1 }}>
                    {num}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.4)', fontSize: 9, letterSpacing: '0.16em', paddingTop: 8 }}>
                    {code}
                  </span>
                </div>
                <div style={{ width: 24, height: 1, background: '#0F6E56', opacity: 0.6, marginBottom: 14 }} aria-hidden="true" />
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F5F3EE', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px 0' }}>
                  {title}
                </h3>
                <p style={{ color: 'rgba(245,243,238,0.42)', fontSize: 13, lineHeight: 1.72, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <button
              className="btn-teal"
              onClick={() => navigate('/intake')}
              aria-label="Start my college readiness assessment"
            >
              START MY ASSESSMENT →
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.38)', fontSize: 10, letterSpacing: '0.14em' }}>
              FREE · 2 MINUTES · NO ACCOUNT REQUIRED
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer bar ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#080C0A',
          borderTop: '1px solid rgba(15,110,86,0.15)',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        }}
      >
        {/* Left: privacy indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="status-dot"
            aria-hidden="true"
            style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#0F6E56' }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.45)', fontSize: 9, letterSpacing: '0.12em' }}>
            PRIVACY.ACTIVE
            <span aria-hidden="true" style={{ margin: '0 6px', color: 'rgba(15,110,86,0.25)' }}>•</span>
            NO DATA STORED
            <span aria-hidden="true" style={{ margin: '0 6px', color: 'rgba(15,110,86,0.25)' }}>•</span>
            BROWSER ONLY
          </span>
        </div>

        {/* Right: project attribution */}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.3)', fontSize: 9, letterSpacing: '0.1em' }}>
          BUILT FOR FOSTER YOUTH IN ARIZONA
        </span>
      </footer>

    </div>
  );
}
