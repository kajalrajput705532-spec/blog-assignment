import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { fetchPostById, fetchPosts, calculateReadingTime } from '../../lib/api';

// SSG (Static Site Generation): Top 30 posts ke paths build time par pre-render karta hai
export async function getStaticPaths() {
  try {
    const data = await fetchPosts({ limit: 30, skip: 0 });
    const paths = (data.posts || []).map((post) => ({
      params: { id: String(post.id) },
    }));

    // fallback: blocking se agar koi path pre-render nahi hai toh server par render hoke cache ho jayega
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

// ISR (Incremental Static Regeneration): Single post data fetch karta hai aur 300s (5 min) par revalidate karta hai
export async function getStaticProps({ params }) {
  const postId = Number(params?.id);
  if (!Number.isInteger(postId) || postId < 1) {
    return { notFound: true };
  }

  try {
    const post = await fetchPostById(postId);
    if (!post) return { notFound: true };

    return {
      props: { post },
      revalidate: 300, // Background revalidation after 5 minutes
    };
  } catch (error) {
    console.error(`Error fetching post #${postId}:`, error);
    return { notFound: true };
  }
}

// Blog Detail Page View Component
export default function BlogDetailPage({ post }) {
  if (!post) return null;

  const pageTitle = `${post.title} — PaperTrail`;
  const metaDescription =
    post.body.length > 155 ? `${post.body.slice(0, 152)}...` : post.body;
  const canonicalUrl = `/blog/${post.id}`;
  const readingTime = calculateReadingTime(post.body);

  const likesCount = post.reactions?.likes ?? post.reactions ?? 0;
  const dislikesCount = post.reactions?.dislikes ?? 0;
  const viewsCount = post.views ?? 0;

  // JSON-LD Structured Data for Article SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: metaDescription,
    author: {
      '@type': 'Person',
      name: `Author #${post.userId}`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <Layout title={pageTitle} description={metaDescription} canonicalUrl={canonicalUrl}>
      <Head>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </Head>

      <article className="container detail-container">
        {/* Back Button */}
        <div className="detail-top-nav">
          <Link href="/blog" className="stylish-back-btn">
            <span className="btn-arrow">&larr;</span>
            <span>Back to Stories</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="article-header">
          <div className="article-meta-bar">
            <span className="post-id-tag">Story #{String(post.id).padStart(2, '0')}</span>
            <span className="separator">&bull;</span>
            <span className="author-name">By Author #{post.userId}</span>
            <span className="separator">&bull;</span>
            <span className="read-time">{readingTime} min read</span>
          </div>

          <h1 className="article-title">{post.title}</h1>

          {/* Static Non-Clickable Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="article-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip non-clickable">
                  #{String(tag).toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="article-body-wrapper">
          <p className="article-text">{post.body}</p>
        </div>

        {/* Metrics */}
        <footer className="article-footer">
          <div className="engagement-box">
            <div className="metric-item">
              <svg className="metric-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="metric-label">{likesCount} Likes</span>
            </div>

            {dislikesCount > 0 && (
              <div className="metric-item">
                <svg className="metric-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                </svg>
                <span className="metric-label">{dislikesCount} Dislikes</span>
              </div>
            )}

            <div className="metric-item">
              <svg className="metric-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="metric-label">{viewsCount.toLocaleString()} Total Views</span>
            </div>
          </div>
        </footer>
      </article>
    </Layout>
  );
}

