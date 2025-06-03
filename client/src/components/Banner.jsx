import { } from 'react';
import logo from '../assets/logo.png';
import '../css/Banner.css';

const Banner = () => {

return (
 <div className="banner-container">
  <div className="grad-bar"></div>
  <nav className="banner">
    <img src={logo} alt="Noted" />
    <div className="menu-toggle" id="mobile-menu">
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
    <ul className="nav no-search">
      <li className="nav-item"><a href="#">Dashboard</a></li>
      <li className="nav-item"><a href="#">Docs</a></li>
      <li className="nav-item"><a href="#">API</a></li>
      <li className="nav-item"><a href="#">Settings</a></li>
      <li className="nav-item"><a href="#">Sign Out</a></li>
    </ul>
  </nav>
  </div>
 );
};

export default Banner;