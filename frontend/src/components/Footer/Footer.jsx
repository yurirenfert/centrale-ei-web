import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="Footer-container">
      <Link className="Footer-link" to="/about">
        About
      </Link>
    </footer>
  );
};

export default Footer;
