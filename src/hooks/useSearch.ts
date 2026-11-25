import { useEffect, useState } from "react";
import { searchPosts, type Post } from "../api/client";
import { SEARCH_DEBOUNCE_MS } from "../config";

export type SearchState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "done"; results: Post[] }
  | { status: "error"; error: string };

export function useSearch(query: string): SearchState {
  const [state, setState] = useState<SearchState>({ status: "idle" });

  useEffect(() => {
    if (!query.trim()) {
      setState({ status: "idle" });
      return;
    }

    const timer = setTimeout(async () => {
      setState({ status: "searching" });
      try {
        const results = await searchPosts(query.trim());
        setState({ status: "done", results });
      } catch (err) {
        setState({ status: "error", error: err instanceof Error ? err.message : String(err) });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return state;
}
