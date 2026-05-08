import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="navbar-logo-icon" style={{ width: '28px', height: '28px', fontSize: '14px' }}>
            IYF
          </div>
          <span>Alumni Hub</span>
        </div>

        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/terms">Terms</Link></li>
        </ul>

        <p className="footer-copyright">
          © {new Date().getFullYear()} IYF Alumni Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;