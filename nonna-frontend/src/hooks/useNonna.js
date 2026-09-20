import { useEffect, useRef, useState } from "react";
import { getNonnaMessage } from "../services/gemini";

// Messages shown immediately while the Gemini request runs in the background.
const happyMessages = [
  "Bellissima! Look at all those wonderful ingredients. Nonna is so proud!",
  "Mamma mia! What a beautiful collection of ingredients, cara mia!",
  "Bravissima! Your dish is becoming something very special!",
  "Oh, tesoro! Look at all that goodness. You're cooking like Nonna!",
  "Bellissima! So many delicious choices. I can already imagine the finished dish!"
];

// Returns an immediate local message so the interface never has to wait for Gemini.
function getInstantMessage(state, ingredientCount) {
  switch (state) {
    case "neutral":
      return "Choose your ingredients, dear!";

    case "warning":
      return "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!";

    case "complete":
      return "Bellissima! You have all the ingredients you need. Nonna is very proud!";

    case "progress":
      switch (ingredientCount) {
        case 1:
          return "Ah, just getting started, cara mia! Keep choosing ingredients and we'll make something delicious!";

        case 2:
          return "Bene, bene! Now we're making a good start. Keep going, tesoro!";

        case 3:
          return "Ahh, now this pasta is taking shape! You're doing beautifully, cara mia!";

        case 4:
          return "Almost there, tesoro! Just a little more and Nonna will be very happy!";

        default:
          // Rotate through different messages instead of repeating the same
          // message for every selection after five ingredients.
          return happyMessages[
            (ingredientCount - 5) % happyMessages.length
          ];
      }

    default:
      return "Bene, bene! Your dish is coming together beautifully!";
  }
}

// IMPORTANT: call this hook exactly ONCE per page (e.g. in BuildADish.jsx),
// not inside every visual NonnaReaction instance. Each instance calling
// useNonna independently would send its own duplicate Gemini requests at
// every milestone -- lift the result and pass nonnaState/nonnaMessage down
// as props to any additional (desktop/mobile) NonnaReaction renders instead.
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

  /*
   * Keeps track of the last Gemini request.
   *
   * React StrictMode can run useEffect twice during development.
   * This ref prevents the exact same request from being sent twice.
   */
  const lastRequestedKeyRef = useRef(null);

  /*
   * Gives every Gemini request a unique ID.
   *
   * If the user changes their selections while Gemini is still thinking,
   * an older response will not be allowed to replace the newer message.
   */
  const requestIdRef = useRef(0);

  const ingredientCount = selectedIngredients.length;

  // Create a simple list of ingredient names for the Gemini request.
  const ingredientNames = selectedIngredients.map(
    ingredient => ingredient.name
  );

  /*
   * Update Nonna's local state and immediate message.
   *
   * This happens instantly and does not wait for Gemini.
   */
  useEffect(() => {
    let state = "progress";

    if (showNonnaWarning) {
      state = "warning";
    } else if (ingredientCount === 0) {
      state = "neutral";
    } else if (ingredientCount >= 5) {
      state = "happy";
    }

    setNonnaState({
      state,
      ingredientCount
    });

    // Warning messages are handled locally.
    if (showNonnaWarning) {
      setNonnaMessage(
        getInstantMessage("warning", ingredientCount)
      );
      return;
    }

    // The initial state is handled locally.
    if (ingredientCount === 0) {
      setNonnaMessage(
        getInstantMessage("neutral", 0)
      );
      return;
    }

    // Always show an immediate response.
    setNonnaMessage(
      getInstantMessage("progress", ingredientCount)
    );
  }, [ingredientCount, showNonnaWarning]);

  /*
   * Gemini enhancement.
   *
   * We do NOT call Gemini for every ingredient selection.
   *
   * Gemini is only called at meaningful milestones:
   *   1 ingredient
   *   3 ingredients
   *   5 ingredients
   *
   * All other messages are handled instantly on the frontend.
   */
  useEffect(() => {
    // Do not call Gemini while showing the warning.
    if (showNonnaWarning) {
      return;
    }

    // Nothing to send when there are no ingredients.
    if (ingredientCount === 0) {
      return;
    }

    // Only send Gemini requests at these milestones.
    const isMilestone =
      ingredientCount === 1 ||
      ingredientCount === 3 ||
      ingredientCount === 5;

    if (!isMilestone) {
      return;
    }

    /*
     * Create a unique key for this exact request.
     *
     * Example:
     * progress|3|Chicken|Basil|Tomato
     */
    const requestKey = [
      "progress",
      ingredientCount,
      ...ingredientNames
    ].join("|");

    /*
     * Prevent React StrictMode from sending the same request twice.
     */
    if (lastRequestedKeyRef.current === requestKey) {
      return;
    }

    lastRequestedKeyRef.current = requestKey;

    // Give this request a unique ID.
    const requestId = ++requestIdRef.current;

    /*
     * Small delay before calling Gemini.
     *
     * This gives the UI time to update first and prevents
     * the AI request from blocking the interface.
     */
    const timer = setTimeout(async () => {
      try {
        const request = {
          state: "progress",
          ingredientCount,
          ingredients: ingredientNames
        };

        const message = await getNonnaMessage({
          state: request.state,
          ingredientCount: request.ingredientCount,
          selectedIngredients
        });

        /*
         * Ignore the response if a newer Gemini request has already
         * been started.
         */
        if (requestId !== requestIdRef.current) {
          return;
        }

        // Only replace the local message if Gemini returned something.
        if (message) {
          setNonnaMessage(message);
        }
      } catch {
        /*
         * Gemini is an enhancement, not something the UI depends on.
         *
         * If Gemini fails, keep the local (instant) Nonna message instead
         * of breaking the interface.
         */
      }
    }, 500);

    // Cancel the timer if the user changes selections before it fires.
    return () => {
      clearTimeout(timer);
    };
  }, [ingredientCount, ingredientNames, selectedIngredients, showNonnaWarning]);

  return {
    nonnaState,
    nonnaMessage
  };
}
