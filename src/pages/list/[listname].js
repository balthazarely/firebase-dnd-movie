import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { auth, db } from "lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import DraggableGrid from "components/DraggableGrid";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  deleteCollection,
  deleteMovieFromDB,
  updateDocumentOrderInDB,
} from "lib/firebaseFunctions";

import { formatMoviesForDnD } from "lib/utils";

export default function Listname() {
  // Hooks
  const router = useRouter();
  const { listname } = router.query;
  const [user] = useAuthState(auth);
  const query = collection(db, "users", `${auth.currentUser?.uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  // State
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (docs) {
      setMovies(formatMoviesForDnD(docs));
    }
  }, [docs]);

  useEffect(() => {
    updateDocumentOrderInDB(movies, listname);
  }, [movies]);

  return (
    <div>
      <button onClick={deleteListCollection}>Delete Collection</button>
      <DraggableGrid
        movies={movies}
        setMovies={setMovies}
        deleteMovie={deleteMovie}
      />
    </div>
  );

  async function deleteMovie(id) {
    try {
      deleteMovieFromDB(id, listname);
    } catch (error) {
      console.log(error);
    } finally {
      const filteredMovies = movies
        .filter((movie) => movie.movieId !== id)
        .map((movie, idx) => {
          return {
            ...movie,
            order: idx,
          };
        });
      setMovies(filteredMovies);
      setTimeout(() => {
        // setDbLoading(false);
      }, 300);
    }
  }

  async function deleteListCollection() {
    try {
      await deleteCollection(listname, user.uid);
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/profile");
    }
  }
}
