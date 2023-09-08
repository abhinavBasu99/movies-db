import { useState, useEffect } from "react";

const KEY = "a593d3bc";

export default function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setErrorMessage("");
        setIsLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
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

    // handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, errorMessage };
}
