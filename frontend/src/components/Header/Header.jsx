import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const logout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/'; 
};

  return (
    <header className="Header-container">
      <Link className="Logo-link" to="/" aria-label="Accueil Flouflix">
        <img className="Header-logo" src="/flouflix-logo.svg" alt="Flouflix" />
      </Link>

      <nav className="Header-nav" aria-label="Navigation principale">
        <NavLink className="Header-link" to="/">
          Accueil
        </NavLink>

        <NavLink className="Header-link" to="/discover">
          Discover
        </NavLink>

        <NavLink className="Header-link" to="/search">
          Rechercher
        </NavLink>
        </nav>

        {currentUser ? (
          <><div className="Header-nav-right">
            <span className="Header-user-name">{currentUser.nickname}</span>

            <button type="button" className="Header-logout-button" onClick={logout}>
              Déconnexion
            </button>
            </div>
          </>
        ) : (<div className="Header-nav-right">
          <NavLink className="Header-link" to="/login">
            Connexion
          </NavLink>
          </div>
        )}
    </header>
  );
};

export default Header;
