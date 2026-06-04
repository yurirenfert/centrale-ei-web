import { useState, useEffect } from 'react'; // ✅ ajouté
import Movie from '../../components/Movie/Movie';
import './Discover.css';
import { useFetchDatabaseMovies } from '../useFetchDatabaseMovies';

function Discover() {
  const { movies, moviesLoadingError, isMoviesLoading } = useFetchDatabaseMovies();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const langues = ["toutes", ...new Set(movies.map((movie) => movie.language))];
  const [languesSelectionnees, setLanguesSelectionnees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genresSelectionnes, setGenresSelectionnes] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genres = [...new Set(movies.flatMap(m => m.genres?.map(g => g.name) ?? []))].sort();
  const [visibleCount, setVisibleCount] = useState(28);

  
  function toggleLangue(langue) {
  setLanguesSelectionnees(prev =>
    prev.includes(langue) ? prev.filter(l => l !== langue) : [...prev, langue]
  );
}
  function toggleGenre(genre) {
    setGenresSelectionnes(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  } 
  useEffect(() => {
    let result = movies;
    if (languesSelectionnees.length > 0) {
      result = result.filter(m => languesSelectionnees.includes(m.language));
    }
    if (genresSelectionnes.length > 0) {
      result = result.filter(m =>
        m.genres?.some(g => genresSelectionnes.includes(g.name))
      );
    }
    setFilteredMovies(result);
    setVisibleCount(28);
  }, [languesSelectionnees, genresSelectionnes, movies]);

  useEffect(() => {
  console.log(movies[0]);
}, [movies]);
  return (
    <main className="Discover-container">
      <div className="Discover-header">
        <h1>Discover</h1>
        <p>{movies.length} films dans la DB</p>
      </div>
      <div className="Discover-filters">
      <div className="Filter-group">
        <div className="Filter-dropdown-wrapper">
          <button className="Filter-dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Langue ▾
          </button>
          {dropdownOpen && (
            <div className="Filter-dropdown">
              {langues.filter(l => l !== "toutes").map(langue => (
                <label key={langue} className="Filter-dropdown-item">
                  <input
                    type="checkbox"
                    checked={languesSelectionnees.includes(langue)}
                    onChange={() => toggleLangue(langue)}
                  />
                  {langue.toUpperCase()}
                </label>
              ))}
            </div>
          )}
        </div>

    <div className="Filter-tags">
      {languesSelectionnees.map(langue => (
        <span key={langue} className="Filter-tag">
          {langue.toUpperCase()}
          <button onClick={() => toggleLangue(langue)}>✕</button>
        </span>
      ))}
    </div>

  </div>
  <div className="Filter-group">
  <div className="Filter-genre-list">
    {genres.map(genre => (
      <button
        key={genre}
        className={`Filter-genre-btn ${genresSelectionnes.includes(genre) ? 'active' : ''}`}
        onClick={() => toggleGenre(genre)}
      >
        {genre}
      </button>
    ))}
  </div>
  <div className="Filter-tags">
    {genresSelectionnes.map(genre => (
      <span key={genre} className="Filter-tag">
        {genre}
        <button onClick={() => toggleGenre(genre)}>✕</button>
      </span>
    ))}
  </div>
</div>
</div>

      {isMoviesLoading && <p className="Discover-status">Chargement des films...</p>}

      {!isMoviesLoading && filteredMovies.length > 0 && (
  <>
    <div className="Discover-grid">
      {filteredMovies.slice(0, visibleCount).map((movie) => (
        <Movie key={movie.id} movie={movie} />
      ))}
    </div>
    {visibleCount < filteredMovies.length && (
      <button className="Load-more-btn" onClick={() => setVisibleCount(prev => prev + 28)}>
        Load more
      </button>
    )}
  </>
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