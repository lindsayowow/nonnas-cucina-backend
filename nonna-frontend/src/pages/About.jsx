import React from "react";
import Bio from "../components/Bio";
import Form from "../components/Form";
import "../styles/about.css";

export default function About() {
  return (
    <section
      className="about-container"
      role="region"
      aria-labelledby="about-title"
    >
      {/* Visually hidden heading for accessibility */}
      <h1 id="about-title" className="visually-hidden">
        About Nonna’s Cucina
      </h1>

      <Bio />
      <Form />
    </section>
  );
}
