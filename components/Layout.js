import Head from 'next/head';
import Link from 'next/link';
import Footer from './Footer';

// Main page layout component (Header, Head metadata, Footer)
export default function Layout({
  children,
  title = 'PaperTrail — Modern Tech & Product Stories',
  description = 'Explore thoughtful articles, discoveries, and stories on web development, design, and software engineering.',
  canonicalUrl = 'https://next-blog-assignment.vercel.app/blog',
}) {
  return (
    <div className="layout-root">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="canonical" href={canonicalUrl} />

        {/* SEO OG tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top navbar */}
      <header className="site-header">
        <div className="container header-container">
          <Link href="/blog" className="brand-logo">
            <span className="logo-badge">P</span>
            <span className="logo-text">PaperTrail</span>
          </Link>

          <nav className="header-nav">
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="main-content">{children}</main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  );
}
