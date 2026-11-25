export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

export const SEARCH_API_KEY: string =
  import.meta.env.VITE_SEARCH_API_KEY ?? "pb_srch_4c1f9e2a7b3d8065e1f2a9c4b7d0e3f6";

export const PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_MS = 300;
