import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db, firestore } from "lib/firebase";
import { useEffect, useState } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export default function Drag() {
  const [movies, setmovies] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const query = collection(
    db,
    "users",
    `${auth.currentUser?.uid}/favoritesMovies`
  );
  const [docs, loading, error] = useCollectionDataOnce(query);

  useEffect(() => {
    // reorderMovies();
    setmovies(docs);
  }, [docs]);

  console.log(docs);
  function reorderMovies() {
    firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("favoritesMovies")
      .get()
      .then(function (querySnapshot) {
        let newOrder = 0;
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            order: newOrder,
          });
          newOrder++;
        });
      });
  }

  const deleteMovie = async (id) => {
    if (dbLoading) {
      return;
    }
    try {
      setDbLoading(true);
      const movieDoc = doc(
        db,
        "users",
        auth.currentUser?.uid,
        "favoritesMovies",
        id.toString()
      );
      await deleteDoc(movieDoc);
      reorderMovies();
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
      setmovies(filteredMovies);
      setTimeout(() => {
        setDbLoading(false);
      }, 300);
    }
  };

  async function testAllupdate() {
    try {
      movies.forEach(async (movie) => {
        console.log(movies);
        const prerviousDoc = await firestore
          .collection("users")
          .doc(auth.currentUser?.uid)
          .collection("favoritesMovies")
          .where("movieId", "==", movie.movieId)
          .limit(1)
          .get();
        const thing = prerviousDoc.docs[0];
        let tmp = thing.data();
        tmp.order = 44;
        thing.ref.update(tmp);
      });
    } catch (error) {
      console.log(error);
    }
  }

  const moveUp = async (id, order, moveDirection) => {
    const calcDirection = (val) => (moveDirection === "up" ? val : val * -1);
    try {
      // Updating UI
      if (
        (order === 0 && moveDirection === "up") ||
        (order === movies.length - 1 && moveDirection === "down") ||
        dbLoading
      ) {
        console.log("cant move");
        return;
      }
      setDbLoading(true);
      const updatedArr = movies.map((movie) => {
        if (movie.movieId === id) {
          return { ...movie, order: movie.order - 1 };
        } else if (movie.order === order - 1) {
          return { ...movie, order: movie.order + 1 };
        } else {
          return movie;
        }
      });
      setmovies(updatedArr);

      // Updating Firestore
      const docSnap = await getDoc(
        doc(
          db,
          "users",
          auth.currentUser?.uid,
          "favoritesMovies",
          id.toString()
        )
      );
      const prerviousDoc = await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("favoritesMovies")
        .where("order", "==", docSnap.data().order - 1)
        .limit(1)
        .get();
      const thing = prerviousDoc.docs[0];
      let tmp = thing.data();
      tmp.order = tmp.order + 1;
      thing.ref.update(tmp);
      await updateDoc(
        doc(
          db,
          "users",
          auth.currentUser?.uid,
          "favoritesMovies",
          id.toString()
        ),
        {
          order: docSnap.data().order - 1,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <>
      <h1>my movies</h1>
      <button onClick={testAllupdate}>Test</button>
      {movies
        ?.sort((a, b) => a.order - b.order)
        .map((movie, idx) => (
          <div key={idx}>
            <h3>{movie.movieTitle}</h3>
            <div>{movie.order}</div>
            <button
              disabled={dbLoading}
              onClick={() => deleteMovie(movie.movieId)}
            >
              delete
            </button>
            <button
              disabled={dbLoading}
              style={{ background: "yellow", color: "black" }}
              onClick={() => moveUp(movie.movieId, movie.order, "up")}
            >
              Move Up
            </button>
          </div>
        ))}
      {dbLoading ? <h3 style={{ marginTop: "36px" }}>Loading</h3> : <></>}
    </>
  );
}
