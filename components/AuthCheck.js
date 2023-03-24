import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase";

export default function AuthCheck(props) {
  const [user] = useAuthState(auth);

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
