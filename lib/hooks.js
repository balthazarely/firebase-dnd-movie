import { auth, firestore } from "lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getNestedUserCollections } from "./api";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  return { user };
}

export function useNestedUserCollections() {
  const [user] = useAuthState(auth);
  const [nestedCollections, setNestedCollections] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const response = await getNestedUserCollections(user.uid);
          setNestedCollections(response);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [user]);

  return { nestedCollections };
}
