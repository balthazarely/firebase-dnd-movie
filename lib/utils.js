export const formatMoviesForDnD = (docs) => {
  return docs
    .map((movie) => {
      return {
        ...movie,
        id: movie.movieId,
      };
    })
    .sort((a, b) => a.order - b.order);
};
