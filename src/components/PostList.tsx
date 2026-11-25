import { useState } from "react";
import { PAGE_SIZE } from "../config";
import { usePosts } from "../hooks/usePosts";
import { hasNextPage, pageCount } from "../lib/pagination";

export function PostList() {
  const [page, setPage] = useState(1);
  const state = usePosts(page, PAGE_SIZE);

  if (state.status === "loading") return <p role="status">Loading posts…</p>;
  if (state.status === "error") return <p role="alert">Could not load posts: {state.error}</p>;

  const pages = pageCount(state.total, PAGE_SIZE);

  return (
    <section aria-label="Posts">
      {state.posts.length === 0 ? (
        <p>No posts to display.</p>
      ) : (
        <ul className="posts">
          {state.posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
      <nav className="pager" aria-label="Pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage(page, PAGE_SIZE, state.total)}>
          Next
        </button>
      </nav>
    </section>
  );
}
