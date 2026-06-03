import { useState } from 'react';
import './Home.css';
import Movie from '../../components/Movie/Movie';
import { useFetchMovies } from './useFetchMovies';

function Home() {
  const [movieSearch, setMovieSearch] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const { movies, moviesLoadingError } = useFetchMovies(
    movieSearch,
    currentUser
  );

  return (
    <div className="Home-container">
      {currentUser ? (
        <h1>
          Recommandations pour {currentUser.nickname || currentUser.firstname}
        </h1>
      ) : (
        <h1>Films populaires</h1>
      )}

      {!currentUser && (
        <p>Connecte-toi pour avoir des recommandations personnalisées.</p>
      )}

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
