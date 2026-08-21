import Link from 'next/link';

// Reusable Dark Theme Footer Component: Sabhi pages par brand, links, static topics aur back-to-top provide karta hai
export default function Footer() {
  // Page ke top par smoothly scroll karne ke liye
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-content-grid">
        {/* Brand & Tagline Column */}
        <div className="footer-col brand-col">
          <Link href="/blog" className="footer-brand-logo">
            <span className="logo-badge">P</span>
            <span className="footer-brand-title">PaperTrail</span>
          </Link>
          <p className="footer-tagline">
            A curated space for engineering insights, technology deep-dives, and thoughtful stories.
          </p>
          <div className="footer-badge-pill">
            <span className="status-dot"></span>
            <span>Next.js SSR &amp; SSG Blog</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li>
              <Link href="/blog">All Stories</Link>
            </li>
            <li>
              <Link href="/blog?tag=history">History</Link>
            </li>
            <li>
              <Link href="/blog?tag=fiction">Fiction</Link>
            </li>
            <li>
              <Link href="/blog?tag=crime">Crime</Link>
            </li>
          </ul>
        </div>

        {/* Tags / Topics Column (Non-clickable static chips) */}
        <div className="footer-col">
          <h4 className="footer-heading">Popular Topics</h4>
          <div className="footer-tag-cloud">
            <span className="footer-tag-chip">#love</span>
            <span className="footer-tag-chip">#magical</span>
            <span className="footer-tag-chip">#mystery</span>
            <span className="footer-tag-chip">#classic</span>
            <span className="footer-tag-chip">#french</span>
          </div>
        </div>

        {/* Action / Back to Top Column */}
        <div className="footer-col action-col">
          <h4 className="footer-heading">Navigation</h4>
          <p className="footer-action-desc">
            Finished reading? Jump back to the top anytime.
          </p>
          <button onClick={scrollToTop} className="back-to-top-btn" type="button" aria-label="Scroll to top">
            <span>Back to Top</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container footer-bottom-bar">
        <div className="copyright-text">
          &copy; {new Date().getFullYear()} PaperTrail Journal. All rights reserved.
        </div>
        <div className="footer-credits">
          <span>Powered by Next.js &amp; DummyJSON API</span>
        </div>
      </div>
    </footer>
  );
}
