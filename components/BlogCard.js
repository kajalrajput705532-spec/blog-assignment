import Link from 'next/link';
import { calculateReadingTime } from '../lib/api';

// Single blog card component
export default function BlogCard({ post }) {
  if (!post) return null;

  const readingTime = calculateReadingTime(post.body);
  const likesCount = post.reactions?.likes ?? post.reactions ?? 0;
  const dislikesCount = post.reactions?.dislikes ?? 0;
  const viewsCount = post.views ?? 0;

  return (
    <article className="blog-card">
      {/* Top tag aur read time */}
      <div className="card-header">
        <span className="post-badge">
          <span className="badge-dot"></span>
          Story #{String(post.id).padStart(2, '0')}
        </span>
        <span className="reading-time">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="time-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readingTime} min read
        </span>
      </div>

      {/* Post title link */}
      <h2 className="card-title">
        <Link href={`/blog/${post.id}`}>
          {post.title}
        </Link>
      </h2>

      {/* Short excerpt */}
      <p className="card-excerpt">{post.body}</p>

      {/* Tags list */}
      {post.tags && post.tags.length > 0 && (
        <div className="card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author info aur views/likes metrics */}
      <div className="card-footer">
        <div className="author-info">
          <div className="avatar-ring">
            <div className="avatar">{String(post.userId).slice(0, 2)}</div>
          </div>
          <span className="author-name">Author #{post.userId}</span>
        </div>

        {/* Likes aur views count */}
        <div className="card-metrics">
          <span className="metric-badge" title="Total Views">
            <svg className="metric-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{viewsCount.toLocaleString()}</span>
          </span>

          <span className="metric-badge" title="Likes">
            <svg className="metric-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{likesCount}</span>
          </span>

          {dislikesCount > 0 && (
            <span className="metric-badge" title="Dislikes">
              <svg className="metric-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
              </svg>
              <span>{dislikesCount}</span>
            </span>
          )}
        </div>
      </div>

      {/* Read story button */}
      <div className="card-action">
        <Link href={`/blog/${post.id}`} className="read-more-btn">
          <span>Read Article</span>
          <span className="action-arrow">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
