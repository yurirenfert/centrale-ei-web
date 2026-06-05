import { useNavigate, useParams } from 'react-router-dom';
import MovieActions from '../../components/MovieActions/MovieActions';
import { TMDB_IMAGE_BASE_URL } from '../../constants/tmdb';
import './MovieDetails.css';
import { useFetchMovieDetails } from './useFetchMovieDetails';

function formatRuntime(runtime) {
  if (typeof runtime !== 'number' || runtime <= 0) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours} h ${minutes} min`;
}

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const { movie, movieLoadingError, isMovieLoading } =
    useFetchMovieDetails(movieId);

  if (isMovieLoading) {
    return <p className="movie-details-status">Chargement du film...</p>;
  }

  if (movieLoadingError !== null) {
    return <p className="movie-details-status">{movieLoadingError}</p>;
  }

  if (movie === null) {
    return <p className="movie-details-status">Film introuvable.</p>;
  }

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 4);
  const runtime = formatRuntime(movie.runtime);

  const rating =
    typeof movie.vote_average === 'number'
      ? `${movie.vote_average.toFixed(1)}/10`
      : null;

  return (
    <main className="movie-details-page">
      {backdropUrl !== null && (
        <img
          className="movie-details-backdrop"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
        />
      )}

      <div className="movie-details-overlay" />

      <section className="movie-details-content">
        <button
          type="button"
          className="movie-details-back-link"
          onClick={() => navigate(-1)}
        >
          Retour
        </button>

        <div className="movie-details-main">
          {posterUrl !== null && (
            <img
              className="movie-details-poster"
              src={posterUrl}
              alt={movie.title}
            />
          )}

          <div className="movie-details-copy">
            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-details-tagline">{movie.tagline}</p>
            )}

            <MovieActions
              className="movie-details-actions"
              movieId={movie.id}
            />

            <div className="movie-details-meta">
              {releaseYear && <span>{releaseYear}</span>}
              {runtime && <span>{runtime}</span>}
              {rating && <span>{rating}</span>}
              <span>HD</span>
            </div>

            <p className="movie-details-overview">
              {movie.overview || 'Aucun synopsis disponible.'}
            </p>

            {movie.genres?.length > 0 && (
              <p className="movie-details-genres">
                {movie.genres.map((genre) => genre.name).join('  |  ')}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
