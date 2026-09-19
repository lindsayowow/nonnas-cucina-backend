import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/nonna.css';

import NonnaNeutral from '../assets/nonna-neutral.png';
import NonnaWarning from '../assets/nonna-warning.png';
import NonnaOneIngredient from '../assets/nonna-one-ingredient.png';
import NonnaGoodStart from '../assets/nonna-good-start.png';
import NonnaEncouraging from '../assets/nonna-encouraging.png';
import NonnaAlmostThere from '../assets/nonna-almostThere.png';
import NonnaHappy from '../assets/nonna-happy.png';
import NonnaComplete from '../assets/nonna-complete.png';
import nonnaStates from "../data/nonna.json";
import useDishBuilderContext from "../hooks/useDishBuilderContext";

// included for future feature
import NonnaSpecial from '../assets/nonna-special.png';

const nonnaImages = {
  neutral: NonnaNeutral,
  "one-ingredient": NonnaOneIngredient,
  "good-start": NonnaGoodStart,
  encouraging: NonnaEncouraging,
  almostThere: NonnaAlmostThere,
  happy: NonnaHappy,
  complete: NonnaComplete,
  // "special-dish": NonnaSpecial,  -- future use
  warning: NonnaWarning
};

function getNonnaState({ ingredientCount, selectedIngredients, showNonnaWarning }) {
  if (showNonnaWarning) {
    return nonnaStates.find(s => s.state === "warning");
  }

  const requiredCategories = ["protein", "veggie", "noodle", "sauce", "topping"];
  const selectedCategories = new Set(selectedIngredients.map(ing => ing.category));
  const hasAllCategories = requiredCategories.every(cat => selectedCategories.has(cat));

  if (hasAllCategories) {
    return nonnaStates.find(s => s.state === "complete");
  }

  const matchByCount = nonnaStates.find(s => s.ingredientCount === ingredientCount);
  if (matchByCount) return matchByCount;

  if (ingredientCount > 5) {
    return nonnaStates.find(s => s.state === "happy");
  }

  return nonnaStates.find(s => s.state === "neutral");
}

export default function NonnaReaction() {
  const {
    selectedIngredients,
    showNonnaWarning,
    yourOrder
  } = useDishBuilderContext();

  const ingredientCount = selectedIngredients.length;
  const nonnaState = getNonnaState({
    ingredientCount,
    selectedIngredients,
    showNonnaWarning
  });

  const cartCount = yourOrder.length;

  const cartMessage =
    cartCount === 0
      ? "Let’s get started with your order!"
      : (
        <>
          You have {cartCount} item(s) in your{" "}
          <Link to="/cart" className="nonna-cart-link">
            cart
          </Link>.
        </>
      );

  // example of conditional rendering
  const imageSrc = showNonnaWarning
    ? NonnaWarning
    : nonnaImages[nonnaState.state] || NonnaNeutral;

  return (
    <div className={`card nonna ${showNonnaWarning ? "nonna--warning" : ""}`}>
      <h2 className="text-center">Verify Your Selections</h2>

      <div className="nonna-speech-wrapper">
        <div
          className="nonna-speech-bubble"
          role="region"
          aria-label="Nonna message"
        >
          {nonnaState.message}
        </div>
      </div>

      <div className="nonna-image-wrapper">
        <img
          src={imageSrc}
          // alt text on image for accessibility
          alt="Nonna reacting"
          className={`nonna-image ${showNonnaWarning ? "nonna-image--shake" : ""}`}
          loading="eager"
          decoding="async"
          fetchpriority="high"
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
// src/components/NonnaReaction.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/nonna.css';

import NonnaNeutral from '../assets/nonna-neutral.png';
import NonnaWarning from '../assets/nonna-warning.png';
import NonnaOneIngredient from '../assets/nonna-one-ingredient.png';
import NonnaGoodStart from '../assets/nonna-good-start.png';
import NonnaEncouraging from '../assets/nonna-encouraging.png';
import NonnaAlmostThere from '../assets/nonna-almostThere.png';
import NonnaHappy from '../assets/nonna-happy.png';
import NonnaComplete from '../assets/nonna-complete.png';
import nonnaStates from "../data/nonna.json";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import { getNonnaMessage } from "../services/gemini";

// included for future feature
import NonnaSpecial from '../assets/nonna-special.png';

const nonnaImages = {
  neutral: NonnaNeutral,
  "one-ingredient": NonnaOneIngredient,
  "good-start": NonnaGoodStart,
  encouraging: NonnaEncouraging,
  almostThere: NonnaAlmostThere,
  happy: NonnaHappy,
  complete: NonnaComplete,
  // "special-dish": NonnaSpecial,  -- future use
  warning: NonnaWarning
};

function getNonnaState({ ingredientCount, selectedIngredients, showNonnaWarning }) {
  if (showNonnaWarning) {
    return nonnaStates.find(s => s.state === "warning");
  }

  const requiredCategories = ["protein", "veggie", "noodle", "sauce", "topping"];
  const selectedCategories = new Set(selectedIngredients.map(ing => ing.category));
  const hasAllCategories = requiredCategories.every(cat => selectedCategories.has(cat));

  if (hasAllCategories) {
    return nonnaStates.find(s => s.state === "complete");
  }

  const matchByCount = nonnaStates.find(s => s.ingredientCount === ingredientCount);
  if (matchByCount) return matchByCount;

  if (ingredientCount > 5) {
    return nonnaStates.find(s => s.state === "happy");
  }

  return nonnaStates.find(s => s.state === "neutral");
}

export default function NonnaReaction() {
  const {
    selectedIngredients,
    showNonnaWarning,
    yourOrder
  } = useDishBuilderContext();

  const [nonnaMessage, setNonnaMessage] = useState("Choose your ingredients, dear!");

  const ingredientCount = selectedIngredients.length;
  const nonnaState = getNonnaState({
    ingredientCount,
    selectedIngredients,
    showNonnaWarning
  });

  const cartCount = yourOrder.length;

  const cartMessage =
    cartCount === 0
      ? "Let’s get started with your order!"
      : (
        <>
          You have {cartCount} item(s) in your{" "}
          <Link to="/cart" className="nonna-cart-link">
            cart
          </Link>.
        </>
      );

  const imageSrc = showNonnaWarning
    ? NonnaWarning
    : nonnaImages[nonnaState.state] || NonnaNeutral;

  useEffect(() => {
    let isCancelled = false;

    async function fetchMessage() {
      // Neutral stays hard-coded
      if (nonnaState.state === "neutral") {
        setNonnaMessage("Choose your ingredients, dear!");
        return;
      }

      // Warning can be hard-coded or AI; here we keep it simple
      if (nonnaState.state === "warning") {
        setNonnaMessage("Oh no! That ingredient is not compatible with your diet!");
        return;
      }

      try {
        const msg = await getNonnaMessage({
          state: nonnaState.state,
          ingredientCount,
          selectedIngredients
        });

        if (!isCancelled) {
          setNonnaMessage(msg);
        }
      } catch {
        if (!isCancelled) {
          setNonnaMessage("Bene, bene! Your dish is coming together nicely!");
        }
      }
    }

    fetchMessage();

    return () => {
      isCancelled = true;
    };
  }, [nonnaState.state, ingredientCount, selectedIngredients, showNonnaWarning]);

  return (
    <div className={`card nonna ${showNonnaWarning ? "nonna--warning" : ""}`}>
      <h2 className="text-center">Verify Your Selections</h2>

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
          className={`nonna-image ${showNonnaWarning ? "nonna-image--shake" : ""}`}
          loading="eager"
          decoding="async"
          fetchpriority="high"
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
