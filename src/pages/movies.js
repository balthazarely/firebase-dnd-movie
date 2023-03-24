import { MovieGrid } from "components/MovieGrid";
import { getNowPlayingMovies } from "lib/api";
import React from "react";

export default function Movies() {
  return (
    <div>
      <MovieGrid fetchFn={getNowPlayingMovies} title="getNowPlayingMovies" />
    </div>
  );
}
