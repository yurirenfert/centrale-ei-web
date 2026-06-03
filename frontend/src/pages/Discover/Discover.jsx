import Movie from '../../components/Movie/Movie';
import './Discover.css';
import { useFetchDatabaseMovies } from './useFetchDatabaseMovies';

function Discover() {
  const { movies, moviesLoadingError, isMoviesLoading } =
    useFetchDatabaseMovies();

  return (
    <main className="Discover-container">
      <div className="Discover-header">
        <h1>Discover</h1>
        <p>{movies.length} films dans la DB</p>
      </div>

      {isMoviesLoading && (
        <p className="Discover-status">Chargement des films...</p>
      )}

      {!isMoviesLoading && movies.length > 0 && (
        <div className="Discover-grid">
          {movies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!isMoviesLoading && movies.length === 0 && moviesLoadingError === null && (
        <p className="Discover-status">Aucun film en DB.</p>
      )}

      {moviesLoadingError !== null && (
        <p className="Discover-error">{moviesLoadingError}</p>
      )}
    </main>
  );
}

export default Discover;
