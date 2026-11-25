import { useState, type ReactNode } from "react";
import type { Post } from "../api/client";
import { PAGE_SIZE } from "../config";
import { usePosts } from "../hooks/usePosts";
import { useSearch } from "../hooks/useSearch";
import { hasNextPage, pageCount } from "../lib/pagination";
import { resultSummary } from "../lib/text";

function PostItems({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <p>No posts to display.</p>;
  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function PostList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const state = usePosts(page, PAGE_SIZE);
  const search = useSearch(query);

  let content: ReactNode;
  if (query && search.status === "searching") {
    content = <p role="status">Searching…</p>;
  } else if (query && search.status === "error") {
    content = <p role="alert">Search failed: {search.error}</p>;
  } else if (query && search.status === "done") {
    content = (
      <>
        <h2>{resultSummary(search.results.length, query)}</h2>
        <PostItems posts={search.results} />
      </>
    );
  } else if (state.status === "loading") {
    content = <p role="status">Loading posts…</p>;
  } else if (state.status === "error") {
    content = <p role="alert">Could not load posts: {state.error}</p>;
  } else {
    content = (
      <>
        <PostItems posts={state.posts} />
        <nav className="pager" aria-label="Pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span>
            Page {page} of {pageCount(state.total, PAGE_SIZE)}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage(page, PAGE_SIZE, state.total)}>
            Next
          </button>
        </nav>
      </>
    );
  }

  return (
    <section aria-label="Posts">
      <input
        type="search"
        placeholder="Search posts"
        aria-label="Search posts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {content}
    </section>
  );
}
