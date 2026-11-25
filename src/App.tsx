import { useState } from "react";
import { currentSession, signOut, type Session } from "./auth/session";
import { SignInForm } from "./auth/SignInForm";
import { PostList } from "./components/PostList";

export function App() {
  const [session, setSession] = useState<Session | null>(() => currentSession());

  return (
    <main>
      <header>
        <h1>Post Browser</h1>
        <p className="tagline">Browse the latest posts from JSONPlaceholder.</p>
        {session && (
          <p>
            Signed in as {session.user}{" "}
            <button
              onClick={() => {
                signOut();
                setSession(null);
              }}
            >
              Sign out
            </button>
          </p>
        )}
      </header>
      {session ? <PostList /> : <SignInForm onSignedIn={setSession} />}
    </main>
  );
}
