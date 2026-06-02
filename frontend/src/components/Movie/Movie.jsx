import './Movie.css';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Movie({ movie }) {
  return (
    <article className="movie-card">
      {movie.poster_path !== null && (
        <img
          className="movie-poster"
          src={`${POSTER_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
        />
      )}
      <div>
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-release-date">
          Date de sortie : {movie.release_date}
        </p>
      </div>
    </article>
  );
}

export default Movie;
