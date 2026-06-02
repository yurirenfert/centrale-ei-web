import { useState } from 'react';
import './Home.css';
import Movie from '../../components/Movie/Movie';
import { useFetchMovies } from './useFetchMovies';

function Home() {
  const [movieSearch, setMovieSearch] = useState('');
  const { movies, moviesLoadingError } = useFetchMovies(movieSearch);

  return (
    <div className="Home-container">
      <h1>Films populaires</h1>
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

export default Home;
