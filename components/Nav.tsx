'use client';

import { useState, useEffect, useCallback } from 'react';

/* The compliance workspace (the product). Local demo: http://localhost:3100 · production: app.praxya.in */
const APP_LOGIN_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.praxya.in'}/login`;

const NAV_LINKS = [
  { label: 'How It Works', href: '#solution' },
  { label: 'CBAM', href: '#cbam' },
  { label: 'For CAs', href: '#contact' },
  { label: 'Vision', href: '#vision' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.15, rootMargin: '-72px 0px 0px 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    },
    []
  );

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          {/* Logo */}
          <button className="nav-logo" onClick={scrollToTop} aria-label="Home">
            <PraxyaLogo />
            <span className="nav-wordmark">praxya</span>
          </button>

          {/* Desktop Links */}
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`nav-link ${
                  activeSection === link.href.slice(1) ? 'nav-link-active' : ''
                }`}
                onClick={(e) => handleClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="nav-right">
            <a href={APP_LOGIN_URL} className="nav-link nav-signin">
              Sign in
            </a>
            <a
              href="#contact"
              className="btn-secondary nav-cta"
              onClick={(e) => handleClick(e, '#contact')}
            >
              Book Free Assessment
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="mobile-overlay menu-open">
          <div className="mobile-header">
            <button className="nav-logo" onClick={scrollToTop} aria-label="Home">
              <PraxyaLogo />
              <span className="nav-wordmark">praxya</span>
            </button>
            <button
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="mobile-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="mobile-link"
                onClick={(e) => handleClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mobile-ctas">
            <a
              href={APP_LOGIN_URL}
              className="btn-secondary"
              style={{ width: '100%', textAlign: 'center', marginBottom: 12 }}
            >
              Sign in to the workspace
            </a>
            <a
              href="#contact"
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
              onClick={(e) => handleClick(e, '#contact')}
            >
              Book Free Assessment
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent;
          transition: background-color 200ms ease, border-color 200ms ease,
            box-shadow 200ms ease;
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }

        .nav-wordmark {
          font-family: var(--font-body);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
        }

        /* Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: color 150ms ease;
          padding: 4px 0;
        }

        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .nav-link-active {
          color: var(--color-accent);
        }

        /* Right */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .nav-cta {
          padding: 10px 22px;
          font-size: 14px;
        }

        /* Hamburger */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .nav-hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background-color: var(--color-text-primary);
          border-radius: 2px;
        }

        /* Mobile */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: var(--color-bg-primary);
          display: flex;
          flex-direction: column;
          padding: 0 24px;
        }

        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
        }

        .mobile-close {
          background: none;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          padding: 8px;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          flex: 1;
        }

        .mobile-link {
          font-family: var(--font-body);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text-primary);
          padding: 16px 0;
          border-bottom: 1px solid var(--color-divider-light);
          transition: color 150ms ease;
        }

        .mobile-link:hover {
          color: var(--color-accent);
        }

        .mobile-ctas {
          padding: 24px 0;
        }

        .nav-signin {
          font-weight: 600;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-right { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}

function PraxyaLogo() {
  return (
    <svg
      width="30"
      height="34"
      viewBox="0 0 56 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M28 2L52 16V46L28 60L4 46V16L28 2Z"
        stroke="#22C55E"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M14 38C18 34 24 30 32 30C38 30 42 33 46 37"
        stroke="#22C55E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 44C16 39 24 35 34 36C40 37 46 40 50 44"
        stroke="#22C55E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="22" r="3" fill="#22C55E" />
      <path
        d="M12 28L22 20"
        stroke="#22C55E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}