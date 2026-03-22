import { useNavigate, Link } from 'react-router-dom';
import { BackgroundPaths } from './background-paths';

interface HeroAsciiProps {
  onDemo?: () => void;
}

const MONO = "'IBM Plex Mono', monospace";
const DISPLAY = "'Space Grotesk', sans-serif";
const SANS = "'Inter', system-ui, sans-serif";

export default function HeroAscii({ onDemo }: HeroAsciiProps) {
  const navigate = useNavigate();

  const handleDemo = () => {
    if (onDemo) { onDemo(); navigate('/dashboard'); }
  };

  return (
    <div style={{ fontFamily: SANS, background: '#FAFAF7', minHeight: '100vh' }}>

      {/* ── Fixed Nav ──────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(250,250,247,0.85)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2DED6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 56,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Path Forward home"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
        >
          <span
            style={{
              fontFamily: DISPLAY,
              color: '#1A2A22',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            Path <span style={{ color: '#0F6E56' }}>Forward</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a
            href="#how-it-works"
            style={{
              fontFamily: SANS,
              color: '#5C6B63', fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F6E56')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5C6B63')}
          >
            How It Works
          </a>
          <button
            onClick={() => navigate('/intake')}
            style={{
              fontFamily: SANS,
              color: '#0F6E56', fontSize: 14, fontWeight: 500,
              background: 'transparent',
              border: '1.5px solid rgba(15,110,86,0.45)',
              borderRadius: 8,
              padding: '7px 18px', cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              minHeight: 36,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0F6E56';
              e.currentTarget.style.background = 'rgba(15,110,86,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(15,110,86,0.45)';
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Get started"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero section ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', paddingTop: 56,
        }}
      >
        {/* Animated background paths */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true">
          <BackgroundPaths />
        </div>

        {/* Soft overlay — paths visible through the center */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(250,250,247,0.82) 0%, rgba(250,250,247,0.55) 60%, rgba(250,250,247,0.12) 100%)',
          }}
        />

        {/* Bottom fade into How It Works */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 200,
            background: 'linear-gradient(to bottom, transparent, #F5F2EC)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Centered hero content */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 768,
            margin: '0 auto',
            padding: '80px 28px',
            textAlign: 'center',
          }}
        >
          {/* Headline */}
          <h1
            className="hero-line-1"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(40px, 6.5vw, 80px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0 0 0 0',
            }}
          >
            <span style={{ color: '#1A2A22', display: 'block' }}>Your Path</span>
            <span style={{ color: '#0F6E56', display: 'block' }}>Starts Here</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-line-2"
            style={{
              fontFamily: SANS,
              color: '#5C6B63',
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              fontWeight: 400,
              lineHeight: 1.65,
              maxWidth: 480,
              margin: '24px auto 0',
            }}
          >
            Foster youth in Arizona — discover your funding,
            build your plan, find your way.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-line-3"
            style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'center', gap: 16,
              marginTop: 36,
            }}
          >
            <button
              onClick={() => navigate('/intake')}
              aria-label="Get my college readiness plan"
              style={{
                fontFamily: SANS, fontSize: 15, fontWeight: 500,
                color: '#ffffff',
                background: '#BA7517',
                border: '1.5px solid #BA7517',
                borderRadius: 10,
                padding: '13px 32px',
                minHeight: 48,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(186,117,23,0.25)',
                transition: 'background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#9A6013';
                e.currentTarget.style.borderColor = '#9A6013';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(186,117,23,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#BA7517';
                e.currentTarget.style.borderColor = '#BA7517';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(186,117,23,0.25)';
              }}
            >
              Get My Plan →
            </button>
            <button
              onClick={handleDemo}
              aria-label="Try the demo with sample data"
              style={{
                fontFamily: SANS, fontSize: 15, fontWeight: 500,
                color: '#0F6E56',
                background: 'transparent',
                border: '1.5px solid #0F6E56',
                borderRadius: 10,
                padding: '13px 32px',
                minHeight: 48,
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(15,110,86,0.08)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Try Demo
            </button>
          </div>

          {/* Privacy line */}
          <div
            className="hero-line-4"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 28,
              fontFamily: MONO,
              fontSize: 11, color: '#5C6B63',
              letterSpacing: '0.06em',
            }}
            aria-label="Privacy: no data stored, browser only"
          >
            <span
              className="status-dot"
              aria-hidden="true"
              style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0F6E56', flexShrink: 0 }}
            />
            Privacy active
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.35)' }}>·</span>
            No data stored
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.35)' }}>·</span>
            Browser only
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: '#F5F2EC',
          padding: '96px 28px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>

          </div>

          <h2
            style={{
              fontFamily: DISPLAY,
              color: '#1A2A22',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: '0 0 56px 0',
            }}
          >
            How It Works
          </h2>

          {/* Step cards — white on cream */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                num: '01', code: 'INTAKE.FORM',
                title: 'Tell Us Where You Are',
                desc: "Answer 6 quick questions about your situation — age, education goal, documents in hand, and benefits you've already applied for.",
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
              <div key={num} className="step-card" style={{ padding: '40px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: DISPLAY, color: '#0F6E56', fontSize: 56, fontWeight: 700, lineHeight: 1, opacity: 0.35 }}
                  >
                    {num}
                  </span>
                  <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.4)', fontSize: 9, letterSpacing: '0.16em', paddingTop: 10 }}>
                    {code}
                  </span>
                </div>
                <div style={{ width: 28, height: 2, background: '#0F6E56', opacity: 0.6, marginBottom: 16, borderRadius: 2 }} aria-hidden="true" />
                <h3 style={{ fontFamily: SANS, color: '#1A2A22', fontSize: 16, fontWeight: 600, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: SANS, color: '#5C6B63', fontSize: 14, lineHeight: 1.72, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
            <button
              onClick={() => navigate('/intake')}
              aria-label="Start my college readiness assessment"
              style={{
                fontFamily: SANS, fontSize: 15, fontWeight: 500,
                color: '#ffffff',
                background: '#0F6E56',
                border: '1.5px solid #0F6E56',
                borderRadius: 10,
                padding: '13px 32px',
                minHeight: 48,
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1a8a6e';
                e.currentTarget.style.borderColor = '#1a8a6e';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0F6E56';
                e.currentTarget.style.borderColor = '#0F6E56';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start My Assessment →
            </button>
            <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.45)', fontSize: 10, letterSpacing: '0.12em' }}>
              FREE · 2 MINUTES · NO ACCOUNT REQUIRED
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer bar ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#1A2A22',
          borderTop: '1px solid rgba(15,110,86,0.2)',
          padding: '18px 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="status-dot"
            aria-hidden="true"
            style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#0F6E56' }}
          />
          <span style={{ fontFamily: MONO, color: 'rgba(240,237,230,0.55)', fontSize: 10, letterSpacing: '0.1em' }}>
            PRIVACY.ACTIVE
            <span aria-hidden="true" style={{ margin: '0 8px', color: 'rgba(240,237,230,0.25)' }}>·</span>
            NO DATA STORED
            <span aria-hidden="true" style={{ margin: '0 8px', color: 'rgba(240,237,230,0.25)' }}>·</span>
            BROWSER ONLY
          </span>
        </div>
        <span style={{ fontFamily: MONO, color: 'rgba(240,237,230,0.35)', fontSize: 10, letterSpacing: '0.08em' }}>
          BUILT FOR FOSTER YOUTH IN ARIZONA
        </span>
      </footer>

    </div>
  );
}
