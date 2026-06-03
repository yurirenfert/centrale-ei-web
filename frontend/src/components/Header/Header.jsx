import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
        <NavLink className="Header-link" to="/login">
          Connexion
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
