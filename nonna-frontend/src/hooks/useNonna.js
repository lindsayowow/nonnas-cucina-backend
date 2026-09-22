// src/hooks/useNonna.js
import { useEffect, useRef, useState } from "react";
import { getNonnaMessage } from "../services/gemini";

// Messages shown immediately while the Gemini request runs in the background.
const happyMessages = [
  "Bellissima! Look at all those wonderful ingredients. Nonna is so proud!",
  "Mamma mia! What a beautiful collection of ingredients, cara mia!",
  "Bravissima! Your dish is becoming something very special!",
  "Oh, tesoro! Look at all that goodness. You're cooking like Nonna!",
  "Magnifico! So many delicious choices. I can already imagine the finished dish!"
];

// Returns an immediate local message so the interface never has to wait for Gemini.
function getInstantMessage(state, ingredientCount) {
  switch (state) {
    case "neutral":
      return "Choose your ingredients, dear!";

    case "warning":
      return "Oh, caro mio! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!";

    case "complete":
      return "Brava! You have all the ingredients you need. Nonna is very proud!";

    case "progress":
      switch (ingredientCount) {
        case 1:
          return "Ah, just getting started, cara mia! Keep choosing ingredients and we'll make something delicious!";
        case 2:
          return "Bene, bene! Now we're making a good start. Keep going, tesoro!";
        case 3:
          return "Ahh, now this pasta is taking shape! You're doing beautifully, mi amore!";
        case 4:
          return "Almost there, dolcezza! Just a little more and Nonna will be very happy!";
        default:
          return happyMessages[(ingredientCount - 5) % happyMessages.length];
      }

    default:
      return "Tutto bene! Your dish is coming together beautifully!";
  }
}

// NEW: Map ingredientCount → visual state used by NonnaReaction.jsx
function mapVisualState(ingredientCount, showNonnaWarning) {
  if (showNonnaWarning) return "warning";
  if (ingredientCount === 0) return "neutral";
  if (ingredientCount === 1) return "one-ingredient";
  if (ingredientCount === 2) return "good-start";
  if (ingredientCount === 3) return "encouraging";
  if (ingredientCount === 4) return "almostThere";
  if (ingredientCount >= 5) return "happy";
  return "neutral";
}

export default function useNonna({
  selectedIngredients,
  showNonnaWarning
}) {
  // Nonna's current message displayed in the speech bubble.
  const [nonnaMessage, setNonnaMessage] = useState(
    "Choose your ingredients, dear!"
  );

  // Nonna's current visual state.
  const [nonnaState, setNonnaState] = useState({
    state: "neutral",
    ingredientCount: 0
  });

  // Keeps track of the last Gemini request.
  const lastRequestedKeyRef = useRef(null);

  // Unique ID for Gemini requests.
  const requestIdRef = useRef(0);

  const ingredientCount = selectedIngredients.length;

  // List of ingredient names for Gemini.
  const ingredientNames = selectedIngredients.map(
    ingredient => ingredient.name
  );

  // ------------------------------
  // LOCAL STATE + INSTANT MESSAGE
  // ------------------------------
  useEffect(() => {
    // NEW: Compute correct visual state for images
    const visualState = mapVisualState(ingredientCount, showNonnaWarning);

    setNonnaState({
      state: visualState,
      ingredientCount
    });

    // Warning messages override everything
    if (showNonnaWarning) {
      setNonnaMessage(getInstantMessage("warning", ingredientCount));
      return;
    }

    // Neutral state (no ingredients)
    if (ingredientCount === 0) {
      setNonnaMessage(getInstantMessage("neutral", 0));
      return;
    }

    // Progress messages (instant)
    setNonnaMessage(getInstantMessage("progress", ingredientCount));
  }, [ingredientCount, showNonnaWarning]);

  // ------------------------------
  // GEMINI MILESTONE REQUESTS
  // ------------------------------
  useEffect(() => {
    if (showNonnaWarning) return;
    if (ingredientCount === 0) return;

    const isMilestone =
      ingredientCount === 1 ||
      ingredientCount === 3 ||
      ingredientCount === 5;

    if (!isMilestone) return;

    const requestKey = [
      "progress",
      ingredientCount,
      ...ingredientNames
    ].join("|");

    if (lastRequestedKeyRef.current === requestKey) {
      return;
    }

    lastRequestedKeyRef.current = requestKey;

    const requestId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const message = await getNonnaMessage({
          state: "progress",
          ingredientCount,
          selectedIngredients
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (message) {
          setNonnaMessage(message);
        }
      } catch {
        // fallback to instant message
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [ingredientCount, ingredientNames.join("|"), showNonnaWarning]);

  return {
    nonnaState,
    nonnaMessage
  };
}
