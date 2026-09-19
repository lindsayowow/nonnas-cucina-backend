import { useEffect, useState } from "react";
import nonnaStates from "../data/nonna.json";
import { getNonnaMessage } from "../services/gemini";

export default function useNonna({
  selectedIngredients,
  showNonnaWarning
}) {
  const [nonnaMessage, setNonnaMessage] = useState(
    "Choose your ingredients, dear!"
  );

  const ingredientCount = selectedIngredients.length;

  function getNonnaState() {
    const requiredCategories = [
      "protein",
      "veggie",
      "noodle",
      "sauce",
      "topping"
    ];

    const selectedCategories = new Set(
      selectedIngredients.map(
        ingredient => ingredient.category
      )
    );

    const hasAllCategories =
      requiredCategories.every(
        category => selectedCategories.has(category)
      );

    if (hasAllCategories) {
      return nonnaStates.find(
        state => state.state === "complete"
      );
    }

    const countState = nonnaStates.find(
      state => state.ingredientCount === ingredientCount
    );

    if (countState) {
      return countState;
    }

    return nonnaStates.find(
      state => state.state === "happy"
    );
  }

  const nonnaState = getNonnaState();

  // Create a stable value representing the selected ingredients.
  // This prevents the Gemini effect from firing just because
  // the selectedIngredients array received a new reference.
  const ingredientNames = selectedIngredients
    .map(ingredient => ingredient.name)
    .join("|");

  useEffect(() => {
    let isCancelled = false;

    async function fetchMessage() {

      // Warning is temporary.
      // Do not call Gemini while the warning is showing.
      if (showNonnaWarning) {
        setNonnaMessage(
          "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!"
        );
        return;
      }

      // No ingredients.
      if (nonnaState.state === "neutral") {
        setNonnaMessage(
          "Choose your ingredients, dear!"
        );
        return;
      }

      const backendState =
        nonnaState.state === "complete"
          ? "complete"
          : "progress";

      console.log("Sending to Nonna:", {
        state: backendState,
        ingredientCount,
        ingredients: selectedIngredients.map(
          ingredient => ingredient.name
        )
      });

      try {
        const message = await getNonnaMessage({
          state: backendState,
          ingredientCount,
          selectedIngredients
        });

        console.log("Nonna response:", message);

        // Ignore responses from old requests.
        if (isCancelled) {
          return;
        }

        setNonnaMessage(
          message ||
          "Bene, bene! Your dish is coming together beautifully!"
        );

      } catch (error) {
        console.error(
          "Nonna Gemini request failed:",
          error
        );

        if (isCancelled) {
          return;
        }

        setNonnaMessage(
          "Bene, bene! Your dish is coming together beautifully!"
        );
      }
    }

    fetchMessage();

    return () => {
      // Cancel this request's ability to update the UI.
      isCancelled = true;
    };

  }, [
    showNonnaWarning,
    ingredientCount,
    ingredientNames,
    nonnaState.state
  ]);

  return {
    nonnaState,
    nonnaMessage,
    ingredientCount
  };
}
