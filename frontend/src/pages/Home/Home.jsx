import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../../components/Movie/Movie';

function Home() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);
  const [isMoviesLoading, setIsMoviesLoading] = useState(false);
  const [visibleCount] = useState(20);

  useEffect(() => {
    async function fetchBaseMovies() {
      const moviesResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/movies`
      );

      return moviesResponse.data.movies || [];
    }

    async function fetchRecommendedMovies(userId) {
      const recommandationResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/recommandation/${userId}`
      );

      const recommandations = recommandationResponse.data.recommandation || [];

      if (recommandations.length === 0) {
        return [];
      }

      const moviesResponses = await Promise.all(
        recommandations.map((rec) =>
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/movies/${rec.movie_id}`
          )
        )
      );

      return moviesResponses.map((response, index) => ({
        ...(response.data.movie || response.data),
        score: recommandations[index].score,
        ranking: recommandations[index].ranking,
      }));
    }

    async function fetchMovies() {
      setIsMoviesLoading(true);
      setMoviesLoadingError(null);

      try {
        let moviesToDisplay = [];

        if (currentUser?.id) {
          moviesToDisplay = await fetchRecommendedMovies(currentUser.id);
        }

        if (moviesToDisplay.length === 0) {
          moviesToDisplay = await fetchBaseMovies();
        }

        setMovies(moviesToDisplay);
      } catch (error) {
        console.error(error);
        setMoviesLoadingError('Erreur lors du chargement des films.');
      } finally {
        setIsMoviesLoading(false);
      }
    }

    fetchMovies();
  }, [currentUser?.id]);

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
        <div className="movies-list">
          {movies.slice(0, visibleCount).map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
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
