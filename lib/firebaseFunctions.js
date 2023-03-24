import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, firestore } from "lib/firebase";

export async function updateDocumentOrderInDB(movies, listname) {
  try {
    movies?.forEach(async (movie, index) => {
      let position = index;
      const prerviousDoc = await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection(listname)
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

export async function deleteMovieFromDB(id, listname) {
  try {
    const movieDoc = doc(
      db,
      "users",
      auth.currentUser?.uid,
      listname,
      id.toString()
    );
    await deleteDoc(movieDoc);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Movie deleted from DB");
  }
}

export async function deleteCollection(name, uid) {
  const res = await fetch(
    "https://us-central1-fir-todo-9081a.cloudfunctions.net/deleteCollection",
    {
      method: "POST",
      body: JSON.stringify({
        req: {
          collection: name,
          userId: uid,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}

export async function addMovieToCollection(movie, collectionName, userId) {
  try {
    let sizeForCount = await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection(collectionName)
      .get()
      .then(function (querySnapshot) {
        return querySnapshot.size;
      });

    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection(collectionName)
      .doc(movie.id.toString())
      .set({
        movieId: movie.id,
        movieTitle: movie.title,
        image: movie.poster_path,
        order: sizeForCount ? sizeForCount : 0,
      });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("movie added to collection");
  }
}

export async function addMovieToNewCollection(
  movie,
  newCollectionName,
  userId
) {
  try {
    const data = {
      movieId: movie.id,
      movieTitle: movie.title,
      image: movie.poster_path,
    };
    await firestore
      .collection("users")
      .doc(userId)
      .collection(newCollectionName)
      .doc(movie.id.toString())
      .set(data);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("movie added to new collection");
  }
}
