import { fetchPosts, searchPosts } from "./client";

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
}

describe("fetchPosts", () => {
  it("requests the page and reads the total from the header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse([{ id: 1, userId: 1, title: "t", body: "b" }], { headers: { "x-total-count": "42" } }));

    const result = await fetchPosts(3, 10);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts?_page=3&_limit=10",
      expect.objectContaining({ signal: undefined }),
    );
    expect(result.total).toBe(42);
    expect(result.posts).toHaveLength(1);
  });

  it("falls back to the page length when the header is missing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{ id: 1, userId: 1, title: "t", body: "b" }]));

    const result = await fetchPosts(1, 10);

    expect(result.total).toBe(1);
  });

  it("throws on an error status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 503 }));

    await expect(fetchPosts(1, 10)).rejects.toThrow("Request failed with status 503");
  });
});

describe("searchPosts", () => {
  it("encodes the query", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([]));

    await searchPosts("qui est");

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("https://jsonplaceholder.typicode.com/posts?q=qui%20est");
  });
});
