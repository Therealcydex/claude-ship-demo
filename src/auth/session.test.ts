import { currentSession, signIn, signOut } from "./session";

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe("signIn", () => {
  it("stores a session for valid credentials", async () => {
    const session = await signIn("  ada  ", "correct-horse");

    expect(session.user).toBe("ada");
    expect(session.token).toMatch(/[0-9a-f-]{36}/);
    expect(currentSession()).toEqual(session);
  });

  it("rejects a blank username or a short password", async () => {
    await expect(signIn("   ", "correct-horse")).rejects.toThrow("Invalid username or password");
    await expect(signIn("ada", "short")).rejects.toThrow("Invalid username or password");
    expect(currentSession()).toBeNull();
  });

  it("keeps the session in sessionStorage unless asked to remember", async () => {
    await signIn("ada", "correct-horse");

    expect(sessionStorage.length).toBe(1);
    expect(localStorage.length).toBe(0);
  });

  it("keeps a remembered session in localStorage for 30 days", async () => {
    const before = Date.now();
    const session = await signIn("ada", "correct-horse", true);

    expect(localStorage.length).toBe(1);
    expect(sessionStorage.length).toBe(0);
    expect(session.expiresAt).toBeGreaterThanOrEqual(before + 30 * 24 * 60 * 60 * 1000);
    expect(currentSession()).toEqual(session);
  });
});

describe("currentSession", () => {
  it("drops an expired session", async () => {
    const session = await signIn("ada", "correct-horse");

    expect(currentSession(session.expiresAt + 1)).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it("drops an expired remembered session", async () => {
    const session = await signIn("ada", "correct-horse", true);

    expect(currentSession(session.expiresAt + 1)).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it("ignores corrupted storage", () => {
    sessionStorage.setItem("post-browser.session", "{not json");

    expect(currentSession()).toBeNull();
  });
});

describe("signOut", () => {
  it("clears both kinds of stored session", async () => {
    await signIn("ada", "correct-horse", true);
    sessionStorage.setItem("post-browser.session", "{}");
    signOut();

    expect(currentSession()).toBeNull();
    expect(localStorage.length + sessionStorage.length).toBe(0);
  });
});
