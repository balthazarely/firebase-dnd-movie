import { useInfiniteQuery } from "@tanstack/react-query";
import { auth } from "lib/firebase";
import { useEffect, useState } from "react";
import { getNestedUserCollections } from "lib/api";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addMovieToCollection,
  addMovieToNewCollection,
} from "lib/firebaseFunctions";

export function MovieGrid({ fetchFn, title }) {
  const [nestedCollections, setNestedCollections] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      refetchCollectionList();
    }
  }, [user]);

  async function refetchCollectionList() {
    const nested = await getNestedUserCollections(user.uid);
    setNestedCollections(nested);
  }

  const {
    isLoading,
    isError,
    error,
    hasNextPage,
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery([title], fetchFn, {
    staleTime: 10000,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>"error"</h2>;
  }

  return (
    <>
      <div>
        {data.pages.map((page) =>
          page.results.map((movie, idx) => (
            <MovieCard
              key={idx}
              movie={movie}
              refetchCollectionList={refetchCollectionList}
              nestedCollections={nestedCollections}
            />
          ))
        )}
      </div>
      <div className="btn-container">
        <button onClick={() => fetchNextPage()}>Load More</button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}

function MovieCard({ movie, nestedCollections, refetchCollectionList }) {
  const [dbLoading, setDbLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  async function addToCollection(movie, collectionName) {
    try {
      setDbLoading(true);
      addMovieToCollection(movie, collectionName, auth.currentUser?.uid);
    } catch (error) {
      console.log(error);
    } finally {
      setDbLoading(false);
    }
  }

  async function createAndAddToCollection(movie) {
    if (!nestedCollections?.includes(newCollectionName)) {
      console.log("attempting to make new list");
      try {
        setDbLoading(true);
        await addMovieToNewCollection(
          movie,
          newCollectionName,
          auth.currentUser?.uid
        );
        await refetchCollectionList();
      } catch (error) {
        console.log(error);
      } finally {
        setDbLoading(false);
      }
    } else {
      console.error("list already existis");
    }
  }
  return (
    <div>
      <h4>{movie.title}</h4>
      {nestedCollections?.map((list) => {
        return (
          <button
            key={list}
            disabled={dbLoading}
            onClick={() => addToCollection(movie, list)}
          >
            {list}
          </button>
        );
      })}
      <button
        style={{ background: "yellow" }}
        onClick={() => createAndAddToCollection(movie)}
      >
        Create new collection with movie
      </button>
      <input
        placeholder="new collection name"
        onChange={(e) => setNewCollectionName(e.target.value)}
      />
    </div>
  );
}
