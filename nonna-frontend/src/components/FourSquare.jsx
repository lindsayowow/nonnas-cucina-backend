import React from 'react';
import '../styles/four-square.css';
import squareData from "../data/squareData.json";

export default function FourSquare() {
  return (
    <div className="foursquare-grid readable-font">
      {squareData.map((item, index) => (
        // region landmark for screen readers
        <div
          key={index}
          className="square"
          role="region"
          aria-labelledby={`square-title-${index}`}
        >
          {/* decorative icon hidden from screen readers */}
          <p className="icon" aria-hidden="true">{item.icon}</p>

          <h4 id={`square-title-${index}`}>{item.title}</h4>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
