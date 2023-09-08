import { useState } from "react";
import NavBar from "./Components/NavBar-Components/NavBar";
import Search from "./Components/NavBar-Components/Search";
import NumResults from "./Components/NavBar-Components/NumResults";
import Main from "./Components/Main-Components/Main";
import MovieList from "./Components/Main-Components/MovieList";
import Box from "./Components/Main-Components/Box";
import WatchedMoviesList from "./Components/Main-Components/WatchedMoviesList";
import MovieDetails from "./Components/Main-Components/MovieDetails";
import WatchedSummary from "./Components/Main-Components/WatchedSummary";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";

import useMovies from "./CustomHooks/useMovies.js";
import useLocalStorageState from "./CustomHooks/useLocalStorageState.js";

// const KEY = "a593d3bc";

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, errorMessage } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleMovieDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {errorMessage && <ErrorMessage message={errorMessage} />}
          {!isLoading && !errorMessage && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onWatchedMovie={handleWatchedMovie}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteMovie={handleMovieDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
