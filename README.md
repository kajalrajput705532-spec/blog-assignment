# Blog Assignment - Next.js (Pages Router)

A responsive blog application built using **Next.js (Pages Router)**, **JavaScript**, **Tailwind CSS v3**, and the **DummyJSON Posts API**.

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Local Setup
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/your-username/blog-assignment.git
   cd blog-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/blog](http://localhost:3000/blog) in your browser.

5. Production build (optional):
   ```bash
   npm run build
   npm run start
   ```

---

## Tech Stack & Dependencies

- **Framework**: Next.js 14 (Pages Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS (v3.4.17), PostCSS, Autoprefixer, and custom CSS variables in `styles/globals.css`
- **API**: DummyJSON Posts REST API (`https://dummyjson.com/posts`)

---

## Project Structure

```
blog-assignment/
├── components/
│   ├── BlogCard.js         # Blog post summary card
│   ├── Layout.js           # Header, Footer, and SEO Head metadata wrapper
│   ├── Pagination.js       # Right-aligned pagination controls with disabled states
│   └── TagDropdown.js      # Tag filter dropdown component
├── lib/
│   └── api.js              # Centralized API fetch methods & helpers
├── pages/
│   ├── _app.js             # Global App component
│   ├── 404.js              # Custom 404 error page
│   ├── index.js            # Server-side redirect to /blog
│   └── blog/
│       ├── index.js        # Blog listing page (SSR)
│       └── [id].js         # Blog detail page (SSG + ISR)
├── styles/
│   └── globals.css         # Tailwind directives & global styling
├── tailwind.config.js      # Tailwind CSS v3 configuration
├── postcss.config.js       # PostCSS configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies & scripts
└── .gitignore              # Git ignore file
```

---

## Rendering Strategy (SSR vs SSG)

### Blog Listing Page (`/blog`) — Server-Side Rendering (SSR)
- Implemented using `getServerSideProps` in `pages/blog/index.js`.
- Used for listing because search queries (`q`), tag filters (`tags`), and page numbers (`page`) change frequently per user request. SSR fetches fresh API data on each request so filter states can be shared via direct URL parameters.

### Blog Detail Page (`/blog/[id]`) — Static Site Generation (SSG) + ISR
- Implemented using `getStaticPaths` and `getStaticProps` in `pages/blog/[id].js`.
- Article details change infrequently, so SSG pre-renders static HTML pages at build time for fast CDN loading.
- Configured with `revalidate: 300` (5-minute Incremental Static Regeneration) to periodically update pages in the background.
- Uses `fallback: 'blocking'` to render unbuilt post IDs on demand on the server before caching.

---

## API Integration & Error Handling

Data is fetched from `https://dummyjson.com/posts` via helper functions in `lib/api.js`.

### API Endpoints Consumed
- Posts list: `/posts?limit=10&skip=0`
- Search: `/posts/search?q={query}`
- Single Post: `/posts/{id}`
- Tags list: `/posts/tags`

### Error Handling & Edge Cases
- **404 / Invalid Blog ID**: In `getStaticProps`, if a post ID is invalid (e.g. `/blog/abc` or `/blog/99999`) or the API returns 404, the function returns `{ notFound: true }`, which renders the custom 404 page (`pages/404.js`).
- **API Failure / 500 Error**: `getServerSideProps` catches network errors in a `try/catch` block and passes an error prop to display an inline error card with a "Retry Loading" button (`router.replace(router.asPath)`).
- **Empty Search Results**: Displays an empty state card with a "Reset Search" button when no posts match the query or tag filters.
- **Pagination Bounds**: On page 1, the Previous button is disabled (`opacity: 0.35`, `pointer-events: none`). On the last page, the Next button is disabled.

---

## Styling & Tailwind Setup

- Tailwind CSS v3 is configured via `tailwind.config.js` and `postcss.config.js`.
- Installation: `npm install -D tailwindcss@latest postcss@latest autoprefixer@latest`.
- Initialize config: `npx tailwindcss init -p` which creates the two config files.
- The `tailwind.config.js` content enables JIT mode, scans `pages/**/*.{js,jsx,ts,tsx}` and `components/**/*.{js,jsx,ts,tsx}` for class usage.
- Utility classes are combined with custom CSS variables in `styles/globals.css` for flexible theming (colors, spacing, fonts).
- Responsive layout is handled for Desktop, Tablet, and Mobile devices using CSS Grid, Flexbox, and media queries via Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- Example: `<div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">` ensures padding scales across breakpoints.

---

## SEO Implementation

- **Page Titles & Descriptions**: Configured dynamically per page using Next.js `<Head>`.
- **Canonical URLs**: Included `<link rel="canonical" href="..." />` tags on listing and detail pages.
- **Open Graph Metadata**: Added `og:title`, `og:description`, `og:type`, and `og:url` tags.
- **Structured Data**: Post detail pages include `@type: "Article"` JSON-LD schema for search engines.
