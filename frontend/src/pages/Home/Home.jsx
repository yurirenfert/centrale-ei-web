import './Home.css';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Movie from '../../components/Movie/Movie';
import { useFetchDatabaseMovies } from '../useFetchDatabaseMovies.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const { movies, moviesLoadingError } = useFetchDatabaseMovies('');
  const navigate = useNavigate();
  const topMovie = movies.reduce((best, m) => 
      (m.popularity > (best?.popularity ?? 0) ? m : best), null
    );
  const [visibleCount, setVisibleCount] = useState(20);
  
  const [movieSearch, setMovieSearch] = useState('');
  const { userId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log('currentUser in Home:', userId);

  const { movies, moviesLoadingError } = useFetchMovies(movieSearch, userId);

  return (
    <div className="Home-container">

      {topMovie && (
        <div className="Hero" style={{ backgroundImage: `url(${topMovie.background_path})` }}>
          <div className="Hero-overlay" />
          <div className="Hero-content">
            <span className="Hero-badge">🏆 Top 1 · Le plus populaire</span>
            <h1 className="Hero-title">{topMovie.title}</h1>
            <p className="Hero-overview">{topMovie.overview}</p>
            <br />
            <button className='mon-bouton' onClick={() => navigate('https://www.youtube.com/watch?v=p6rbOYH2tGY')}>Play Now</button>
          </div>
        </div>
      )}

      <h2>Films populaires</h2>
      {currentUser ? (
        <h1>Recommandations pour {currentUser.nickname}</h1>
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
        {movies.slice(0, visibleCount).map((movie) => (
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
