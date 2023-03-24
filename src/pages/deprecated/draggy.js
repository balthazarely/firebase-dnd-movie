import { useState } from "react";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db, firestore } from "lib/firebase";
import { useEffect } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import DraggableGrid from "components/DraggableGrid";

export default function Draggy() {
  const [movies, setMovies] = useState([]);

  const query = collection(
    db,
    "users",
    `${auth.currentUser?.uid}/favoritesMovies`
  );
  const [docs, loading, error] = useCollectionDataOnce(query);

  useEffect(() => {
    if (docs) {
      let array = docs
        .map((movie) => {
          return {
            ...movie,
            id: movie.movieId,
          };
        })
        .sort((a, b) => a.order - b.order);
      console.log(array);
      setMovies(array);
    }
  }, [docs]);

  useEffect(() => {
    testAllupdate();
  }, [movies]);

  return (
    <DraggableGrid
      movies={movies}
      setMovies={setMovies}
      deleteMovie={deleteMovie}
    />
  );

  async function testAllupdate() {
    try {
      movies.forEach(async (movie, index) => {
        let position = index;
        const prerviousDoc = await firestore
          .collection("users")
          .doc(auth.currentUser?.uid)
          .collection("favoritesMovies")
          .where("movieId", "==", movie.movieId)
          .limit(1)
          .get();
        const thing = prerviousDoc.docs[0];
        let tmp = thing.data();
        tmp.order = position;
        thing.ref.update(tmp);
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log("db written success");
    }
  }

  async function deleteMovie(id) {
    try {
      // setDbLoading(true);
      const movieDoc = doc(
        db,
        "users",
        auth.currentUser?.uid,
        "favoritesMovies",
        id.toString()
      );
      await deleteDoc(movieDoc);
      // reorderMovies();
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
}
