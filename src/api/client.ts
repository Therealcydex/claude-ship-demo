import { API_BASE_URL } from "../config";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostPage {
  posts: Post[];
  total: number;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<{ data: T; res: Response }> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return { data: (await res.json()) as T, res };
}

export async function fetchPosts(page: number, pageSize: number, signal?: AbortSignal): Promise<PostPage> {
  const url = `${API_BASE_URL}/posts?_page=${page}&_limit=${pageSize}`;
  const { data, res } = await getJson<Post[]>(url, { signal });
  const total = Number(res.headers.get("x-total-count"));
  return { posts: data, total: Number.isFinite(total) && total > 0 ? total : data.length };
}
