import { Link } from 'react-router-dom';
import MovieActions from '../MovieActions/MovieActions';
import { TMDB_IMAGE_BASE_URL } from '../../constants/tmdb';
import './Movie.css';

function Movie({ movie }) {
  const releaseYear = movie.release_date?.slice(0, 4) || 'Date inconnue';
  const rating =
    typeof movie.vote_average === 'number'
      ? `${movie.vote_average.toFixed(1)}/10`
      : 'Non note';
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : null;
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}/w780${movie.backdrop_path}`
    : posterUrl;

  return (
    <Link
      className="movie-card"
      to={`/movies/${movie.id}`}
      aria-label={`Voir les details de ${movie.title}`}
    >
      {posterUrl !== null ? (
        <img
          className="movie-poster"
          src={posterUrl}
          alt={movie.title}
        />
      ) : (
        <div className="movie-poster movie-poster-placeholder">
          {movie.title}
        </div>
      )}

      <div className="movie-preview">
        {backdropUrl !== null && (
          <img
            className="movie-backdrop"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="movie-preview-content">
          <MovieActions />
          <h2 className="movie-title">{movie.title}</h2>
          <div className="movie-meta">
            <span>{releaseYear}</span>
            <span>{rating}</span>
            <span>HD</span>
          </div>
          <p className="movie-overview">
            {movie.overview || 'Aucun synopsis disponible.'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Movie;
