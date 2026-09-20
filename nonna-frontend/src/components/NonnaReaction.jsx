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

  const imageSrc =
    nonnaImages[nonnaState.state] ||
    NonnaNeutral;

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

      <div className="nonna-speech-wrapper">
        <div
          className="nonna-speech-bubble"
          role="region"
          aria-label="Nonna message"
        >
          {nonnaMessage}
        </div>
      </div>

      <div className="nonna-image-wrapper">
        <img
          src={imageSrc}
          alt="Nonna reacting"
          className={`nonna-image ${showNonnaWarning
              ? "nonna-image--shake"
              : ""
            }`}
          loading="eager"
          decoding="async"
          width="180"
          height="180"
        />
      </div>

      <div className="nonna-cart-message">
        {cartMessage}
      </div>
    </div>
  );
}
