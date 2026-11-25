import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Post } from "../api/client";
import { PostList } from "./PostList";

function makePosts(page: number): Post[] {
  return Array.from({ length: 10 }, (_, i) => {
    const id = (page - 1) * 10 + i + 1;
    return { id, userId: 1, title: `Post ${id}`, body: `Body ${id}` };
  });
}

function mockApi(total: number) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const params = new URL(String(input)).searchParams;
    const query = params.get("q");
    const body = query
      ? [{ id: 99, userId: 1, title: `Match for ${query}`, body: "..." }]
      : makePosts(Number(params.get("_page")));
    return new Response(JSON.stringify(body), {
      headers: { "content-type": "application/json", "x-total-count": String(total) },
    });
  });
}

describe("PostList", () => {
  it("renders the first page of posts", async () => {
    mockApi(30);
    render(<PostList />);

    expect(await screen.findByText("Post 1")).toBeTruthy();
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
  });

  it("moves to the next page", async () => {
    mockApi(30);
    render(<PostList />);
    await screen.findByText("Post 1");

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Post 11")).toBeTruthy();
    expect(screen.getByText("Page 2 of 3")).toBeTruthy();
  });

  it("shows search results for a query", async () => {
    mockApi(30);
    render(<PostList />);
    await screen.findByText("Post 1");

    await userEvent.type(screen.getByRole("searchbox", { name: "Search posts" }), "qui");

    expect(await screen.findByText('1 result for "Qui"')).toBeTruthy();
    expect(screen.getByText("Match for qui")).toBeTruthy();
  });

  it("shows an error when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("down", { status: 500 }));
    render(<PostList />);

    expect((await screen.findByRole("alert")).textContent).toContain("status 500");
  });
});
