import { useState } from 'react';
import Movie from '../../components/Movie/Movie';
import { useFetchMovies } from '../Home/useFetchMovies';
import './Search.css';

function Search() {
  const [movieSearch, setMovieSearch] = useState('');
  const { movies, moviesLoadingError } = useFetchMovies(movieSearch);

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
      <div className="movies-list">
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
      {movies.length === 0 && moviesLoadingError === null && (
        <p className="movies-empty-message">Aucun film trouvé.</p>
      )}
      {moviesLoadingError !== null && (
        <div className="movies-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Search;
