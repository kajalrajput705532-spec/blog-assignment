import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import TagDropdown from '../../components/TagDropdown';
import { fetchPosts, fetchTags } from '../../lib/api';

// SSR se initial posts aur tags list load kar rhe h
export async function getServerSideProps({ query }) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = 10;
  const skip = (page - 1) * limit;
  const q = typeof query.q === 'string' ? query.q.trim() : '';

  // Single tag filter aur multi tags query dono handle kiya h
  let selectedTags = [];
  if (typeof query.tags === 'string' && query.tags.trim()) {
    selectedTags = query.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  } else if (typeof query.tag === 'string' && query.tag.trim()) {
    selectedTags = [query.tag.trim().toLowerCase()];
  }

  try {
    // API se posts aur tags fetch kar rhe hai parallel me
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
        page,
        limit,
        q,
        selectedTags: [],
        availableTags: [],
        error: 'Unable to connect to the blog service. Please try again later.',
      },
    };
  }
}

// Blog listing page main component
export default function BlogListingPage({
  posts,
  total,
  page,
  limit,
  q,
  selectedTags = [],
  availableTags = [],
  error,
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(q);

  // Search input aur tags update karke URL me query params push kar rhe h
  const navigateWithFilters = (newSearchQuery = searchTerm, newTags = selectedTags) => {
    const queryParams = new URLSearchParams();

    if (newSearchQuery.trim()) {
      queryParams.set('q', newSearchQuery.trim());
    }

    if (newTags && newTags.length > 0) {
      if (newTags.length === 1) {
        queryParams.set('tag', newTags[0]);
      } else {
        queryParams.set('tags', newTags.join(','));
      }
    }

    router.push(`/blog?${queryParams.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateWithFilters(searchTerm, selectedTags);
  };

  const handleApplyTagsFromDropdown = (newTags) => {
    navigateWithFilters(searchTerm, newTags);
  };

  // Sabhi active filters reset karne ke liye
  const handleClearFilters = () => {
    setSearchTerm('');
    router.push('/blog');
  };

  const hasPosts = posts && posts.length > 0;

  return (
    <Layout
      title="Blog — PaperTrail"
      description="Explore practical articles, technical guides, and stories on web development and technology."
    >
      {/* Top Header Banner */}
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
        {/* Search aur Tag Filter Toolbar */}
        <div className="listing-toolbar">
          <div className="toolbar-left">
            <h2 className="section-title">Latest Articles</h2>
            <span className="total-count">
              {total} {total === 1 ? 'story' : 'stories'} available
            </span>
          </div>

          <div className="toolbar-controls">
            {/* Tag Filter Dropdown */}
            <TagDropdown
              tags={availableTags}
              selectedTags={selectedTags}
              onApplyTags={handleApplyTagsFromDropdown}
            />

            {/* Keyword Search Form */}
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

        {/* Active Filter Bar (jab filter applied ho tab dikhega) */}
        {(q || selectedTags.length > 0) && (
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

            <button onClick={handleClearFilters} className="clear-filter-btn">
              Clear All Filters &times;
            </button>
          </div>
        )}

        {/* Posts List & States */}
        {error ? (
          <div className="state-card error-state">
            <div className="state-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => router.replace(router.asPath)} className="retry-btn">
              Retry Loading
            </button>
          </div>
        ) : !hasPosts ? (
          <div className="state-card empty-state">
            <div className="state-icon">🔍</div>
            <h3>No stories found</h3>
            <p>We couldn&apos;t find any posts matching your selected tags or search criteria. Try different filters.</p>
            <button onClick={handleClearFilters} className="clear-filter-btn">
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <>
            {/* Posts Grid Layout */}
            <div className="posts-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
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
