import { useEffect, useState } from "react";
import { MovieList } from "./Components/MovieList.js";
import { WatchedList } from "./Components/WatchedList.js";
import { WatchedSummary } from "./Components/WatchedSummary.js";
import { SelectedMovie } from "./Components/SelectedMovie.js";
import { ErrorMessage } from "./Components/ErrorMessage.js";
import { Loader } from "./Components/Loader.js";
import { Box } from "./Components/Box.js";
import { Search } from "./Components/Search.js";
import { useMovies } from "./Hooks/useMovies.js";
import { useLocalStorageState } from "./Hooks/useLocalStorageState.js";

export const KEY = "806c9fa0";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//////////////////////////////////////////////////////////

// http://www.omdbapi.com/?i=tt3896198&apikey=806c9fa0

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  //CUSTOM HOOK
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddMovie(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              key={selectedId}
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatched={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteMovie={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

//////////////////////////////////////////////////////////

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
