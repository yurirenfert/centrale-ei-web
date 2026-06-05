import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TMDB_IMAGE_BASE_URL } from '../../constants/tmdb';
import { useFetchDatabaseMovies } from '../useFetchDatabaseMovies';
import './RatingOnboarding.css';

const REQUIRED_RATINGS_COUNT = 10;

function buildImageUrl(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${TMDB_IMAGE_BASE_URL}/w500${path}`;
}

function RatingOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = location.state?.userId ?? savedUser?.id;
  const displayName = location.state?.displayName ?? savedUser?.nickname;
  const { movies, moviesLoadingError, isMoviesLoading } =
    useFetchDatabaseMovies();
  const onboardingMovies = useMemo(
    () => movies.slice(0, REQUIRED_RATINGS_COUNT),
    [movies]
  );
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [ratingError, setRatingError] = useState(null);

  if (userId === undefined) {
    return (
      <main className="RatingOnboarding-page">
        <p className="RatingOnboarding-status">
          Cree un compte pour demarrer la selection.
        </p>
      </main>
    );
  }

  const currentMovie = onboardingMovies[currentMovieIndex];
  const progress = Math.min(currentMovieIndex + 1, REQUIRED_RATINGS_COUNT);

  const finishOnboarding = () => {
    localStorage.removeItem('ratingOnboardingUserId');
    navigate('/');
  };

  const saveRating = (ratingValue) => {
    if (currentMovie === undefined) {
      return;
    }

    setRatingError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/ratings/new`, {
        user_id: userId,
        movie_id: currentMovie.id,
        rating_value: ratingValue,
      })
      .then(() => {
        const nextMovieIndex = currentMovieIndex + 1;

        if (nextMovieIndex >= onboardingMovies.length) {
          finishOnboarding();
          return;
        }

        setCurrentMovieIndex(nextMovieIndex);
      })
      .catch((error) => {
        setRatingError("Impossible d'enregistrer ton avis.");
        console.error(error);
      });
  };

  if (isMoviesLoading) {
    return (
      <main className="RatingOnboarding-page">
        <p className="RatingOnboarding-status">Chargement de la selection...</p>
      </main>
    );
  }

  if (moviesLoadingError !== null || currentMovie === undefined) {
    return (
      <main className="RatingOnboarding-page">
        <p className="RatingOnboarding-error">
          Impossible de charger la selection de films.
        </p>
      </main>
    );
  }

  const posterUrl = buildImageUrl(currentMovie.poster_path);
  const releaseYear = currentMovie.release_date?.slice(0, 4);

  return (
    <main className="RatingOnboarding-page">
      <section className="RatingOnboarding-copy">
        <p className="RatingOnboarding-kicker">Bienvenue {displayName}</p>
        <h1>Construisons ton profil</h1>
        <p>Donne ton avis sur 10 films pour preparer les recommandations.</p>
      </section>

      <section className="RatingOnboarding-card">
        <p className="RatingOnboarding-progress">
          {progress} / {REQUIRED_RATINGS_COUNT}
        </p>

        {posterUrl !== null ? (
          <img
            className="RatingOnboarding-poster"
            src={posterUrl}
            alt={currentMovie.title}
          />
        ) : (
          <div className="RatingOnboarding-poster RatingOnboarding-placeholder">
            {currentMovie.title}
          </div>
        )}

        <div className="RatingOnboarding-details">
          <h2>{currentMovie.title}</h2>
          {releaseYear && <span>{releaseYear}</span>}
          <p>{currentMovie.overview || 'Aucun synopsis disponible.'}</p>
        </div>

        <div className="RatingOnboarding-actions">
          <button
            type="button"
            onClick={() => saveRating(-1)}
            aria-label="Pouce en bas"
          >
            👎
          </button>
          <button
            type="button"
            onClick={() => saveRating(1)}
            aria-label="Pouce en haut"
          >
            👍
          </button>
        </div>

        {ratingError !== null && (
          <p className="RatingOnboarding-error">{ratingError}</p>
        )}
      </section>
    </main>
  );
}

export default RatingOnboarding;
