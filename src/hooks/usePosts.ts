import { useEffect, useState } from "react";
import { fetchPosts, type Post } from "../api/client";

export type PostsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; posts: Post[]; total: number };

export function usePosts(page: number, pageSize: number): PostsState {
  const [state, setState] = useState<PostsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchPosts(page, pageSize, controller.signal)
      .then(({ posts, total }) => setState({ status: "ready", posts, total }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error: err instanceof Error ? err.message : String(err) });
      });
    return () => controller.abort();
  }, [page, pageSize]);

  return state;
}
