import { useEffect, useState } from "react";
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

const KEY = "a593d3bc";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setErrorMessage("");
        setIsLoading(true);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        ).catch(() => {
          throw new Error("Something went wrong!");
        });

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search);
        setErrorMessage("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setErrorMessage(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 1) {
      setMovies([]);
      setErrorMessage("");
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

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
