import { currentSession, signIn, signOut } from "./session";

beforeEach(() => {
  sessionStorage.clear();
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
});

describe("currentSession", () => {
  it("drops an expired session", async () => {
    const session = await signIn("ada", "correct-horse");

    expect(currentSession(session.expiresAt + 1)).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it("ignores corrupted storage", () => {
    sessionStorage.setItem("post-browser.session", "{not json");

    expect(currentSession()).toBeNull();
  });
});

describe("signOut", () => {
  it("clears the stored session", async () => {
    await signIn("ada", "correct-horse");
    signOut();

    expect(currentSession()).toBeNull();
  });
});
