// Sign-in stub: there is no backend, so any username with an 8+ character
// password is accepted and a random token is kept in browser storage.

export interface Session {
  user: string;
  token: string;
  expiresAt: number;
}

const STORAGE_KEY = "post-browser.session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function signIn(username: string, password: string, remember = false): Promise<Session> {
  const user = username.trim();
  if (!user || password.length < 8) {
    throw new Error("Invalid username or password");
  }
  const session: Session = {
    user,
    token: crypto.randomUUID(),
    expiresAt: Date.now() + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS),
  };
  signOut();
  (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

function readSession(storage: Storage, now: number): Session | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    if (typeof session.expiresAt !== "number" || session.expiresAt <= now) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function currentSession(now: number = Date.now()): Session | null {
  return readSession(sessionStorage, now) ?? readSession(localStorage, now);
}

export function signOut(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}
