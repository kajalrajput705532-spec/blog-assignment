// DummyJSON API endpoint for fetching blog posts
export const API_BASE_URL = 'https://dummyjson.com/posts';

// DummyJSON se available tags fetch karne ke liye
export async function fetchTags() {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) return [];
    const tags = await response.json();
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Blog posts list fetch function (Search, Single tag aur Multi-tag filtering supported)
export async function fetchPosts({ limit = 10, skip = 0, query = '', tag = '', tags = '' } = {}) {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });

    // Tag list array prepare kiya
    let tagList = [];
    if (Array.isArray(tags)) {
      tagList = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      tagList = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else if (tag && typeof tag === 'string') {
      tagList = [tag.trim().toLowerCase()];
    }

    let endpoint = `${API_BASE_URL}?${params.toString()}`;

    if (query) {
      params.set('q', query);
      endpoint = `${API_BASE_URL}/search?${params.toString()}`;
    } else if (tagList.length === 1) {
      // Single tag filter endpoint
      endpoint = `${API_BASE_URL}/tag/${encodeURIComponent(tagList[0])}?${params.toString()}`;
    } else if (tagList.length > 1) {
      // Multiple tags selection handling
      params.set('limit', '150');
      params.set('skip', '0');
      endpoint = `${API_BASE_URL}?${params.toString()}`;
    }

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: HTTP ${response.status}`);
    }

    const data = await response.json();
    let posts = data.posts || [];

    // Multiple tags client-side filter
    if (tagList.length > 1) {
      posts = posts.filter((post) =>
        post.tags?.some((t) => tagList.includes(t.toLowerCase()))
      );

      const totalFiltered = posts.length;
      posts = posts.slice(skip, skip + limit);

      return {
        posts,
        total: totalFiltered,
        skip,
        limit,
      };
    }

    return {
      posts,
      total: data.total || 0,
      skip: data.skip || skip,
      limit: data.limit || limit,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Single post detail fetch function
export async function fetchPostById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch post #${id}: HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching post #${id}:`, error);
    throw error;
  }
}

// Estimated reading time calculate kar rahe hain (words / 200)
export function calculateReadingTime(text = '') {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
