import './Home.css';
import Movie from '../../components/Movie/Movie';
import { useFetchMovies } from './useFetchMovies';

function Home() {
  const { movies, moviesLoadingError } = useFetchMovies('');

  return (
    <div className="Home-container">
      <h1>Films populaires</h1>
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
