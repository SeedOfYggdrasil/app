import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../css/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ onNew, onExport, onSave, onLoad, onLogout }) => {
  const [menuActive, setMenuActive] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && menuActive) {
        setMenuActive(false);
      }
    };
    window.addEventListener('mouseup', handleClickOutside);
    return () => window.removeEventListener('mouseup', handleClickOutside);
  }, [menuActive]);

  const handleAction = (action) => {
    if (action) action();
    setMenuActive(false);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="container">
        <div className="navbar-header">
          <button className="navbar-toggler" onClick={toggleMenu} aria-label="Toggle navigation">
            <span /><span /><span />
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAction(onNew); }} aria-label="Noted Home - New Document">
            <img src={logo} alt="Noted Logo" />
          </a>
        </div>
        <div className={`navbar-menu ${menuActive ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li><button onClick={() => handleAction(onNew)}>New</button></li>
            <li><button onClick={() => handleAction(onSave)}>Save</button></li>
            <li><button onClick={() => handleAction(onLoad)}>Load</button></li>
            <li><button onClick={() => handleAction(onExport)}>Export</button></li>
            <li><button onClick={() => handleAction(onLogout)}>Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onNew: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;