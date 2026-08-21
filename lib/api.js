// DummyJSON API ka base endpoint blog posts ke liye
export const API_BASE_URL = 'https://dummyjson.com/posts';

// DummyJSON se available sabhi tags fetch karne ke liye function
export async function fetchTags() {
  try {
    const res = await fetch(`${API_BASE_URL}/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Blog posts list fetch function: Pagination, Search Query aur Single/Multi Tag filtering ko handle karta hai
export async function fetchPosts({ limit = 10, skip = 0, query = '', tag = '', tags = '' } = {}) {
  try {
    // Array ya comma-separated tags string ko normalize karke clean array banaya
    const tagList = [
      ...(Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : []),
      ...(tag && typeof tag === 'string' ? [tag] : []),
    ]
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // Duplicate tags remove karne ke liye Set use kiya
    const uniqueTags = [...new Set(tagList)];

    // URL Query parameters prepare kar rahe hain
    const params = new URLSearchParams({
      limit: String(uniqueTags.length > 1 ? 150 : limit),
      skip: String(uniqueTags.length > 1 ? 0 : skip),
    });

    let endpoint = `${API_BASE_URL}?${params}`;

    // Keyword search, single tag filter ya default all posts endpoint select karna
    if (query.trim()) {
      params.set('q', query.trim());
      endpoint = `${API_BASE_URL}/search?${params}`;
    } else if (uniqueTags.length === 1) {
      // DummyJSON ka dedicated single tag filter endpoint
      endpoint = `${API_BASE_URL}/tag/${encodeURIComponent(uniqueTags[0])}?${params}`;
    }

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    let posts = data.posts || [];

    // Jab multiple tags selected hon, tab client-side filtering lagate hain
    if (uniqueTags.length > 1) {
      posts = posts.filter((post) =>
        post.tags?.some((t) => uniqueTags.includes(t.toLowerCase()))
      );

      return {
        posts: posts.slice(skip, skip + limit),
        total: posts.length,
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
    console.error('Error in fetchPosts:', error);
    throw error;
  }
}

// Single post detail fetch karne ke liye (by ID)
export async function fetchPostById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching post #${id}:`, error);
    throw error;
  }
}

// Article reading time calculate karne ka helper function (assuming 200 words/min)
export function calculateReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

