import { useState, type FormEvent } from "react";
import { signIn, type Session } from "./session";

interface Props {
  onSignedIn: (session: Session) => void;
}

export function SignInForm({ onSignedIn }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onSignedIn(await signIn(username, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <form className="sign-in" onSubmit={handleSubmit} aria-label="Sign in">
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={busy}>
        Sign in
      </button>
    </form>
  );
}
