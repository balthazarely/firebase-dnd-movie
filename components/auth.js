import { auth, googleProvider } from "lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Auth() {
  const [user, loading, error] = useAuthState(auth);
  async function loginViaGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={loginViaGoogle}>Sign In</button>
    </div>
  );
}
