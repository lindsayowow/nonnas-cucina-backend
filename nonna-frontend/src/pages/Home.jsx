import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import NonnaHome from '../assets/Nonna_Home.png';
import FourSquare from '../components/FourSquare';

export default function Home() {
  return (
    // main landmark for screen readers
    <main className="hero" aria-labelledby="home-title">
      <div className="hero-row">
        <div className="hero-column hero-left">
          {/* decorative text hidden from screen readers */}
          <p className="mangia left top" aria-hidden="true">Mangia</p>
          <p className="mangia left bottom" aria-hidden="true">Mangia</p>
        </div>

        <div className="hero-column hero-center">
          <div className="nonna-wrapper">
            <img
              src={NonnaHome}
              // alt text on image for accessibility
              alt="Nonna is smiling at a countertop with hearts surrounding her head"
              className="logononna"
            />
          </div>
        </div>

        <div className="hero-column hero-right">
          {/* decorative text hidden from screen readers */}
          <p className="mangia right top" aria-hidden="true">Mangia</p>
          <p className="mangia right bottom" aria-hidden="true">Mangia</p>
        </div>
      </div>

      {/* h1 used as accessible page title */}
      <h1 id="home-title" className="nonna-font">Benvenuti a Nonna's Cucina!</h1>

      <h2>Build safe, delicious dishes that meet you and your family's dietary needs</h2>

      <Link
        to="/buildadish"
        className="buildbutton"
        aria-label="Start building your dish" // accessible name
      >
        <button className="btn">Start Building Your Dish</button>
      </Link>

      <FourSquare />
    </main>
  );
}
