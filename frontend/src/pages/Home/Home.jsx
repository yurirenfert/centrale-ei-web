import './Home.css';
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
