import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import TagDropdown from '../../components/TagDropdown';
import { fetchPosts, fetchTags } from '../../lib/api';

// SSR (Server-Side Rendering): Har request par initial posts aur tags list load karta hai
export async function getServerSideProps({ query }) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = 10;
  const skip = (page - 1) * limit;
  const q = typeof query.q === 'string' ? query.q.trim() : '';

  // URL Query se single/multiple tags extract karna
  const rawTags = query.tags || query.tag || '';
  const selectedTags = rawTags
    ? rawTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  try {
    // API se posts aur tags ko parallel fetch kar rahe hain
    const [data, availableTags] = await Promise.all([
      fetchPosts({ limit, skip, query: q, tags: selectedTags }),
      fetchTags(),
    ]);

    return {
      props: {
        posts: data.posts || [],
        total: data.total || 0,
        page,
        limit,
        q,
        selectedTags,
        availableTags,
        error: null,
      },
    };
  } catch (err) {
    console.error('Error in getServerSideProps:', err);

    return {
      props: {
        posts: [],
        total: 0,
        page: 1,
        limit,
        q: '',
        selectedTags: [],
        availableTags: [],
        error: 'Unable to load stories. Please try again.',
      },
    };
  }
}

// Blog Listing Page Main Component
export default function BlogListingPage({
  posts = [],
  total = 0,
  page = 1,
  limit = 10,
  q = '',
  selectedTags = [],
  availableTags = [],
  error = null,
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(q);

  // Jab user browser back/forward kare ya query change ho, search input sync rahe
  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  // URL Query params update karke route push karne ka helper function
  const updateFilters = (newSearch, newTags) => {
    const query = {};
    const search = (newSearch !== undefined ? newSearch : searchTerm).trim();
    const tags = newTags !== undefined ? newTags : selectedTags;

    if (search) query.q = search;
    if (tags.length === 1) query.tag = tags[0];
    else if (tags.length > 1) query.tags = tags.join(',');

    // scroll: false se pagination/filter change par page jump nahi karta
    router.push({ pathname: '/blog', query }, undefined, { scroll: false });
  };

  // Keyword search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters(searchTerm);
  };

  // Sabhi active filters reset/clear karne ka handler
  const handleClearFilters = () => {
    setSearchTerm('');
    router.push('/blog', undefined, { scroll: false });
  };

  const hasActiveFilters = Boolean(q || selectedTags.length > 0);
  const hasPosts = posts.length > 0;

  return (
    <Layout
      title="Blog — PaperTrail"
      description="Explore practical articles, technical guides, and stories on web development and technology."
    >
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">THE PAPERTRAIL JOURNAL</span>
            <h1 className="hero-title">
              Ideas, Insights &amp; <br />
              <em className="highlight-text">Stories.</em>
            </h1>
            <p className="hero-description">
              A collection of thoughts, engineering guides, and discoveries. Built with Next.js Pages Router and DummyJSON API.
            </p>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <span>✦</span>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="container listing-section">
        {/* Toolbar: Tag Dropdown & Search Bar */}
        <div className="listing-toolbar">
          <div className="toolbar-left">
            <h2 className="section-title">Latest Articles</h2>
            <span className="total-count">
              {total} {total === 1 ? 'story' : 'stories'} available
            </span>
          </div>

          <div className="toolbar-controls">
            <TagDropdown
              tags={availableTags}
              selectedTags={selectedTags}
              onApplyTags={(tags) => updateFilters(undefined, tags)}
            />

            <form onSubmit={handleSearchSubmit} className="search-form" role="search">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories by keyword..."
                aria-label="Search stories"
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="active-filter-banner">
            <div className="active-tags-summary">
              <span>Showing results for </span>
              {q && <strong>&quot;{q}&quot; </strong>}
              {selectedTags.length > 0 && (
                <span className="selected-tag-badges">
                  tagged:{' '}
                  {selectedTags.map((t) => (
                    <span key={t} className="active-tag-chip">
                      #{t}
                    </span>
                  ))}
                </span>
              )}
            </div>

            <button onClick={handleClearFilters} className="clear-filter-btn" type="button">
              Clear All Filters &times;
            </button>
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="state-card error-state">
            <div className="state-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => router.replace(router.asPath)} className="retry-btn" type="button">
              Retry Loading
            </button>
          </div>
        ) : !hasPosts ? (
          /* Empty State */
          <div className="state-card empty-state">
            <div className="state-icon">🔍</div>
            <h3>No stories found</h3>
            <p>We couldn&apos;t find any posts matching your selected filters. Try searching for something else.</p>
            <button onClick={handleClearFilters} className="clear-filter-btn" type="button">
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          /* Posts Grid & Pagination */
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              page={page}
              total={total}
              limit={limit}
              query={q}
              tag={selectedTags.length === 1 ? selectedTags[0] : ''}
              tags={selectedTags.length > 1 ? selectedTags.join(',') : ''}
            />
          </>
        )}
      </section>
    </Layout>
  );
}
