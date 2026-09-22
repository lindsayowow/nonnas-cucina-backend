import React from "react";
import { Link } from "react-router-dom";
import "../styles/nonna.css";

import NonnaNeutral from "../assets/nonna-neutral.png";
import NonnaWarning from "../assets/nonna-warning.png";
import NonnaOneIngredient from "../assets/nonna-one-ingredient.png";
import NonnaGoodStart from "../assets/nonna-good-start.png";
import NonnaEncouraging from "../assets/nonna-encouraging.png";
import NonnaAlmostThere from "../assets/nonna-almostThere.png";
import NonnaHappy from "../assets/nonna-happy.png";
import NonnaComplete from "../assets/nonna-complete.png";

import useDishBuilderContext from "../hooks/useDishBuilderContext";

// Mapping of visual states → image assets
const nonnaImages = {
  neutral: NonnaNeutral,
  "one-ingredient": NonnaOneIngredient,
  "good-start": NonnaGoodStart,
  encouraging: NonnaEncouraging,
  almostThere: NonnaAlmostThere,
  happy: NonnaHappy,
  complete: NonnaComplete,
  warning: NonnaWarning
};

// Presentational only -- nonnaState/nonnaMessage come from a single shared
// useNonna() call in the parent page (BuildADish.jsx). This component is
// rendered twice (desktop + mobile layouts), so it must NOT call useNonna
// itself, or every AI milestone request would fire twice.
export default function NonnaReaction({ nonnaState, nonnaMessage }) {
  const {
    showNonnaWarning,
    yourOrder
  } = useDishBuilderContext();

  const cartCount = yourOrder.length;

  // Cart message remains unchanged
  const cartMessage =
    cartCount === 0
      ? "Let’s get started with your order!"
      : (
        <>
          You have {cartCount} item(s) in{" "}
          <Link
            to="/cart"
            className="nonna-cart-link"
          >
            your cart
          </Link>.
        </>
      );

  // Image selection based on nonnaState
  const imageSrc =
    nonnaImages[nonnaState.state] ||
    NonnaNeutral;

  // NEW: Reduced‑motion detection
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // NEW: Disable shake animation if user prefers reduced motion
  const shakeClass =
    showNonnaWarning && !prefersReducedMotion
      ? "nonna-image--shake"
      : "";

  return (
    <div
      className={`card nonna ${showNonnaWarning
          ? "nonna--warning"
          : ""
        }`}
    >
      <h2 className="text-center">
        Verify Your Selections
      </h2>

      {/* 
        NEW: aria-live="polite" ensures screen readers announce Nonna's 
        changing messages without interrupting the user.
      */}
      <div className="nonna-speech-wrapper">
        <div
          className="nonna-speech-bubble"
          role="region"
          aria-label="Nonna message"
          aria-live="polite"
        >
          {nonnaMessage}
        </div>
      </div>

      <div className="nonna-image-wrapper">
        <img
          src={imageSrc}
          alt={`Nonna reacting: ${nonnaState.state}`}
          className={`nonna-image ${shakeClass}`}
          loading="eager"
          decoding="async"
          width="180"
          height="180"
        />
      </div>

      {/* 
        NEW: aria-live="polite" so screen readers announce cart updates 
        when ingredients are added/removed.
      */}
      <div
        className="nonna-cart-message"
        aria-live="polite"
      >
        {cartMessage}
      </div>
    </div>
  );
}
