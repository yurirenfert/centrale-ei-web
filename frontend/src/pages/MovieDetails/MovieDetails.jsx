import { useNavigate, useParams } from 'react-router-dom';
import MovieActions from '../../components/MovieActions/MovieActions';
import './MovieDetails.css';
import { useFetchMovieDetails } from './useFetchMovieDetails';

function MovieDetails() {
  const { movieId } = useParams();
  const { movie, movieLoadingError, isMovieLoading } = useFetchMovieDetails(movieId);

  if (isMovieLoading) {
    return <p className="movie-details-status">Chargement du film...</p>;
  }

  if (movieLoadingError !== null) {
    return <p className="movie-details-status">{movieLoadingError}</p>;
  }

  if (movie === null) {
    return <p className="movie-details-status">Film introuvable.</p>;
  }

  const backdropUrl = movie.background_path ?? null;
  const posterUrl = movie.poster_path ?? null;
  const releaseYear = movie.release_date?.slice(0, 4);
  const rating = typeof movie.globalrating === 'number' ? `${movie.globalrating.toFixed(1)}/10` : null;

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

            <MovieActions
              className="movie-details-actions"
              movieId={movie.id}
            />

            <div className="movie-details-meta">
              {releaseYear && <span>{releaseYear}</span>}
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