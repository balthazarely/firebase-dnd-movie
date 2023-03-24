import { UserContext } from "lib/context";
import { useNestedUserCollections } from "lib/hooks";
import Link from "next/link";
import { useContext } from "react";

export default function Profile() {
  const { user } = useContext(UserContext);
  const { nestedCollections } = useNestedUserCollections();

  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <h3>Lists</h3>
        {nestedCollections?.map((list, idx) => {
          return (
            <div key={idx}>
              <Link href={`/list/${list}`}>{list}</Link>
            </div>
          );
        })}
      </div>
    );
  }
  return <div>NOT LOGGED</div>;
}
