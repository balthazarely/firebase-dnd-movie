export const getNowPlayingMovies = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US&page=${pageParam}`
  );
  return res.json();
};

export const getTopMovies = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US&page=${pageParam}`
  );
  return res.json();
};

export const getNestedUserCollections = async (uid) => {
  const res = await fetch(
    "https://us-central1-fir-todo-9081a.cloudfunctions.net/getNestedUserCollections",
    {
      method: "POST",
      body: JSON.stringify({ req: { userId: uid } }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await res.json();
  return response;
};
