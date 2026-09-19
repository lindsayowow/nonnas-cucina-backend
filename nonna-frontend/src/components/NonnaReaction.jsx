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
import useNonna from "../hooks/useNonna";

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

export default function NonnaReaction() {
  const {
    selectedIngredients,
    showNonnaWarning,
    yourOrder
  } = useDishBuilderContext();

  const {
    nonnaState,
    nonnaMessage
  } = useNonna({
    selectedIngredients,
    showNonnaWarning
  });

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
