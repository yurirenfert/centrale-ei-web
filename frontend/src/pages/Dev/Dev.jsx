import { Link } from 'react-router-dom';
import './Dev.css';

function Dev() {
  return (
    <main className="Dev-container">
      <h1>Dev</h1>
      <div className="Dev-actions">
        <Link className="Dev-link" to="/movies/new">
          Ajouter un film
        </Link>
        <Link className="Dev-link" to="/users">
          Users
        </Link>
      </div>
    </main>
  );
}

export default Dev;
