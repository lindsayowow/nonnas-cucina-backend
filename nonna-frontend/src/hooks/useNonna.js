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
          // Rotate through different messages instead of repeating the same
          // message for every selection after five ingredients.
          return happyMessages[
            (ingredientCount - 5) % happyMessages.length
          ];
      }

    default:
      return "Tutto bene! Your dish is coming together beautifully!";
  }
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
  // This ref prevents the exact same request from being sent twice.
  const lastRequestedKeyRef = useRef(null);

  //Gives every Gemini request a unique ID.
  // If the user changes their selections while Gemini is still thinking,
  // an older response won't replace the newer message.
  const requestIdRef = useRef(0);

  const ingredientCount = selectedIngredients.length;

  //  list of ingredient names for the Gemini request.
  const ingredientNames = selectedIngredients.map(
    ingredient => ingredient.name
  );

  // Update Nonna's local state and  message. (default)

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

    // Warning messages.
    if (showNonnaWarning) {
      setNonnaMessage(
        getInstantMessage("warning", ingredientCount)
      );
      return;
    }

    // initial state 
    if (ingredientCount === 0) {
      setNonnaMessage(
        getInstantMessage("neutral", 0)
      );
      return;
    }

    // show an immediate response
    setNonnaMessage(
      getInstantMessage("progress", ingredientCount)
    );
  }, [ingredientCount, showNonnaWarning]);

  // Gemini is only called at 1, 3, 5 ingredients to improve UX
  // All other messages are handled instantly on the frontend.
  useEffect(() => {
    // Do not call Gemini while showing the warning.
    if (showNonnaWarning) {
      return;
    }

    // Nothing to send when there are no ingredients.
    if (ingredientCount === 0) {
      return;
    }

    const isMilestone =
      ingredientCount === 1 ||
      ingredientCount === 3 ||
      ingredientCount === 5;

    if (!isMilestone) {
      return;
    }

    // unique key for this exact request.
    const requestKey = [
      "progress",
      ingredientCount,
      ...ingredientNames
    ].join("|");

    // Prevents from sending the same request twice.
    if (lastRequestedKeyRef.current === requestKey) {
      return;
    }

    lastRequestedKeyRef.current = requestKey;

    //  unique ID for request
    const requestId = ++requestIdRef.current;

    //  delay before calling Gemini to give UI time to update.
    //prevents the request from blocking the interface.
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

        // Ignore the response if a newer one has been started.
        if (requestId !== requestIdRef.current) {
          return;
        }

        // Only replace the local message if request returned something.
        if (message) {
          setNonnaMessage(message);
        }
      } catch {
        // If Gemini fails, use the local  Nonna message instead
      }
    }, 500);

    // Cancel the timer if user changes ingredients before it fires.
    return () => {
      clearTimeout(timer);
    };
  }, [ingredientCount, ingredientNames.join("|"), showNonnaWarning]);

  return {
    nonnaState,
    nonnaMessage
  };
}
