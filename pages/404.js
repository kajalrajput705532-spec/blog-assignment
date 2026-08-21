import Link from 'next/link';
import Layout from '../components/Layout';

// Custom 404 error page (Jab post ya page missing ho)
export default function Custom404() {
  return (
    <Layout
      title="404 — Story Not Found | PaperTrail"
      description="The requested blog post or page could not be found."
    >
      <div className="container not-found-wrapper">
        <div className="not-found-card">
          <span className="error-badge">404</span>
          <h1 className="not-found-title">Story Not Found</h1>
          <p className="not-found-text">
            The article or page you are looking for doesn&apos;t exist, has been removed, or has an invalid URL.
          </p>
          <Link href="/blog" className="primary-action-btn">
            &larr; Back to All Stories
          </Link>
        </div>
      </div>
    </Layout>
  );
}
