import { useState, useEffect } from 'react';
import Movie from '../../components/Movie/Movie';
import { useFetchDatabaseMovies } from '../useFetchDatabaseMovies';
import './Search.css';

function Search() {
  const [movieSearch, setMovieSearch] = useState('');
  const { movies, moviesLoadingError, isMoviesLoading } = useFetchDatabaseMovies(movieSearch);
  const [visibleCount, setVisibleCount] = useState(28);

  useEffect(() => {
    setVisibleCount(28); // reset quand la recherche change
  }, [movieSearch]);

  return (
    <div className="Search-container">
      <h1>Rechercher un film</h1>
      <input
        className="movie-search-input"
        type="text"
        placeholder="Rechercher un film"
        value={movieSearch}
        onChange={(event) => setMovieSearch(event.target.value)}
      />

      {isMoviesLoading && <p className="Discover-status">Chargement des films...</p>}

      {!isMoviesLoading && movies.length > 0 && (
        <>
          <div className="Discover-grid">
            {movies.slice(0, visibleCount).map((movie) => (
              <Movie key={movie.id} movie={movie} />
            ))}
          </div>
          {visibleCount < movies.length && (
            <button className="Load-more-btn" onClick={() => setVisibleCount(prev => prev + 28)}>
              Load more
            </button>
          )}
        </>
      )}

      {!isMoviesLoading && movies.length === 0 && moviesLoadingError === null && (
        <p className="movies-empty-message">Aucun film trouvé.</p>
      )}
      {moviesLoadingError !== null && (
        <div className="movies-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Search;