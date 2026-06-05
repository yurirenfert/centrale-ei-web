import './Home.css';
import { useState } from 'react';
import Movie from '../../components/Movie/Movie';
import { useFetchDatabaseMovies } from '../useFetchDatabaseMovies.js';

function Home() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [visibleCount, setVisibleCount] = useState(20);

  const { movies, moviesLoadingError, isMoviesLoading } =
    useFetchDatabaseMovies('', currentUser?.id);
  console.log(currentUser);
  const topMovie = movies.reduce(
    (best, m) => (m.popularity > (best?.popularity ?? 0) ? m : best),
    null
  );

  return (
    <div className="Home-container">
      {topMovie && (
        <div
          className="Hero"
          style={{ backgroundImage: `url(${topMovie.background_path})` }}
        >
          <div className="Hero-overlay" />
          <div className="Hero-content">
            <span className="Hero-badge">🏆 Top 1 · Le plus populaire</span>
            <h1 className="Hero-title">{topMovie.title}</h1>
            <p className="Hero-overview">{topMovie.overview}</p>
            <br />
            <button
              className="mon-bouton"
              onClick={() =>
                window.open(
                  'https://www.youtube.com/watch?v=p6rbOYH2tGY',
                  '_blank'
                )
              }
            >
              Play Now
            </button>
          </div>
        </div>
      )}

      {currentUser ? (
        <h2>Recommandations pour {currentUser.nickname}</h2>
      ) : (
        <h2>Films populaires</h2>
      )}

      {!currentUser && (
        <p>Connecte-toi pour avoir des recommandations personnalisées.</p>
      )}

      {isMoviesLoading && <p className="movies-empty-message">Chargement...</p>}

      {!isMoviesLoading && movies.length > 0 && (
        <>
          <div className="movies-list">
            {movies.slice(0, visibleCount).map((movie) => (
              <Movie key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {!isMoviesLoading &&
        movies.length === 0 &&
        moviesLoadingError === null && (
          <p className="movies-empty-message">Aucun film trouvé.</p>
        )}

      {moviesLoadingError !== null && (
        <div className="movies-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Home;
